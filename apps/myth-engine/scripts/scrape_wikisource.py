#!/usr/bin/env python3
"""
Scraper for zh.wikisource.org — four Chinese classical texts:
  山海經, 搜神記, 楚辭, 淮南子.

For each chapter subpage it fetches the parsed HTML via the MediaWiki API,
strips site chrome (navigation headers, sister-project links, license boxes,
footnote references, styles), and writes the cleaned classical text as plain
UTF-8 text into sources/wikisource/<book>/NN_<title>.txt.

Uses only the Python standard library. A polite User-Agent and a delay between
requests are used; transient failures are retried with backoff.
"""

import html as html_mod
import json
import re
import time
import urllib.parse
import urllib.request
import urllib.error
from html.parser import HTMLParser
from pathlib import Path

# ── Configuration ──────────────────────────────────────────────────────────

API = "https://zh.wikisource.org/w/api.php"
UA = "YingMythEngine/1.0 (educational research; local script)"
OUTPUT_DIR = Path(__file__).resolve().parent.parent / "sources" / "wikisource"
DELAY = 3.0          # seconds between requests
TIMEOUT = 40
MAX_RETRIES = 6

# Chapter subpage titles (URL-decoded, as used by the API `page` parameter).
BOOKS = {
    "shanhaijing": {
        "title": "山海經",
        "chapters": [
            "南山經", "西山經", "北山經", "東山經", "中山經",
            "海外南經", "海外西經", "海外北經", "海外東經",
            "海內南經", "海內西經", "海內北經", "海內東經",
            "大荒東經", "大荒南經", "大荒西經", "大荒北經", "海內經",
        ],
    },
    "soushenji": {
        "title": "搜神記",
        "chapters": [
            "序",
            "第01卷", "第02卷", "第03卷", "第04卷", "第05卷",
            "第06卷", "第07卷", "第08卷", "第09卷", "第10卷",
            "第11卷", "第12卷", "第13卷", "第14卷", "第15卷",
            "第16卷", "第17卷", "第18卷", "第19卷", "第20卷",
        ],
    },
    "chuci": {
        "title": "楚辭",
        # Chapter page titles as resolved from the Chuci table of contents.
        # The first four live at the top level (離騷/九歌/天問/九章);
        # the rest use the 楚辭/... subpage namespace or a disambiguated title.
        "chapters": [
            "離騷", "九歌", "天問", "九章",
            "楚辭/遠遊", "卜居_(屈原)", "漁父", "九辯", "招䰟",
            "大招", "惜誓", "招隱士", "七諫", "哀時命",
            "九懷", "九歎", "九思",
        ],
    },
    "huainanzi": {
        "title": "淮南子",
        "chapters": [
            "敘目", "原道訓", "俶真訓", "天文訓", "墜形訓", "時則訓",
            "覽冥訓", "精神訓", "本經訓", "主術訓", "繆稱訓", "齊俗訓",
            "道應訓", "氾論訓", "詮言訓", "兵略訓", "說山訓", "說林訓",
            "人間訓", "脩務訓", "泰族訓", "要略",
        ],
    },
}


# ── HTML cleaning ──────────────────────────────────────────────────────────

class TextExtractor(HTMLParser):
    """
    Extract readable text from the mw-parser-output block.

    Strategy: walk the whole document but only emit text once we are inside
    <div class="mw-parser-output">. Drop non-content containers entirely:
      - tables with class ws-header / sidebar (navigation)
      - the license container, reference lists, style/script blocks
      - sup.reference footnote markers
    Convert <p>, <br>, headings and list items into line breaks.
    """

    # Tags whose content should be skipped wholesale
    SKIP_TAGS = {"style", "script", "table", "ul", "sup"}

    def __init__(self):
        super().__init__(convert_charrefs=True)
        self.in_content = False
        self.depth_content = 0
        self.skip_depth = 0          # >0 when inside a skipped container
        self.parts = []
        self.current = []
        # Heading / block handling
        self.in_heading = False

    def _flush(self, separator="\n"):
        text = "".join(self.current).strip()
        self.current = []
        if text:
            self.parts.append(text)

    def handle_starttag(self, tag, attrs):
        ad = dict(attrs)
        classes = ad.get("class", "")

        if tag == "div" and "mw-parser-output" in classes:
            self.in_content = True
            self.depth_content = 1
            return

        if not self.in_content:
            return

        if tag == "div":
            self.depth_content += 1
            if "licenseContainer" in classes or "navbox" in classes:
                self.skip_depth += 1
            return

        if self.skip_depth:
            return

        # Skip navigation/header tables and sister-project <ul> sidebars.
        # Wikisource chapter nav tables carry no class but use characteristic
        # inline style variables; detect those by signature.
        if tag == "table":
            style = ad.get("style", "")
            if ("ws-header" in classes or "sidebar" in classes or "toc" in classes
                    or "border-color-content-added" in style
                    or "background-color-progressive-subtle" in style
                    or "background:var(--background-color-progressive-subtle" in style):
                self.skip_depth += 1
            return
        if tag == "ul":
            if ("plainlinks" in classes or "sidebar" in classes
                    or "plainSister" in ad.get("id", "")):
                self.skip_depth += 1
            return
        if tag in ("script", "style"):
            self.skip_depth += 1
            return
        if tag == "sup" and "reference" in classes:
            self.skip_depth += 1
            return
        if tag == "div" and ("editlink" in classes or "hatnote" in classes):
            self.skip_depth += 1
            return

        if tag in ("p", "br", "li"):
            self._flush()
            if tag == "li":
                self.current.append("")
        elif tag in ("h1", "h2", "h3", "h4"):
            self._flush()
            self.in_heading = True
        elif tag == "hr":
            self._flush()

    def handle_endtag(self, tag):
        if not self.in_content:
            return
        if tag == "div":
            self.depth_content -= 1
            if self.skip_depth:
                self.skip_depth -= 1
            if self.depth_content <= 0:
                self.in_content = False
            return
        if self.skip_depth:
            if tag in self.SKIP_TAGS or tag in ("table", "div"):
                self.skip_depth -= 1
            return
        if tag in ("p", "li", "h1", "h2", "h3", "h4"):
            self._flush()
            self.in_heading = False

    def handle_data(self, data):
        if self.in_content and not self.skip_depth:
            self.current.append(data)

    def text(self):
        self._flush()
        # Collapse the per-element parts into lines, then tidy whitespace.
        lines = []
        for p in self.parts:
            for line in p.splitlines():
                line = line.strip()
                if line:
                    lines.append(line)
        return "\n\n".join(lines)


def clean_html(html_text):
    """Extract the main prose from a parsed Wikisource page's HTML."""
    ext = TextExtractor()
    ext.feed(html_text)
    text = ext.text()
    # Remove residual bracketed footnote markers like [1], [2] and edit links
    text = re.sub(r"\[\d+\]", "", text)
    text = re.sub(r"\[编辑\]", "", text)
    # Remove residual "编辑" edit-section labels and sister-project boilerplate
    text = re.sub(r"^\s*编辑\s*$", "", text, flags=re.M)
    text = re.sub(r"姊妹计划.*", "", text)
    text = re.sub(r"本作品收[錄录]於.*", "", text)
    # Public-domain license boilerplate (appears as trailing prose); the era
    # prefix varies (此作品 / 此先秦作品 / 此西漢作品 …).
    text = re.sub(r"此.{0,6}作品在全世界都[属屬][于於]公有[领領]域.*", "", text)
    text = re.sub(r"Public domain.*", "", text, flags=re.IGNORECASE)
    # Collapse 3+ blank lines
    text = re.sub(r"\n{3,}", "\n\n", text)
    return text.strip()


# ── Fetching ───────────────────────────────────────────────────────────────

def fetch_page(title, retries=MAX_RETRIES):
    """Fetch parsed HTML for a page title via the MediaWiki API."""
    params = {
        "action": "parse",
        "page": title,
        "prop": "text",
        "format": "json",
        "formatversion": "2",
        "utf8": "1",
        "redirects": "1",
    }
    url = API + "?" + urllib.parse.urlencode(params)
    last_err = None
    for attempt in range(1, retries + 1):
        try:
            req = urllib.request.Request(url, headers={
                "User-Agent": UA,
                "Accept": "application/json",
                "Api-User-Agent": UA,
            })
            with urllib.request.urlopen(req, timeout=TIMEOUT) as resp:
                raw = resp.read().decode("utf-8")
                data = json.loads(raw)
            if "error" in data:
                raise RuntimeError(f"API error for {title!r}: {data['error']}")
            return data["parse"]["text"]
        except urllib.error.HTTPError as e:
            last_err = e
            if e.code == 429:
                # Honor the Retry-After header if present, else back off.
                ra = e.headers.get("Retry-After")
                wait = int(ra) if ra and ra.isdigit() else 15 * attempt
                print(f"  ! 429 rate-limited on {title}; waiting {wait}s "
                      f"(attempt {attempt}/{retries})")
                time.sleep(wait)
                continue
            wait = 3 * attempt
            print(f"  ! HTTP {e.code} on {title}; retrying in {wait}s")
            time.sleep(wait)
        except (urllib.error.URLError, TimeoutError, json.JSONDecodeError) as e:
            last_err = e
            wait = 3 * attempt
            print(f"  ! attempt {attempt}/{retries} failed for {title}: {e}; retrying in {wait}s")
            time.sleep(wait)
    raise RuntimeError(f"Failed to fetch {title}: {last_err}")


def slugify(name):
    """Filesystem-safe ascii-ish slug; keeps CJK by stripping unsafe chars."""
    name = name.replace("/", "_").replace(" ", "")
    return re.sub(r'[\\/:*?"<>|]', "_", name)


def main():
    OUTPUT_DIR.mkdir(parents=True, exist_ok=True)
    total = 0
    manifest = {"generatedFrom": API, "books": {}}

    for book_id, meta in BOOKS.items():
        book_title = meta["title"]
        book_dir = OUTPUT_DIR / book_id
        book_dir.mkdir(parents=True, exist_ok=True)
        print(f"\n=== {book_title} ({book_id}) ===")
        chapters_out = []
        for idx, chap in enumerate(meta["chapters"], start=1):
            # Most books use the 書名/篇名 subpage convention. The Chuci list
            # already carries the exact page title for every chapter.
            if book_id == "chuci":
                page_title = chap
            elif "/" in chap:
                page_title = chap
            else:
                page_title = f"{book_title}/{chap}"

            print(f"  [{idx:02d}] {page_title}")
            fname = f"{idx:02d}_{slugify(chap)}.txt"
            out_path = book_dir / fname

            # Resume: skip chapters already downloaded with non-empty content.
            if out_path.exists() and out_path.stat().st_size > 200:
                prose = out_path.read_text(encoding="utf-8").rstrip("\n")
                print(f"      (cached, {len(prose)} chars)")
            else:
                try:
                    html_text = fetch_page(page_title)
                    prose = clean_html(html_text)
                except Exception as e:
                    print(f"      !! FAILED: {e}")
                    chapters_out.append({
                        "index": idx, "title": chap,
                        "pageTitle": page_title, "error": str(e),
                    })
                    continue
                out_path.write_text(prose + "\n", encoding="utf-8")
                time.sleep(DELAY)
            total += 1
            chapters_out.append({
                "index": idx,
                "title": chap,
                "pageTitle": page_title,
                "file": f"{book_id}/{fname}",
                "charCount": len(prose),
                "sourceUrl": "https://zh.wikisource.org/wiki/"
                             + urllib.parse.quote(page_title.replace(" ", "_")),
            })

        manifest["books"][book_id] = {
            "title": book_title,
            "chapters": chapters_out,
        }

    (OUTPUT_DIR / "manifest.json").write_text(
        json.dumps(manifest, ensure_ascii=False, indent=2) + "\n", encoding="utf-8"
    )
    print(f"\nDone. {total} chapters written to {OUTPUT_DIR}")


if __name__ == "__main__":
    main()
