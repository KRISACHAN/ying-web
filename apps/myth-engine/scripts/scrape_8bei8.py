#!/usr/bin/env python3
"""
Scraper for 8bei8.com (太极书馆) - Chinese classical texts.
Scrapes four books: 山海经, 搜神记, 楚辞, 淮南子.
Outputs clean Markdown files to sources/8bei8/.

Uses only Python standard library.
"""

import os
import re
import sys
import time
import urllib.request
import urllib.error
from html.parser import HTMLParser
from pathlib import Path

# ── Configuration ──────────────────────────────────────────────────────────

PROXY = os.environ.get("HTTPS_PROXY") or os.environ.get("HTTP_PROXY") or "http://127.0.0.1:7897"
BASE_URL = "https://www.8bei8.com/book"
OUTPUT_DIR = Path(__file__).resolve().parent.parent / "sources" / "8bei8"
DELAY = 1.0  # seconds between requests
TIMEOUT = 30

BOOKS = {
    "shanhaijing": {
        "title": "山海经",
        "filename": "山海经",
        "chapters": [
            ("南山经第一", 1), ("西山经第二", 2), ("北山经第三", 3), ("东山经第四", 4),
            ("中山经第五", 5), ("海外南经第六", 6), ("海外西经第七", 7), ("海外北经第八", 8),
            ("海外东经第九", 9), ("海内南经第十", 10), ("海内西经第十一", 11),
            ("海内北经第十二", 12), ("海内东经第十三", 13), ("大荒东经第十四", 14),
            ("大荒南经第十五", 15), ("大荒西经第十六", 16), ("大荒北经第十七", 17),
            ("海内经第十八", 18),
        ],
    },
    "soushenji": {
        "title": "搜神记",
        "filename": "搜神记",
        "chapters": [
            ("搜神记 卷一", 1), ("搜神记 卷二", 2), ("搜神记 卷三", 3), ("搜神记 卷四", 4),
            ("搜神记 卷五", 5), ("搜神记 卷六", 6), ("搜神记 卷七", 7), ("搜神记 卷八", 8),
            ("搜神记 卷九", 9), ("搜神记 卷十", 10), ("搜神记 卷十一", 11),
            ("搜神记 卷十二", 12), ("搜神记 卷十三", 13), ("搜神记 卷十四", 14),
            ("搜神记 卷十五", 15), ("搜神记 卷十六", 16), ("搜神记 卷十七", 17),
            ("搜神记 卷十八", 18), ("搜神记 卷十九", 19), ("搜神记 卷二十", 20),
            ("搜神后记 卷一", 21), ("搜神后记 卷二", 22), ("搜神后记 卷三", 23),
            ("搜神后记 卷四", 24), ("搜神后记 卷五", 25), ("搜神后记 卷六", 26),
            ("搜神后记 卷七", 27), ("搜神后记 卷八", 28), ("搜神后记 卷九", 29),
            ("搜神后记 卷十", 30), ("搜神后记 佚文", 31),
        ],
    },
    "chuci": {
        "title": "楚辞",
        "filename": "楚辞",
        "chapters": [
            ("离骚", 1), ("九歌", 2), ("天问", 3), ("九章", 4), ("远游", 5),
            ("卜居", 6), ("渔父", 7), ("九辩", 8), ("惜誓", 9), ("招隐士", 10),
            ("七谏", 11), ("九怀", 12), ("九叹", 13),
        ],
    },
    "huainanzi": {
        "title": "淮南子",
        "filename": "淮南子",
        "chapters": [
            ("《淮南子》导读", 1), ("原道训", 2), ("俶真训", 3), ("天文训", 4),
            ("地形训", 5), ("时则训", 6), ("览冥训", 7), ("精神训", 8),
            ("本经训", 9), ("主术训(上)", 10), ("主术训(下)", 11), ("缪称训", 12),
            ("齐俗训", 13), ("道应训", 14), ("氾论训", 15), ("诠言训", 16),
            ("说山训", 17), ("兵略训", 18), ("说林训", 19), ("人间训(上)", 20),
            ("人间训(下)", 21), ("修务训", 22), ("泰族训", 23), ("要略", 24),
        ],
    },
}


# ── HTML Content Extractor ─────────────────────────────────────────────────

class ContentExtractor(HTMLParser):
    """
    Extracts structured book content from 8bei8 chapter pages.

    The page uses malformed HTML (unclosed <p> tags), so instead of depth
    counting we use a state machine driven by section label divs.

    Repeating block structure:
      <div class='tips tips_yuanwen'>原文</div>  ← label
      <div class=yuanwen>TEXT...</div>           ← content (until next label)
      <div class='tips tips_zhushi'>注释</div>   ← label
      <div class=zhushi>TEXT...</div>            ← content
      <div class='tips tips_yiwen'>译文</div>    ← label
      <p>TEXT...</p>                             ← content (until next label)

    <sup> contains footnote markers to strip. <tt> wraps punctuation to keep.
    """

    # States
    PRE_CONTENT = "pre"
    LABEL = "label"
    YUANWEN = "yuanwen"
    ZHUSHI = "zhushi"
    YIWEN = "yiwen"

    def __init__(self):
        super().__init__()
        self.sections = []
        self._state = self.PRE_CONTENT
        self._pending_type = None  # set when label starts; content begins after label ends
        self._current_text = []
        self._chapter_title = None
        self._pre_title = []
        self._sup_depth = 0
        self._label_closed = False  # track when </div> closes the label

    def _flush(self):
        if self._state in (self.YUANWEN, self.ZHUSHI, self.YIWEN):
            text = "".join(self._current_text).strip()
            if text:
                self.sections.append((self._state, text))
        self._current_text = []

    def handle_starttag(self, tag, attrs):
        attrs_dict = dict(attrs)
        cls = attrs_dict.get("class", "")

        # ── Section labels trigger state transitions ───────────────
        if "tips_yuanwen" in cls:
            self._flush()
            self._state = self.LABEL
            self._pending_type = self.YUANWEN
            self._label_closed = False
            return
        if "tips_zhushi" in cls:
            self._flush()
            self._state = self.LABEL
            self._pending_type = self.ZHUSHI
            self._label_closed = False
            return
        if "tips_yiwen" in cls:
            self._flush()
            self._state = self.LABEL
            self._pending_type = self.YIWEN
            self._label_closed = False
            return

        # ── Inside a label div ─────────────────────────────────────
        if self._state == self.LABEL:
            return

        # ── Before content: collect chapter title ──────────────────
        if self._state == self.PRE_CONTENT:
            if tag == "p":
                text_so_far = "".join(self._pre_title).strip()
                if text_so_far and not self._chapter_title:
                    self._chapter_title = text_so_far
                self._pre_title = []
            return

        # ── Inside content sections ────────────────────────────────
        if tag == "sup":
            self._sup_depth = 1
        elif tag in ("p", "br") and self._state in (self.YUANWEN, self.ZHUSHI, self.YIWEN):
            self._current_text.append("\n\n")
        # <tt> and other inline tags: transparent — data flows through
        # <div> in content: usually nested or structural; ignore

    def handle_endtag(self, tag):
        # Footnote marker ends
        if self._sup_depth > 0:
            if tag == "sup":
                self._sup_depth = 0
            return

        # Label </div> closes it → switch to pending content type
        if self._state == self.LABEL and tag == "div":
            self._state = self._pending_type
            self._current_text = []
            return

    def handle_data(self, data):
        if self._sup_depth > 0:
            return
        if self._state == self.LABEL:
            return  # skip "原文", "注释", "译文"
        if self._state == self.PRE_CONTENT:
            self._pre_title.append(data)
            return
        # YUANWEN / ZHUSHI / YIWEN
        self._current_text.append(data)

    def get_result(self):
        self._flush()
        title = self._chapter_title or ""
        return title, self.sections


def clean_text(text):
    """Clean up extracted text: normalize whitespace, remove extra blank lines."""
    # Replace multiple spaces/newlines
    text = re.sub(r'\n{3,}', '\n\n', text)
    text = re.sub(r'[ \t]+', ' ', text)
    # Remove spaces at line starts/ends
    lines = [line.strip() for line in text.split('\n')]
    text = '\n'.join(lines)
    text = re.sub(r'\n{3,}', '\n\n', text)
    return text.strip()


def find_content_bounds(html):
    """Find (start, end) positions of book content in page HTML."""
    # Footer markers
    footer_markers = [
        "<div class='footer'",
        'class="footer"',
        "book_wenku.runFunctionFoot",
        "nextPage",
    ]
    end_pos = len(html)
    for marker in footer_markers:
        pos = html.find(marker)
        if pos > 0:
            end_pos = min(end_pos, pos)

    # Content starts after 5 consecutive closing </div> tags (end of nav)
    nav_end = html.find("</div></div></div></div></div>")
    if nav_end == -1:
        nav_end = 0
    else:
        nav_end += len("</div></div></div></div></div>")

    return nav_end, end_pos


def strip_html_to_text(html_fragment):
    """Convert an HTML fragment to plain text, preserving paragraph breaks."""
    # Replace block-level tags with newlines
    text = re.sub(r'<br\s*/?>', '\n', html_fragment, flags=re.IGNORECASE)
    text = re.sub(r'</p>', '\n\n', text, flags=re.IGNORECASE)
    text = re.sub(r'</div>', '\n', text, flags=re.IGNORECASE)
    # Remove <sup> footnote markers entirely
    text = re.sub(r'<sup[^>]*>.*?</sup>', '', text, flags=re.DOTALL | re.IGNORECASE)
    # Strip remaining tags
    text = re.sub(r'<[^>]+>', '', text)
    # Decode common HTML entities
    text = text.replace('&nbsp;', ' ').replace('&amp;', '&')
    text = text.replace('&lt;', '<').replace('&gt;', '>')
    text = text.replace('&quot;', '"').replace('&#39;', "'")
    return clean_text(text)


def extract_chapter_content(html):
    """Extract structured content from a chapter page HTML."""
    start_pos, end_pos = find_content_bounds(html)

    # Look for structured sections (tips_yuanwen etc.)
    first_section = html.find("tips_yuanwen", start_pos, end_pos)
    if first_section == -1:
        first_section = html.find("tips_zhushi", start_pos, end_pos)
    if first_section == -1:
        first_section = html.find("tips_yiwen", start_pos, end_pos)

    if first_section == -1:
        # Unstructured chapter (e.g. 淮南子 导读) — extract plain text
        raw = html[start_pos:end_pos]
        title, body = split_title_from_html(raw)
        text = strip_html_to_text(body)
        if text:
            return title, [("plain", text)]
        return "", []

    # Structured chapter: find title before first section
    pre = html[start_pos:first_section]
    title, title_end = split_title_from_html(pre, return_offset=True)

    content_start = start_pos + title_end if title_end else first_section
    content_html = html[content_start:end_pos]

    parser = ContentExtractor()
    try:
        parser.feed(content_html)
    except Exception:
        pass
    parsed_title, sections = parser.get_result()

    if parsed_title:
        title = parsed_title

    cleaned = [(stype, clean_text(stext)) for stype, stext in sections]
    return title, cleaned


def split_title_from_html(html_fragment, return_offset=False):
    """
    Given the HTML before structured content begins, extract the chapter title.
    The title is the first substantial text after navigation, before the first <p>.
    Returns (title, offset) where offset is the position where body content begins.
    """
    # The title appears between nav </div>s and the first <p> tag
    m = re.search(r'(.+?)(?:<p>|$)', html_fragment, re.DOTALL)
    if m:
        title_raw = m.group(1)
        title = re.sub(r'<[^>]+>', '', title_raw).strip()
        offset = m.end(1)
        if return_offset:
            return title, offset
        return title, html_fragment[offset:]
    if return_offset:
        return "", 0
    return "", html_fragment


def format_markdown(book_title, chapter_title, sections):
    """Format extracted sections as Markdown."""
    lines = []
    lines.append(f"# {book_title} · {chapter_title}")
    lines.append("")

    for stype, stext in sections:
        if stype == "yuanwen":
            lines.append("## 原文")
            lines.append("")
            lines.append(stext)
            lines.append("")
        elif stype == "zhushi":
            lines.append("## 注释")
            lines.append("")
            lines.append(stext)
            lines.append("")
        elif stype == "yiwen":
            lines.append("## 译文")
            lines.append("")
            lines.append(stext)
            lines.append("")
        elif stype == "plain":
            lines.append(stext)
            lines.append("")

    return "\n".join(lines)


def fetch_url(url, retries=3):
    """Fetch a URL with retries and proxy support."""
    proxy_handler = urllib.request.ProxyHandler({
        "http": PROXY,
        "https": PROXY,
    })
    opener = urllib.request.build_opener(proxy_handler)
    opener.addheaders = [
        ("User-Agent", "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36"),
        ("Accept", "text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8"),
        ("Accept-Language", "zh-CN,zh;q=0.9,en;q=0.8"),
    ]

    for attempt in range(retries):
        try:
            with opener.open(url, timeout=TIMEOUT) as resp:
                charset = resp.headers.get_content_charset() or "utf-8"
                return resp.read().decode(charset, errors="replace")
        except (urllib.error.URLError, urllib.error.HTTPError, OSError) as e:
            if attempt < retries - 1:
                wait = DELAY * (attempt + 1) * 2
                print(f"  Retry {attempt+1}/{retries} after error: {e}, waiting {wait}s...")
                time.sleep(wait)
            else:
                raise


def scrape_book(book_key, book_info):
    """Scrape all chapters of a book and save as Markdown."""
    title = book_info["title"]
    chapters = book_info["chapters"]
    book_dir = OUTPUT_DIR / book_info["filename"]
    book_dir.mkdir(parents=True, exist_ok=True)

    print(f"\n{'='*60}")
    print(f"Scraping 《{title}》 ({len(chapters)} chapters)")
    print(f"{'='*60}")

    # Create an index file
    index_lines = [f"# {title}", "", f"共 {len(chapters)} 篇。", ""]

    success_count = 0
    fail_count = 0

    for idx, (chapter_title, page_num) in enumerate(chapters):
        url = f"{BASE_URL}/{book_key}_{page_num}.html"
        filename = f"{page_num:02d}_{chapter_title}.md"
        # Sanitize filename
        filename = re.sub(r'[/\\:*?"<>|]', '_', filename)
        filepath = book_dir / filename

        print(f"  [{idx+1}/{len(chapters)}] {chapter_title} ...", end=" ", flush=True)

        try:
            html = fetch_url(url)
            page_title, sections = extract_chapter_content(html)

            if not sections:
                print("⚠️  No content found!")
                fail_count += 1
                continue

            md_content = format_markdown(title, chapter_title, sections)
            filepath.write_text(md_content, encoding="utf-8")

            section_counts = {}
            for stype, _ in sections:
                section_counts[stype] = section_counts.get(stype, 0) + 1

            print(f"✓  ({len(sections)} blocks: {', '.join(f'{k}={v}' for k,v in section_counts.items())})")
            success_count += 1

            # Add to index
            index_lines.append(f"- [{chapter_title}]({filename.replace(' ', '%20')})")

        except Exception as e:
            print(f"✗  Error: {e}")
            fail_count += 1

        # Polite delay
        if idx < len(chapters) - 1:
            time.sleep(DELAY)

    # Write index
    index_lines.append("")
    (book_dir / "README.md").write_text("\n".join(index_lines), encoding="utf-8")

    print(f"\n  Done: {success_count} succeeded, {fail_count} failed")
    return success_count, fail_count


def main():
    print(f"Output directory: {OUTPUT_DIR}")
    print(f"Proxy: {PROXY}")
    OUTPUT_DIR.mkdir(parents=True, exist_ok=True)

    total_success = 0
    total_fail = 0

    for book_key, book_info in BOOKS.items():
        s, f = scrape_book(book_key, book_info)
        total_success += s
        total_fail += f

    print(f"\n{'='*60}")
    print(f"All done! {total_success} chapters succeeded, {total_fail} failed.")
    print(f"Files saved to: {OUTPUT_DIR}")
    print(f"{'='*60}")

    return 0 if total_fail == 0 else 1


if __name__ == "__main__":
    sys.exit(main())
