"""Security hardening: push audience, Zo-Ai ACL, caps, body limit, profiles."""

from __future__ import annotations

import sys
from pathlib import Path

import pytest
from fastapi.testclient import TestClient

ROOT = Path(__file__).resolve().parents[1]
sys.path.insert(0, str(ROOT))

from armonia.main import app  # noqa: E402
from armonia.store import PLATFORM_LIST_CAPS, mutate  # noqa: E402


@pytest.fixture()
def client(tmp_path, monkeypatch):
    store_path = tmp_path / ".armonia-store.json"
    monkeypatch.setattr("armonia.store._DATA_PATH", store_path)
    import armonia.store as store

    store.STATE.clear()
    store.STATE.update(store._empty_state())
    for h in store.HOUSES:
        for p in store.STATE["products"]:
            store.STATE["stock"][f"{h['id']}:{p['id']}"] = 4
    store._persist(store.STATE)
    return TestClient(app)


def _login(client: TestClient, profile_id: str, mode: str, pin: str):
    r = client.post("/api/auth/login", json={"profileId": profile_id, "mode": mode, "pin": pin})
    assert r.status_code == 200, r.text
    return r.json()


def test_profiles_hide_admin_before_login(client):
    r = client.get("/api/auth/profiles")
    assert r.status_code == 200
    assert all("admin" not in p for p in r.json()["profiles"])
    _login(client, "e8", "staff", "888888")
    r2 = client.get("/api/auth/profiles")
    assert any(p.get("admin") for p in r2.json()["profiles"])


def test_seed_profiles_have_no_plaintext_pin(client):
    import armonia.store as store

    for p in store.STATE["profiles"].values():
        assert "pin" not in p
        assert p.get("pinHash")


def test_zoai_broadcast_requires_admin(client):
    _login(client, "e1", "staff", "111111")
    r = client.post(
        "/api/zoai/apply",
        json={
            "action": {
                "type": "broadcast_email",
                "audience": "staff",
                "subject": "Pwn",
                "message": "nope",
            },
            "pin": "111111",
        },
    )
    assert r.status_code == 403
    assert r.json()["detail"]["code"] == "admin_required"


def test_zoai_broadcast_admin_ok(client):
    _login(client, "e8", "staff", "888888")
    r = client.post(
        "/api/zoai/apply",
        json={
            "action": {
                "type": "broadcast_email",
                "audience": "staff",
                "subject": "OK",
                "message": "hello",
            },
            "pin": "888888",
        },
    )
    assert r.status_code == 200
    assert r.json()["applied"] == 1


def test_push_broadcast_filters_by_audience(client, monkeypatch):
    seen: list[list] = []

    def fake_push(subs, payload):
        seen.append(list(subs))
        return len(subs)

    monkeypatch.setattr("armonia.domains.notify._try_send_web_push", fake_push)

    def add_subs(st):
        st["pushSubscriptions"] = [
            {"endpoint": "https://push.example/child", "keys": {}, "profileId": "k1", "mode": "child"},
            {"endpoint": "https://push.example/staff", "keys": {}, "profileId": "e1", "mode": "staff"},
        ]

    mutate(add_subs)
    _login(client, "e8", "staff", "888888")
    r = client.post(
        "/api/notify/broadcast",
        json={"audience": "staff", "subject": "Staff only", "message": "secret", "channels": ["push"], "alsoPush": True},
    )
    assert r.status_code == 200
    assert seen
    modes = {s.get("mode") for s in seen[0]}
    assert modes == {"staff"}


def test_list_caps_trim_on_persist(client):
    cap = PLATFORM_LIST_CAPS["auditLog"]

    def flood(st):
        st["auditLog"] = [{"at": i, "type": "T", "text": str(i)} for i in range(cap + 50)]

    mutate(flood)
    import armonia.store as store

    assert len(store.STATE["auditLog"]) == cap


def test_body_too_large_rejected(client):
    _login(client, "e8", "staff", "888888")
    huge = "x" * 300_000
    r = client.post("/api/talk/message", json={"text": huge, "topic": "general"})
    assert r.status_code == 413


def test_production_secret_fail_closed():
    from armonia.config import DEFAULT_SESSION_SECRET, Settings, _assert_production_safe

    unsafe = Settings(
        environment="production",
        session_secret=DEFAULT_SESSION_SECRET,
        cookie_secure=False,
    )
    with pytest.raises(RuntimeError):
        _assert_production_safe(unsafe)
