#!/usr/bin/env python3
"""
Validate data/ against the Wikisource original texts in sources/wikisource/.

Checks performed:
  1. Every Wikisource chapter file has real content (length, no chrome).
  2. For books whose chapters align by index (山海经 18, 淮南子), every entity
     name referenced in a chapter's entries/mentions actually occurs in the
     corresponding Wikisource original (traditional->simplified normalized).
     Names that do not occur are reported as potential extraction errors.
  3. Structural integrity: dangling relation endpoints, missing detail files,
     malformed names, relation/entity count consistency.
  4. Relation source/target names occur in the original text of their entry.

This script is read-only with respect to data/ — it writes a JSON report of
findings and prints a human-readable summary. opencc is used only locally for
traditional<->simplified comparison; it is not a dependency of the build.
"""

import json
import re
import subprocess
from collections import defaultdict
from pathlib import Path

from opencc import OpenCC

ROOT = Path(__file__).resolve().parent.parent
DATA = ROOT / "data"
WS = ROOT / "sources" / "wikisource"

t2s = OpenCC("t2s")
s2t = OpenCC("s2t")


def norm(text):
    """Traditional->simplified, strip all non-CJK/alnum for fuzzy matching."""
    text = t2s.convert(text)
    return re.sub(r"[^一-鿿0-9A-Za-z]", "", text)


def load_json(p):
    return json.loads(Path(p).read_text(encoding="utf-8"))


# ── 1. Wikisource file quality ─────────────────────────────────────────────

CHROME_PATTERNS = [
    r"\[编辑\]", r"姊妹计划", r"本作品收[錄录]", r"重定向到",
    r"^←$", r"^→$", r"许可证", r"GNU Free Documentation",
    r"作者：",  # 楚辞 nav header "作者：屈原"
]


def check_wikisource_files():
    findings = []
    for book_dir in sorted(WS.iterdir()):
        if not book_dir.is_dir():
            continue
        for f in sorted(book_dir.glob("*.txt")):
            text = f.read_text(encoding="utf-8")
            rel = f.relative_to(WS)
            if len(text.strip()) < 200:
                findings.append(["error", f"{rel}: too short ({len(text)} chars)"])
            for pat in CHROME_PATTERNS:
                if re.search(pat, text, flags=re.M):
                    findings.append(["warn", f"{rel}: contains chrome /{pat}/"])
    return findings


# ── Chapter alignment between data and Wikisource ──────────────────────────
# data book_id -> list of (data_chapter index, wikisource file) for aligned ones

def aligned_chapters():
    """Yield (book_id, data_chapter_index, ch, ws_file) for aligned books."""
    # shanhaijing: data 1..18 <-> ws 01..18 in identical order.
    ws_dir = WS / "shanhaijing"
    ws_files = sorted(ws_dir.glob("*.txt"))
    for cf in sorted((DATA / "chapters" / "shanhaijing").glob("*.json")):
        ch = load_json(cf)
        wf = ws_files[ch["chapterIndex"] - 1]
        if wf.exists():
            yield "shanhaijing", ch["chapterIndex"], ch, wf

    # huainanzi: data splits 主术训 and 人间训 into (上)/(下), so map by title.
    title_map = {
        "原道训": "02_原道訓", "俶真训": "03_俶真訓", "天文训": "04_天文訓",
        "地形训": "05_墜形訓", "时则训": "06_時則訓", "览冥训": "07_覽冥訓",
        "精神训": "08_精神訓", "本经训": "09_本經訓",
        "主术训(上)": "10_主術訓", "主术训(下)": "10_主術訓",
        "缪称训": "11_繆稱訓", "齐俗训": "12_齊俗訓", "道应训": "13_道應訓",
        "氾论训": "14_氾論訓", "诠言训": "15_詮言訓", "兵略训": "16_兵略訓",
        "说山训": "17_說山訓", "说林训": "18_說林訓",
        "人间训(上)": "19_人間訓", "人间训(下)": "19_人間訓",
        "修务训": "20_脩務訓", "泰族训": "21_泰族訓", "要略": "22_要略",
    }
    ws_dir = WS / "huainanzi"
    for cf in sorted((DATA / "chapters" / "huainanzi").glob("*.json")):
        ch = load_json(cf)
        stem = title_map.get(ch["chapterTitle"])
        if stem:
            wf = ws_dir / f"{stem}.txt"
            if wf.exists():
                yield "huainanzi", ch["chapterIndex"], ch, wf


# ── 2. Entity names occur in aligned Wikisource original ───────────────────

def name_forms(name):
    """Return normalized spelling variants (X山 <-> X之山 etc.)."""
    n = norm(name)
    forms = {n}
    m = re.match(r"^(.+?)(山|水|河|江|海|泽|渊|湖|池|溪|谷|野|丘|陵|国)$", n)
    if m:
        forms.add(norm(m.group(1) + "之" + m.group(2)))
    m2 = re.match(r"^(.+?)之(山|水|河|江|海|泽|渊|湖|池|溪|谷|野|丘|陵|国)$", n)
    if m2:
        forms.add(norm(m2.group(1) + m2.group(2)))
    return forms


def check_entity_names_against_original():
    findings = []
    checked = 0
    missing_examples = defaultdict(list)
    for book_id, idx, ch, ws_file in aligned_chapters():
        ws_norm = norm(ws_file.read_text(encoding="utf-8"))
        names = set()
        for ref in ch.get("entityRefs", []):
            names.add(ref["entityName"])
        for name in names:
            if len(norm(name)) < 2:
                continue
            checked += 1
            if not any(f in ws_norm for f in name_forms(name)):
                missing_examples[name].append(f"{book_id}-{idx:02d}")
    for name, locs in sorted(missing_examples.items()):
        findings.append([
            "info",
            f"name not found in Wikisource original: {name!r} (in {', '.join(locs[:3])}"
            + (" ..." if len(locs) > 3 else "") + ")",
        ])
    return findings, checked, len(missing_examples)


# ── 3. Structural integrity ────────────────────────────────────────────────

def check_structure():
    findings = []
    books = load_json(DATA / "books.json")
    entities = load_json(DATA / "entities.json")
    relations = load_json(DATA / "relations.json")

    # entity summary count vs detail files
    detail_ids = {p.stem for p in (DATA / "entities").glob("*.json")}
    summary_ids = {e["id"] for e in entities["entities"]}
    if detail_ids != summary_ids:
        missing = summary_ids - detail_ids
        extra = detail_ids - summary_ids
        if missing:
            findings.append(["error", f"{len(missing)} entities missing detail files, e.g. {list(missing)[:5]}"])
        if extra:
            findings.append(["warn", f"{len(extra)} orphan detail files, e.g. {list(extra)[:5]}"])

    # relation endpoints exist
    name_set = {e["name"] for e in entities["entities"]}
    dangling = []
    selfloops = []
    for r in relations["relations"]:
        if r["source"] not in name_set:
            dangling.append(("source", r["source"]))
        if r["target"] not in name_set:
            dangling.append(("target", r["target"]))
        if r["source"] == r["target"]:
            selfloops.append((r["source"], r["type"]))
    if dangling:
        findings.append(["error", f"{len(dangling)} dangling relation endpoints: {dangling[:5]}"])
    if selfloops:
        findings.append(["warn", f"{len(selfloops)} self-loop relations: {selfloops[:5]}"])

    # counts consistency
    if books["entityCount"] != entities["count"]:
        findings.append(["error", f"entityCount mismatch books={books['entityCount']} entities={entities['count']}"])
    if books["relationCount"] != relations["count"]:
        findings.append(["error", f"relationCount mismatch books={books['relationCount']} relations={relations['count']}"])

    # malformed names: leading pinyin, latin letters, unmatched parens
    malformed = []
    for e in entities["entities"]:
        nm = e["name"]
        if re.match(r"^[A-Za-z()\s]", nm) or nm.count("(") != nm.count(")"):
            malformed.append(nm)
    if malformed:
        findings.append(["error", f"{len(malformed)} malformed names: {malformed[:5]}"])

    # mention entryIds reference valid chapter entries
    entry_id_set = set()
    for cf in (DATA / "chapters").glob("*/*.json"):
        ch = load_json(cf)
        for ent in ch["entries"]:
            entry_id_set.add(f"{ch['bookId']}-{ch['chapterIndex']:02d}-{ent['index']:02d}")
    bad_mentions = 0
    for p in (DATA / "entities").glob("*.json"):
        e = load_json(p)
        for m in e.get("mentions", []):
            if m["entryId"] not in entry_id_set:
                bad_mentions += 1
    if bad_mentions:
        findings.append(["error", f"{bad_mentions} mentions reference unknown entryIds"])

    # relation occurrences reference valid entryIds
    bad_occ = 0
    for r in relations["relations"]:
        for o in r["occurrences"]:
            if o["entryId"] not in entry_id_set:
                bad_occ += 1
    if bad_occ:
        findings.append(["error", f"{bad_occ} relation occurrences reference unknown entryIds"])

    # chapter entityRefs point to existing entity names
    bad_refs = []
    for cf in (DATA / "chapters").glob("*/*.json"):
        ch = load_json(cf)
        for ref in ch.get("entityRefs", []):
            if ref["entityName"] not in name_set:
                bad_refs.append((ch["id"], ref["entityName"]))
    if bad_refs:
        findings.append(["error", f"{len(bad_refs)} entityRefs point to missing entities, e.g. {bad_refs[:5]}"])

    return findings


# ── 4. Relation endpoints in entry original text ───────────────────────────

def check_regression_vs_head():
    """
    Compare the current entity set against the last committed version
    (git HEAD). Structural checks cannot detect a real entity silently
    disappearing because a filter rule got too broad. This surfaces every
    addition/removal so a regression like deleting a genuine place name is
    visible rather than passing validation. Removals are reported as warnings
    (some deletions are legitimate cleanups of fragments); the human reviews
    the list. Skips silently when not in a git repo or HEAD has no data yet.
    """
    findings = []
    cur = {e["name"]: e["type"] for e in load_json(DATA / "entities.json")["entities"]}
    try:
        old_raw = subprocess.check_output(
            ["git", "show", "HEAD:data/entities.json"],
            cwd=ROOT, stderr=subprocess.DEVNULL,
        )
    except (subprocess.CalledProcessError, FileNotFoundError):
        return findings
    try:
        old = {e["name"]: e["type"] for e in json.loads(old_raw)["entities"]}
    except Exception:
        return findings

    added = sorted(set(cur) - set(old))
    removed = sorted(set(old) - set(cur))
    for name in removed:
        findings.append([
            "warn",
            f"entity removed vs HEAD: {name!r} (was {old[name]}) — confirm this is a "
            f"fragment/duplicate, not a real entity that a new filter dropped",
        ])
    for name in added:
        findings.append(["info", f"entity added vs HEAD: {name!r} ({cur[name]})"])
    if added or removed:
        findings.append([
            "info",
            f"regression summary: +{len(added)} added / -{len(removed)} removed vs HEAD",
        ])
    return findings


def check_relation_endpoints_in_text():
    findings = []
    entities = load_json(DATA / "entities.json")
    relations = load_json(DATA / "relations.json")
    # build entryId -> normalized original text
    entry_text = {}
    for cf in (DATA / "chapters").glob("*/*.json"):
        ch = load_json(cf)
        for ent in ch["entries"]:
            eid = f"{ch['bookId']}-{ch['chapterIndex']:02d}-{ent['index']:02d}"
            entry_text[eid] = norm(ent.get("originalText", ""))

    missing = []
    for r in relations["relations"]:
        for o in r["occurrences"]:
            txt = entry_text.get(o["entryId"], "")
            sn, tn = norm(r["source"]), norm(r["target"])
            if sn and len(sn) >= 2 and not any(f in txt for f in name_forms(r["source"])):
                missing.append((r["source"], o["entryId"], "source"))
            if tn and len(tn) >= 2 and not any(f in txt for f in name_forms(r["target"])):
                missing.append((r["target"], o["entryId"], "target"))
    if missing:
        findings.append(["warn", f"{len(missing)} relation endpoint names not literally in entry text (may be variants): {missing[:5]}"])
    return findings


def main():
    report = {"chrome": check_wikisource_files()}
    report["structure"] = check_structure()
    report["regression"] = check_regression_vs_head()
    report["relationsInText"] = check_relation_endpoints_in_text()
    name_findings, checked, missing = check_entity_names_against_original()
    report["namesInOriginal"] = name_findings
    report["stats"] = {
        "namesChecked": checked,
        "namesMissingFromWikisource": missing,
    }

    out = ROOT / "data" / "validation_report.json"
    out.write_text(json.dumps(report, ensure_ascii=False, indent=2) + "\n", encoding="utf-8")

    print("=== Wikisource validation report ===\n")
    for section, items in report.items():
        if section == "stats":
            print(f"[{section}] {items}")
            continue
        errs = sum(1 for sev, _ in items if sev == "error")
        warns = sum(1 for sev, _ in items if sev == "warn")
        infos = sum(1 for sev, _ in items if sev == "info")
        print(f"[{section}] {len(items)} findings  (err={errs} warn={warns} info={infos})")
        for sev, msg in items[:15]:
            print(f"  {sev[0].upper()}  {msg}")
        if len(items) > 15:
            print(f"  ... {len(items) - 15} more")
        print()


if __name__ == "__main__":
    main()
