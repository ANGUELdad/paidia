#!/usr/bin/env python3
"""Regenerate design/system-preview.html from index.html's shipped <style> block.

The style guide has to be self-contained: server.py serves an allowlist of app
files only (never fall through to a directory listing that would expose .env,
source and the SQLite file), so the guide cannot fetch index.html at runtime.
Re-run this after any CSS change:

    python3 scripts/build-style-guide.py
"""
import pathlib
import sys

root = pathlib.Path(__file__).resolve().parent.parent
index = (root / "index.html").read_text()
src = (root / "design" / "system-preview.src.html").read_text()

start, end = index.index("<style>"), index.index("</style>")
css = index[start:end + len("</style>")]

marker = "<!--SHIPPED_CSS-->"
if marker not in src:
    sys.exit("template is missing the %s marker" % marker)

out = root / "design" / "system-preview.html"
out.write_text(src.replace(marker, css))
print("wrote %s (%d KB of shipped CSS)" % (out.relative_to(root), len(css) // 1024))
