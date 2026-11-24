#!/usr/bin/env python3
"""Extract a TR doc to plain Markdown-ish text, so the plan is written from the
whole document rather than from the first 20 PDF pages the Read tool shows.

Usage:
    python -I read-tr.py <tr-doc> <out.md>

Supports:
    .pdf   pdftotext (poppler) if on PATH, else the `pypdf` package
           (pip install pypdf). Page breaks become "--- page N ---".
    .docx  stdlib only (zip + XML). Headings become #, list items become -.
    .md / .txt   copied through.

Prints the page / paragraph count and the output path. It never invents
content: if a PDF page has no extractable text (a scanned image or a
screenshot), it writes "[page N: no text layer, read it as an image]" so the
gap is visible and the page can be opened with the Read tool instead.
"""
import re
import shutil
import subprocess
import sys
import zipfile
import xml.etree.ElementTree as ET
from pathlib import Path


def pdf_text(path: Path) -> list[str]:
    if shutil.which("pdftotext"):
        out = subprocess.run(
            ["pdftotext", "-layout", str(path), "-"],
            capture_output=True, text=True, encoding="utf-8", errors="replace",
            check=True,
        ).stdout
        return out.split("\f")
    try:
        from pypdf import PdfReader  # type: ignore
        import logging
        logging.getLogger("pypdf").setLevel(logging.ERROR)  # malformed-float noise
    except ImportError:
        sys.exit(
            "No PDF extractor: install poppler (pdftotext) or run `pip install pypdf`,\n"
            "or read the PDF directly with the Read tool, 20 pages per call."
        )
    return [(p.extract_text() or "") for p in PdfReader(str(path)).pages]


W = "{http://schemas.openxmlformats.org/wordprocessingml/2006/main}"


def docx_text(path: Path) -> list[str]:
    with zipfile.ZipFile(path) as z:
        root = ET.fromstring(z.read("word/document.xml"))
    lines: list[str] = []
    for p in root.iter(W + "p"):
        style = p.find(f"{W}pPr/{W}pStyle")
        sval = style.get(W + "val", "") if style is not None else ""
        is_list = p.find(f"{W}pPr/{W}numPr") is not None
        text = "".join(t.text or "" for t in p.iter(W + "t")).strip()
        if not text:
            continue
        m = re.match(r"(?i)heading\s*(\d)", sval) or re.match(r"(?i)title", sval)
        if m:
            level = int(m.group(1)) if m.groups() else 1
            lines.append("#" * min(level, 6) + " " + text)
        elif is_list:
            lines.append("- " + text)
        else:
            lines.append(text)
    return ["\n\n".join(lines)]


def main() -> None:
    if len(sys.argv) != 3:
        sys.exit(__doc__)
    src, dst = Path(sys.argv[1]), Path(sys.argv[2])
    ext = src.suffix.lower()
    if ext == ".pdf":
        pages = pdf_text(src)
        parts = []
        for i, t in enumerate(pages, 1):
            t = t.rstrip()
            if not t and i == len(pages):
                continue  # trailing form feed
            body = t if t.strip() else f"[page {i}: no text layer, read it as an image]"
            parts.append(f"--- page {i} ---\n{body}")
        out, unit, n = "\n\n".join(parts), "pages", len(parts)
    elif ext == ".docx":
        out = docx_text(src)[0]
        unit, n = "paragraphs", out.count("\n\n") + 1
    elif ext in (".md", ".txt", ".markdown"):
        out = src.read_text(encoding="utf-8", errors="replace")
        unit, n = "lines", out.count("\n") + 1
    else:
        sys.exit(f"Unsupported TR doc type: {ext} (pdf, docx, md, txt)")
    dst.parent.mkdir(parents=True, exist_ok=True)
    dst.write_text(f"<!-- extracted from {src.name} -->\n\n{out}\n", encoding="utf-8")
    empty = out.count("no text layer")
    print(f"{dst}  {n} {unit}" + (f", {empty} without text (open those as images)" if empty else ""))


if __name__ == "__main__":
    main()
