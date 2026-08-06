#!/usr/bin/env python3
"""One-time OAuth helper for Moments → Google Drive photo storage.

1. Google Cloud Console → create OAuth client (Desktop app)
2. Enable Google Drive API
3. Create a Drive folder for Armonia Moments; copy its folder ID from the URL
4. Run:  python3 scripts/google_drive_auth.py
5. Put the printed env vars into .env and Vercel
"""

from __future__ import annotations

import json
import sys
import urllib.parse
import urllib.request
import webbrowser
from http.server import BaseHTTPRequestHandler, HTTPServer

AUTH_URL = "https://accounts.google.com/o/oauth2/v2/auth"
TOKEN_URL = "https://oauth2.googleapis.com/token"
SCOPES = "https://www.googleapis.com/auth/drive.file"
REDIRECT = "http://127.0.0.1:8765/"


def main() -> int:
    client_id = input("GOOGLE_DRIVE_CLIENT_ID: ").strip()
    client_secret = input("GOOGLE_DRIVE_CLIENT_SECRET: ").strip()
    folder_id = input("GOOGLE_DRIVE_FOLDER_ID: ").strip()
    if not (client_id and client_secret and folder_id):
        print("All three values are required.", file=sys.stderr)
        return 1

    params = urllib.parse.urlencode({
        "client_id": client_id,
        "redirect_uri": REDIRECT,
        "response_type": "code",
        "scope": SCOPES,
        "access_type": "offline",
        "prompt": "consent",
    })
    url = f"{AUTH_URL}?{params}"
    code_box: dict[str, str] = {}

    class Handler(BaseHTTPRequestHandler):
        def do_GET(self):  # noqa: N802
            qs = urllib.parse.urlparse(self.path).query
            code = urllib.parse.parse_qs(qs).get("code", [""])[0]
            code_box["code"] = code
            self.send_response(200)
            self.send_header("Content-Type", "text/html; charset=utf-8")
            self.end_headers()
            self.wfile.write(b"<h1>Armonia Drive connected. You can close this tab.</h1>")

        def log_message(self, *_args):
            return

    server = HTTPServer(("127.0.0.1", 8765), Handler)
    print("\nOpen this URL if the browser does not (authorize Drive file access):\n")
    print(url)
    print("\nWaiting for Google redirect…")
    webbrowser.open(url)
    while "code" not in code_box:
        server.handle_request()

    body = urllib.parse.urlencode({
        "code": code_box["code"],
        "client_id": client_id,
        "client_secret": client_secret,
        "redirect_uri": REDIRECT,
        "grant_type": "authorization_code",
    }).encode("utf-8")
    req = urllib.request.Request(
        TOKEN_URL,
        data=body,
        method="POST",
        headers={"Content-Type": "application/x-www-form-urlencoded"},
    )
    with urllib.request.urlopen(req, timeout=30) as resp:
        payload = json.loads(resp.read().decode("utf-8"))
    refresh = payload.get("refresh_token")
    if not refresh:
        print("No refresh_token returned. Revoke prior grants and retry with prompt=consent.", file=sys.stderr)
        print(json.dumps(payload, indent=2))
        return 1

    print("\nAdd these to .env and Vercel:\n")
    print(f"GOOGLE_DRIVE_CLIENT_ID={client_id}")
    print(f"GOOGLE_DRIVE_CLIENT_SECRET={client_secret}")
    print(f"GOOGLE_DRIVE_REFRESH_TOKEN={refresh}")
    print(f"GOOGLE_DRIVE_FOLDER_ID={folder_id}")
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
