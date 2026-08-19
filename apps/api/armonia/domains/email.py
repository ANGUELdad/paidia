from __future__ import annotations

import smtplib
from email.message import EmailMessage
from typing import Any

import httpx

from armonia.config import get_settings


def _truthy(raw: str | bool | None) -> bool:
    return str(raw or "").strip().lower() not in {"", "0", "false", "no", "off"}


def email_status() -> dict[str, Any]:
    settings = get_settings()
    resend_ready = bool(settings.resend_api_key and settings.resend_from)
    smtp_ready = bool(settings.smtp_host and (settings.smtp_from or settings.resend_from))
    provider = "resend" if resend_ready else ("smtp" if smtp_ready else None)
    return {
        "ok": True,
        "configured": bool(provider),
        "provider": provider,
        "resend": {"configured": resend_ready, "from": settings.resend_from or None},
        "smtp": {
            "configured": smtp_ready,
            "host": settings.smtp_host or None,
            "port": settings.smtp_port or None,
            "from": (settings.smtp_from or settings.resend_from) or None,
            "usernameConfigured": bool(settings.smtp_username or settings.smtp_user),
        },
    }


def _recipients(to: str | list[str] | tuple[str, ...]) -> list[str]:
    if isinstance(to, str):
        return [part.strip() for part in to.split(",") if part.strip()]
    return [str(part).strip() for part in to if str(part).strip()]


def _send_resend(to: list[str], subject: str, html: str | None, text: str | None) -> dict[str, Any]:
    settings = get_settings()
    payload: dict[str, Any] = {
        "from": settings.resend_from,
        "to": to,
        "subject": subject,
    }
    if html:
        payload["html"] = html
    if text:
        payload["text"] = text
    try:
        response = httpx.post(
            "https://api.resend.com/emails",
            headers={"Authorization": f"Bearer {settings.resend_api_key}", "Content-Type": "application/json"},
            json=payload,
            timeout=10.0,
        )
        if 200 <= response.status_code < 300:
            data = response.json() if response.content else {}
            return {"ok": True, "queued": True, "provider": "resend", "id": data.get("id")}
        return {
            "ok": False,
            "queued": False,
            "provider": "resend",
            "reason": "send_failed",
            "status": response.status_code,
        }
    except Exception as exc:
        return {"ok": False, "queued": False, "provider": "resend", "reason": "send_failed", "error": str(exc)}


def _send_smtp(to: list[str], subject: str, html: str | None, text: str | None) -> dict[str, Any]:
    settings = get_settings()
    sender = settings.smtp_from or settings.resend_from
    msg = EmailMessage()
    msg["From"] = sender
    msg["To"] = ", ".join(to)
    msg["Subject"] = subject
    msg.set_content(text or "")
    if html:
        msg.add_alternative(html, subtype="html")
    try:
        port = int(settings.smtp_port or 587)
    except ValueError:
        port = 587
    username = settings.smtp_username or settings.smtp_user
    try:
        with smtplib.SMTP(settings.smtp_host, port, timeout=10) as smtp:
            if _truthy(settings.smtp_use_tls):
                smtp.starttls()
            if username and settings.smtp_password:
                smtp.login(username, settings.smtp_password)
            smtp.send_message(msg)
        return {"ok": True, "queued": True, "provider": "smtp"}
    except Exception as exc:
        return {"ok": False, "queued": False, "provider": "smtp", "reason": "send_failed", "error": str(exc)}


def email_shell(subject: str, message: str, *, lang: str = "de") -> str:
    """Apple-compact HTML mail: stone canvas, pine mark, one clear action."""
    import html as html_lib

    subj = html_lib.escape((subject or "").strip() or "Armonia")
    body = html_lib.escape(message or "").replace("\n", "<br>")
    kicker = "Armonia Thassos"
    footer = "Campus · Schicht · Care" if lang != "el" else "Campus · Βάρδια · Φροντίδα"
    return f"""<!doctype html>
<html lang="{html_lib.escape(lang)}">
<head>
<meta charset="utf-8"/>
<meta name="viewport" content="width=device-width,initial-scale=1"/>
<title>{subj}</title>
</head>
<body style="margin:0;background:#e9ece8;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',sans-serif;color:#1a2822;">
  <table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="background:#e9ece8;">
    <tr>
      <td align="center" style="padding:28px 16px;">
        <table role="presentation" width="560" cellspacing="0" cellpadding="0" style="max-width:560px;width:100%;background:#f7f8f6;border-radius:22px;border:1px solid rgba(26,40,34,.12);overflow:hidden;">
          <tr>
            <td style="padding:22px 24px 8px;background:linear-gradient(160deg,#2a6b52,#2f5a63);color:#f3f5f2;">
              <div style="width:32px;height:32px;border-radius:10px;background:rgba(255,255,255,.16);text-align:center;line-height:32px;font-weight:700;">A</div>
              <p style="margin:14px 0 0;font-size:11px;letter-spacing:.16em;text-transform:uppercase;opacity:.8;">{kicker}</p>
              <h1 style="margin:6px 0 0;font-size:22px;line-height:1.25;font-weight:650;">{subj}</h1>
            </td>
          </tr>
          <tr>
            <td style="padding:20px 24px 8px;font-size:16px;line-height:1.5;">{body}</td>
          </tr>
          <tr>
            <td style="padding:8px 24px 24px;">
              <a href="https://armonia-thassos.vercel.app/home" style="display:inline-block;background:#2a6b52;color:#fff;text-decoration:none;padding:12px 18px;border-radius:14px;font-size:14px;font-weight:600;">
                {("Άνοιγμα Armonia" if lang == "el" else "Armonia öffnen")}
              </a>
              <p style="margin:16px 0 0;font-size:12px;color:#455851;">{footer}</p>
            </td>
          </tr>
        </table>
      </td>
    </tr>
  </table>
</body>
</html>"""


def send_email(to: str | list[str], subject: str, html: str | None = None, text: str | None = None) -> dict[str, Any]:
    recipients = _recipients(to)
    settings = get_settings()
    if not settings.resend_api_key or not settings.resend_from:
        if not settings.smtp_host or not (settings.smtp_from or settings.resend_from):
            return {"ok": False, "queued": False, "reason": "not_configured"}
    if not recipients:
        return {"ok": False, "queued": False, "reason": "missing_recipient"}
    clean_subject = (subject or "").strip()
    if not clean_subject or not (html or text):
        return {"ok": False, "queued": False, "reason": "missing_content"}
    if settings.resend_api_key and settings.resend_from:
        return _send_resend(recipients, clean_subject, html, text)
    return _send_smtp(recipients, clean_subject, html, text)
