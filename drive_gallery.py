"""Optional Google Drive backend for Moments photos.

Stores image bytes in a Drive folder so Postgres/Vercel do not hold megabytes of
base64. Configure with a Google Cloud OAuth desktop/web client + refresh token
shared to a folder the account can write:

  GOOGLE_DRIVE_CLIENT_ID=
  GOOGLE_DRIVE_CLIENT_SECRET=
  GOOGLE_DRIVE_REFRESH_TOKEN=
  GOOGLE_DRIVE_FOLDER_ID=

Photos are served back through /api/gallery/media/<fileId> (auth required).
When Drive is not configured, callers keep embedding data: URLs.
"""

from __future__ import annotations

import base64
import json
import os
import time
import urllib.error
import urllib.parse
import urllib.request
from typing import Optional

TOKEN_URL = "https://oauth2.googleapis.com/token"
UPLOAD_URL = "https://www.googleapis.com/upload/drive/v3/files?uploadType=multipart"
META_URL = "https://www.googleapis.com/drive/v3/files"
DOWNLOAD_TMPL = "https://www.googleapis.com/drive/v3/files/{file_id}?alt=media"

_token_cache: dict = {"access": "", "exp": 0.0}


def drive_configured() -> bool:
    return bool(
        os.environ.get("GOOGLE_DRIVE_CLIENT_ID", "").strip()
        and os.environ.get("GOOGLE_DRIVE_CLIENT_SECRET", "").strip()
        and os.environ.get("GOOGLE_DRIVE_REFRESH_TOKEN", "").strip()
        and os.environ.get("GOOGLE_DRIVE_FOLDER_ID", "").strip()
    )


def _access_token() -> str:
    now = time.time()
    if _token_cache["access"] and _token_cache["exp"] > now + 60:
        return str(_token_cache["access"])
    body = urllib.parse.urlencode({
        "client_id": os.environ["GOOGLE_DRIVE_CLIENT_ID"].strip(),
        "client_secret": os.environ["GOOGLE_DRIVE_CLIENT_SECRET"].strip(),
        "refresh_token": os.environ["GOOGLE_DRIVE_REFRESH_TOKEN"].strip(),
        "grant_type": "refresh_token",
    }).encode("utf-8")
    req = urllib.request.Request(
        TOKEN_URL,
        data=body,
        method="POST",
        headers={"Content-Type": "application/x-www-form-urlencoded"},
    )
    with urllib.request.urlopen(req, timeout=20) as resp:
        payload = json.loads(resp.read().decode("utf-8"))
    access = str(payload.get("access_token") or "")
    if not access:
        raise RuntimeError("Drive token refresh returned no access_token")
    expires = int(payload.get("expires_in") or 3600)
    _token_cache["access"] = access
    _token_cache["exp"] = now + expires
    return access


def _decode_data_url(data_url: str) -> tuple[bytes, str]:
    raw = str(data_url or "")
    if not raw.startswith("data:image/"):
        raise ValueError("expected data:image URL")
    header, _, b64 = raw.partition(",")
    mime = "image/jpeg"
    if ";" in header:
        mime = header[5:].split(";", 1)[0] or mime
    if "base64" not in header.lower():
        raise ValueError("expected base64 data URL")
    return base64.b64decode(b64), mime


def upload_gallery_photo(data_url: str, *, post_hint: str = "moment") -> str:
    """Upload a data-URL photo; returns Drive file id."""
    if not drive_configured():
        raise RuntimeError("Drive is not configured")
    blob, mime = _decode_data_url(data_url)
    folder = os.environ["GOOGLE_DRIVE_FOLDER_ID"].strip()
    safe_name = "".join(ch if ch.isalnum() or ch in "-_" else "-" for ch in post_hint)[:40] or "moment"
    ext = "jpg" if "jpeg" in mime else ("png" if "png" in mime else "bin")
    metadata = {
        "name": f"paidia-{safe_name}-{int(time.time())}.{ext}",
        "parents": [folder],
        "appProperties": {"paidia": "gallery"},
    }
    boundary = f"paidia_{int(time.time()*1000)}"
    meta_json = json.dumps(metadata, separators=(",", ":")).encode("utf-8")
    body = b"".join([
        f"--{boundary}\r\n".encode("utf-8"),
        b"Content-Type: application/json; charset=UTF-8\r\n\r\n",
        meta_json,
        b"\r\n",
        f"--{boundary}\r\n".encode("utf-8"),
        f"Content-Type: {mime}\r\n\r\n".encode("utf-8"),
        blob,
        b"\r\n",
        f"--{boundary}--\r\n".encode("utf-8"),
    ])
    token = _access_token()
    req = urllib.request.Request(
        UPLOAD_URL,
        data=body,
        method="POST",
        headers={
            "Authorization": f"Bearer {token}",
            "Content-Type": f"multipart/related; boundary={boundary}",
            "Content-Length": str(len(body)),
        },
    )
    try:
        with urllib.request.urlopen(req, timeout=45) as resp:
            payload = json.loads(resp.read().decode("utf-8"))
    except urllib.error.HTTPError as exc:
        detail = exc.read().decode("utf-8", errors="replace")[:300]
        raise RuntimeError(f"Drive upload failed ({exc.code}): {detail}") from exc
    file_id = str(payload.get("id") or "").strip()
    if not file_id:
        raise RuntimeError("Drive upload returned no file id")
    return file_id


def download_gallery_photo(file_id: str) -> tuple[bytes, str]:
    if not drive_configured():
        raise RuntimeError("Drive is not configured")
    fid = str(file_id or "").strip()
    if not fid or any(ch in fid for ch in "/?#&"):
        raise ValueError("invalid file id")
    token = _access_token()
    req = urllib.request.Request(
        DOWNLOAD_TMPL.format(file_id=urllib.parse.quote(fid, safe="")),
        method="GET",
        headers={"Authorization": f"Bearer {token}"},
    )
    try:
        with urllib.request.urlopen(req, timeout=30) as resp:
            data = resp.read()
            mime = resp.headers.get("Content-Type") or "image/jpeg"
            return data, mime.split(";", 1)[0].strip() or "image/jpeg"
    except urllib.error.HTTPError as exc:
        raise RuntimeError(f"Drive download failed ({exc.code})") from exc


def delete_gallery_photo(file_id: str) -> None:
    if not drive_configured():
        return
    fid = str(file_id or "").strip()
    if not fid or any(ch in fid for ch in "/?#&"):
        return
    token = _access_token()
    req = urllib.request.Request(
        f"{META_URL}/{urllib.parse.quote(fid, safe='')}",
        method="DELETE",
        headers={"Authorization": f"Bearer {token}"},
    )
    try:
        with urllib.request.urlopen(req, timeout=20) as resp:
            resp.read()
    except urllib.error.HTTPError as exc:
        if exc.code not in {404, 410}:
            raise RuntimeError(f"Drive delete failed ({exc.code})") from exc


def media_path_for(file_id: str) -> str:
    return f"/api/gallery/media/{file_id}"


def file_id_from_photo_ref(photo: str) -> Optional[str]:
    raw = str(photo or "").strip()
    prefix = "/api/gallery/media/"
    if raw.startswith(prefix):
        fid = raw[len(prefix):].split("?", 1)[0].strip()
        return fid or None
    if raw.startswith("drive:"):
        return raw[6:].strip() or None
    return None
