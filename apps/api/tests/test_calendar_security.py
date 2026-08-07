"""Calendar + rate-limit security tests."""

from __future__ import annotations

import sys
from pathlib import Path

import pytest
from fastapi.testclient import TestClient

ROOT = Path(__file__).resolve().parents[1]
sys.path.insert(0, str(ROOT))

from armonia.main import app  # noqa: E402
import armonia.store as store  # noqa: E402


@pytest.fixture()
def client(tmp_path, monkeypatch):
    store_path = tmp_path / ".armonia-store.json"
    monkeypatch.setattr("armonia.store._DATA_PATH", store_path)
    store.STATE.clear()
    store.STATE.update(store._empty_state())
    for h in store.HOUSES:
        for p in store.STATE["products"]:
            store.STATE["stock"][f"{h['id']}:{p['id']}"] = 4
    store._persist(store.STATE)
    return TestClient(app)


def login(client, pid="e8", mode="staff", pin="888888"):
    r = client.post("/api/auth/login", json={"profileId": pid, "mode": mode, "pin": pin})
    assert r.status_code == 200


def test_calendar_ics_and_reminder(client):
    login(client)
    ev = client.post(
        "/api/calendar/events",
        json={
            "title": "Team sync",
            "date": "2026-08-20",
            "startTime": "10:00",
            "endTime": "11:00",
            "audience": "staff",
            "status": "published",
            "remindMinutes": [30],
        },
    )
    assert ev.status_code == 200
    eid = ev.json()["event"]["id"]
    ics = client.get(f"/api/calendar/ics?eventId={eid}")
    assert ics.status_code == 200
    assert "BEGIN:VEVENT" in ics.text
    g = client.get(f"/api/calendar/google-link?eventId={eid}")
    assert g.status_code == 200
    assert "calendar.google.com" in g.json()["url"]
    rm = client.post("/api/calendar/reminders", json={"title": "Prep", "at": "2026-08-20T09:00", "url": "/calendar"})
    assert rm.status_code == 200


def test_bad_pin_lockout_path(client):
    for _ in range(3):
        r = client.post("/api/auth/login", json={"profileId": "e1", "mode": "staff", "pin": "000000"})
        assert r.status_code == 401
    ok = client.post("/api/auth/login", json={"profileId": "e1", "mode": "staff", "pin": "111111"})
    assert ok.status_code == 200
