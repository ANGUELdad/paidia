"""Care-ops domain tests: coverage, incidents, care logs."""

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


def _login(client: TestClient, profile_id: str = "e8", mode: str = "staff", pin: str = "888888"):
    r = client.post("/api/auth/login", json={"profileId": profile_id, "mode": mode, "pin": pin})
    assert r.status_code == 200, r.text
    return r.json()


def test_login_e8(client):
    data = _login(client)
    assert data["ok"] is True
    assert data["profileId"] == "e8"
    me = client.get("/api/auth/me")
    assert me.status_code == 200
    assert me.json()["profileId"] == "e8"
    assert me.json()["authenticated"] is True


def test_coverage_today_and_gap_report(client):
    _login(client)
    cov = client.get("/api/coverage/today")
    assert cov.status_code == 200
    body = cov.json()
    assert "date" in body
    assert len(body["houses"]) == 2
    for house in body["houses"]:
        assert {"id", "name", "entries", "staffPresent", "gaps", "late"} <= set(house)

    report = client.post("/api/coverage/gap-report", json={"message": "Morning gap at Kalyvia"})
    assert report.status_code == 200
    assert report.json()["ok"] is True
    feed = client.get("/api/talk/feed?topic=ops")
    assert feed.status_code == 200
    assert any("Morning gap" in (m.get("text") or "") for m in feed.json()["messages"])


def test_incident_create_and_review(client):
    _login(client)
    created = client.post(
        "/api/incidents",
        json={
            "houseId": "h1",
            "childIds": ["k1"],
            "staffIds": ["e1"],
            "severity": "high",
            "text": "Minor scrape on playground",
            "date": "2026-08-10",
        },
    )
    assert created.status_code == 200
    inc = created.json()["incident"]
    assert inc["severity"] == "high"
    assert inc["reviewed"] is False

    listed = client.get("/api/incidents")
    assert listed.status_code == 200
    assert any(row["id"] == inc["id"] for row in listed.json()["incidents"])

    review = client.post(f"/api/incidents/{inc['id']}/review")
    assert review.status_code == 200
    assert review.json()["incident"]["reviewed"] is True


def test_care_log_staff_and_child_acl(client):
    _login(client)
    posted = client.post(
        "/api/care/log",
        json={
            "childId": "k1",
            "date": "2026-08-10",
            "kind": "meal",
            "note": "Ate well",
            "value": "good",
        },
    )
    assert posted.status_code == 200
    log_id = posted.json()["log"]["id"]

    fetched = client.get("/api/care/log", params={"childId": "k1", "date": "2026-08-10"})
    assert fetched.status_code == 200
    assert any(row["id"] == log_id for row in fetched.json()["logs"])

    client.post("/api/auth/logout")
    _login(client, "k1", "child", "121212")
    own = client.get("/api/care/log", params={"childId": "k1", "date": "2026-08-10"})
    assert own.status_code == 200
    assert len(own.json()["logs"]) >= 1

    denied = client.get("/api/care/log", params={"childId": "k2", "date": "2026-08-10"})
    assert denied.status_code == 403
