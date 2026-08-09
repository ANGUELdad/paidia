"""Kids mode privacy and security tests."""

from __future__ import annotations

import sys
from pathlib import Path

import pytest
from fastapi.testclient import TestClient

ROOT = Path(__file__).resolve().parents[1]
sys.path.insert(0, str(ROOT))

from armonia.main import app  # noqa: E402
import armonia.store as store  # noqa: E402
from armonia.store import mutate  # noqa: E402


@pytest.fixture()
def client(tmp_path, monkeypatch):
    store_path = tmp_path / ".armonia-store.json"
    monkeypatch.setattr("armonia.store._DATA_PATH", store_path)
    store.STATE.clear()
    store.STATE.update(store._empty_state())
    store._persist(store.STATE)
    return TestClient(app)


def login(client, pid="k1", mode="child", pin="121212"):
    r = client.post("/api/auth/login", json={"profileId": pid, "mode": mode, "pin": pin})
    assert r.status_code == 200, r.text


def staff_login(client):
    r = client.post("/api/auth/login", json={"profileId": "e8", "mode": "staff", "pin": "888888"})
    assert r.status_code == 200, r.text


def test_xp_endpoint_forbidden(client):
    login(client)
    r = client.post("/api/kids/xp", json={"delta": 50, "reason": "cheat"})
    assert r.status_code == 403


def test_play_ignores_client_score(client):
    login(client)
    r = client.post("/api/kids/play", json={"game": "memory", "score": 20})
    assert r.status_code == 200
    assert r.json()["gained"] == 6


def test_play_cooldown(client):
    login(client)
    assert client.post("/api/kids/play", json={"game": "memory"}).status_code == 200
    again = client.post("/api/kids/play", json={"game": "quiz"})
    assert again.status_code == 429
    assert again.json()["detail"]["code"] == "play_cooldown"


def test_child_cannot_list_staff_profiles(client):
    login(client)
    r = client.get("/api/auth/profiles?mode=staff")
    assert r.status_code == 403


def test_child_calendar_hides_staff_events(client):
    staff_login(client)
    ev = client.post(
        "/api/calendar/events",
        json={
            "title": "Staff only",
            "date": "2026-08-20",
            "audience": "staff",
            "status": "published",
        },
    )
    eid = ev.json()["event"]["id"]
    client.post("/api/auth/logout")
    login(client)
    listed = client.get("/api/calendar/events")
    ids = {e["id"] for e in listed.json()["events"]}
    assert eid not in ids
    g = client.get(f"/api/calendar/google-link?eventId={eid}")
    assert g.status_code == 403


def test_child_cannot_create_calendar_reminder(client):
    login(client)
    r = client.post("/api/calendar/reminders", json={"title": "x", "at": "2026-08-20T09:00"})
    assert r.status_code == 403


def test_session_store_must_match_token(client):
    login(client)
    token = client.cookies.get("armonia_session")
    sid = token.split(".")[0]

    def apply(st):
        st["sessions"][sid]["mode"] = "staff"

    mutate(apply)
    r = client.get("/api/auth/me")
    assert r.json()["authenticated"] is False
