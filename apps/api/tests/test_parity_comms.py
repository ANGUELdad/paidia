from __future__ import annotations

import hashlib
import json
import sys
from pathlib import Path

import pytest
from fastapi.testclient import TestClient

ROOT = Path(__file__).resolve().parents[1]
sys.path.insert(0, str(ROOT))

from armonia.config import get_settings  # noqa: E402
from armonia.main import app  # noqa: E402
import armonia.auth.limits as limits  # noqa: E402
import armonia.store as store  # noqa: E402
from armonia.store import mutate  # noqa: E402


@pytest.fixture()
def client(tmp_path, monkeypatch):
    limits._BUCKETS.clear()
    limits._FAILS.clear()
    store_path = tmp_path / ".armonia-store.json"
    monkeypatch.setattr("armonia.store._DATA_PATH", store_path)
    store.STATE.clear()
    store.STATE.update(store._empty_state())
    for h in store.HOUSES:
        for p in store.STATE["products"]:
            store.STATE["stock"][f"{h['id']}:{p['id']}"] = 4
    store._persist(store.STATE)
    settings = get_settings()
    monkeypatch.setattr(settings, "resend_api_key", "")
    monkeypatch.setattr(settings, "resend_from", "")
    monkeypatch.setattr(settings, "smtp_host", "")
    monkeypatch.setattr(settings, "smtp_port", "")
    monkeypatch.setattr(settings, "smtp_username", "")
    monkeypatch.setattr(settings, "smtp_user", "")
    monkeypatch.setattr(settings, "smtp_password", "")
    monkeypatch.setattr(settings, "smtp_from", "")
    with TestClient(app) as test_client:
        yield test_client
    limits._BUCKETS.clear()
    limits._FAILS.clear()


def login(client: TestClient, pid: str = "e8", mode: str = "staff", pin: str = "888888") -> None:
    r = client.post("/api/auth/login", json={"profileId": pid, "mode": mode, "pin": pin})
    assert r.status_code == 200, r.text


def test_email_status_and_test_not_configured(client: TestClient):
    login(client)
    status = client.get("/api/notify/email/status")
    assert status.status_code == 200
    assert status.json()["configured"] is False
    assert status.json()["provider"] is None

    test = client.post("/api/notify/email/test", json={"subject": "Ping", "message": "Hello"})
    assert test.status_code == 200
    assert test.json()["ok"] is False
    assert test.json()["queued"] is False
    assert test.json()["reason"] == "not_configured"


def test_broadcast_email_targets_profiles_with_email(client: TestClient, monkeypatch):
    sent: list[tuple[str, str, str | None]] = []

    def fake_send_email(to: str, subject: str, html: str | None = None, text: str | None = None):
        sent.append((to, subject, text))
        return {"ok": True, "queued": True, "provider": "test"}

    monkeypatch.setattr("armonia.domains.notify.send_email", fake_send_email)

    def add_emails(st):
        st["profiles"]["e1"]["email"] = "staff@example.test"
        st["profiles"]["k1"]["email"] = "child@example.test"

    mutate(add_emails)
    login(client)
    r = client.post(
        "/api/notify/broadcast",
        json={"audience": "staff", "subject": "Staff", "message": "Only staff", "channels": ["email"], "alsoPush": False},
    )
    assert r.status_code == 200, r.text
    assert sent == [("staff@example.test", "Staff", "Only staff")]
    assert r.json()["email"]["queued"] == 1


def test_kids_mood_writes_learning_signal(client: TestClient):
    login(client, "k1", "child", "121212")
    r = client.post("/api/kids/mood", json={"mood": "rain"})
    assert r.status_code == 200, r.text
    assert r.json()["mood"] == "rain"
    signals = store.STATE["learningSignals"]
    assert signals[-1]["type"] == "mood"
    assert signals[-1]["profileId"] == "k1"
    assert signals[-1]["mood"] == "rain"

    bad = client.post("/api/kids/mood", json={"mood": "happy"})
    assert bad.status_code == 400


def test_calendar_feed_mint_hashes_token_and_child_feed_filters(client: TestClient):
    login(client)
    staff_event = client.post(
        "/api/calendar/events",
        json={"title": "Staff sync", "date": "2026-08-20", "audience": "staff", "status": "published"},
    )
    assert staff_event.status_code == 200, staff_event.text
    child_event = client.post(
        "/api/calendar/events",
        json={"title": "Child day", "date": "2026-08-21", "audience": "children", "status": "published"},
    )
    assert child_event.status_code == 200, child_event.text

    minted = client.post("/api/calendar/feed", json={"mode": "child", "name": "Kids"})
    assert minted.status_code == 200, minted.text
    token = minted.json()["token"]
    digest = hashlib.sha256(token.encode("utf-8")).hexdigest()
    feeds_raw = json.dumps(store.STATE["calendarFeeds"])
    assert digest in store.STATE["calendarFeeds"]
    assert token not in feeds_raw

    ics = client.get(f"/api/calendar/feed/{token}.ics")
    assert ics.status_code == 200, ics.text
    assert "BEGIN:VCALENDAR" in ics.text
    assert "Child day" in ics.text
    assert "Staff sync" not in ics.text


def test_passkey_register_options_unavailable_or_smoke(client: TestClient):
    login(client)
    webauthn = pytest.importorskip("webauthn")
    assert webauthn is not None
    r = client.post("/api/auth/passkey/register/options")
    # 200 when WEBAUTHN_ORIGIN configured; 503 stub when origin/RP unset in tests.
    assert r.status_code in {200, 503}, r.text
    if r.status_code == 200:
        assert "challenge" in r.json() or "publicKey" in r.json()
    else:
        assert r.json()["detail"]["code"] == "passkeys_unavailable"
