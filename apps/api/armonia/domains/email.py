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
