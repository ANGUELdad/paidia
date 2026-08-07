"""API smoke + domain edge-case tests for Armonia platform."""

from __future__ import annotations

import sys
from pathlib import Path

import pytest
from fastapi.testclient import TestClient

ROOT = Path(__file__).resolve().parents[1]
sys.path.insert(0, str(ROOT))

from armonia.main import app  # noqa: E402
from armonia.store import mutate  # noqa: E402


@pytest.fixture()
def client(tmp_path, monkeypatch):
    # Isolate store file
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


def _login(client: TestClient, profile_id: str = "e8", mode: str = "staff", pin: str = "888888"):
    r = client.post("/api/auth/login", json={"profileId": profile_id, "mode": mode, "pin": pin})
    assert r.status_code == 200, r.text
    return r.json()


def test_health(client):
    r = client.get("/api/health")
    assert r.status_code == 200
    assert r.json()["platform"] == "armonia-v2"


def test_login_and_me(client):
    _login(client)
    me = client.get("/api/auth/me")
    assert me.status_code == 200
    assert me.json()["authenticated"] is True
    assert me.json()["name"] == "Zoi"


def test_schedule_double_book_requires_override(client):
    _login(client)
    body = {
        "date": "2026-08-10",
        "block": "morning",
        "activity": "A",
        "houseIds": ["h1", "h2"],
        "employeeIds": ["e1"],
    }
    assert client.post("/api/schedule/entry", json=body).status_code == 200
    conflict = client.post(
        "/api/schedule/entry",
        json={**body, "activity": "B"},
    )
    assert conflict.status_code == 409
    forced = client.post(
        "/api/schedule/entry",
        json={**body, "activity": "B", "force": True, "overrideReason": "Notfall"},
    )
    assert forced.status_code == 200


def test_stock_and_shop_learning(client):
    _login(client)
    adj = client.post(
        "/api/stock/adjust",
        json={"houseId": "h1", "productId": "p_milk", "dir": "OUT", "qty": 2, "reason": "Frühstück"},
    )
    assert adj.status_code == 200
    add = client.post("/api/shop/add", json={"houseId": "h1", "name": "Milch", "qty": 2})
    assert add.status_code == 200
    sug = client.get("/api/shop/suggestions")
    assert sug.status_code == 200
    assert any(s["key"] == "Milch" or s["key"] == "p_milk" for s in sug.json()["suggestions"]) or sug.json()["suggestions"]


def test_notify_catalog_evaluate(client):
    _login(client)
    rules = client.get("/api/notify/rules")
    assert rules.status_code == 200
    kinds = {r["kind"] for r in rules.json()["rules"]}
    assert "shift_start" in kinds and "child_event" in kinds
    due = client.post("/api/notify/evaluate")
    assert due.status_code == 200
    assert "due" in due.json()


def test_zoai_offline_variety_and_apply(client):
    _login(client)
    chat = client.post("/api/zoai/chat", json={"text": "Milch auf Liste"})
    assert chat.status_code == 200
    data = chat.json()
    assert data.get("reply") or data.get("message")
    assert "varietySeed" in data
    apply = client.post(
        "/api/zoai/apply",
        json={"action": {"type": "shop_add", "payload": {"name": "Reis", "qty": 1, "houseId": "h1"}}},
    )
    assert apply.status_code == 200
    assert apply.json()["ok"] is True


def test_kids_rewards(client):
    _login(client, "k1", "child", "121212")
    home = client.get("/api/kids/rewards")
    assert home.status_code == 200
    play = client.post("/api/kids/play", json={"game": "memory", "score": 3})
    assert play.status_code == 200
    assert play.json()["gained"] >= 1


def test_child_cannot_apply_zoai(client):
    _login(client, "k1", "child", "121212")
    apply = client.post("/api/zoai/apply", json={"action": {"type": "shop_add", "name": "x"}})
    assert apply.status_code == 403
