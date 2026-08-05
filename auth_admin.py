#!/usr/bin/env python3
"""Manage PAIDIA server-only profile emails and PIN hashes in .env."""

from __future__ import annotations

import argparse
import json
import getpass
import os
import re
import secrets
from datetime import datetime, timezone
from pathlib import Path

import server


PROFILE_NAMES = {
    "e1": "Dora", "e2": "Karin", "e3": "Dimitris", "e4": "Angelos",
    "e5": "Claudio", "e6": "Löhri", "e7": "Amalia", "e8": "Zoi",
    "k1": "Simon", "k2": "Kai", "k3": "Vincent", "k4": "Julian klein",
    "k5": "Julian groß", "k6": "Lea", "k7": "Valeria", "k8": "Jule",
    "k9": "Samantha", "k10": "Lilly", "k11": "Zoitsa", "k12": "Leonie",
}


def private_write(path: Path, content: str) -> None:
    path.parent.mkdir(parents=True, exist_ok=True)
    temp_path = path.with_name(path.name + ".tmp")
    temp_path.write_text(content, encoding="utf-8")
    os.chmod(temp_path, 0o600)
    os.replace(temp_path, path)


def profile_sort(profile_id: str) -> tuple[int, int]:
    return (0 if profile_id.startswith("e") else 1, int(profile_id[1:]))


def export_all_pins(output_dir: Path) -> tuple[Path, Path, Path]:
    profile_ids = sorted(server.AUTH_USERS, key=profile_sort)
    generated: dict[str, str] = {}
    used: set[str] = set()
    for profile_id in profile_ids:
        while True:
            pin = str(100_000 + secrets.randbelow(900_000))
            if pin not in used:
                used.add(pin)
                generated[profile_id] = pin
                break

    stamp = datetime.now(timezone.utc).strftime("%Y-%m-%dT%H:%M:%SZ")
    previous = {profile_id: server.AUTH_USERS[profile_id]["pin_hash"] for profile_id in profile_ids}
    backup_path = Path(".paidia-pin-hash-backup.json")
    private_write(backup_path, json.dumps({"createdAt": stamp, "pinHashes": previous}, indent=2) + "\n")

    for profile_id, pin in generated.items():
        server.AUTH_USERS[profile_id]["pin_hash"] = server.hash_pin(pin)
    try:
        server.persist_auth_users()
    except RuntimeError:
        for profile_id, pin_hash in previous.items():
            server.AUTH_USERS[profile_id]["pin_hash"] = pin_hash
        raise

    env_path = output_dir / "ARMONIA_PROFILE_PINS.env"
    text_path = output_dir / "ARMONIA_PROFILE_PINS.txt"
    env_lines = [
        "# Armonia Thassos profile PINs",
        f"# Generated {stamp}",
        "# PRIVATE: do not upload, email, or commit this file.",
        "",
    ]
    text_lines = [
        "ARMONIA THASSOS — PROFILE PINS",
        f"Generated: {stamp}",
        "PRIVATE — keep this file secure and do not share it with children.",
        "",
        "STAFF",
        "-----",
    ]
    for profile_id in profile_ids:
        name = PROFILE_NAMES.get(profile_id, profile_id)
        env_lines.extend([f"# {name} ({profile_id})", f"PAIDIA_PIN_{profile_id.upper()}={generated[profile_id]}"])
        if profile_id == "k1":
            text_lines.extend(["", "CHILDREN", "--------"])
        text_lines.append(f"{profile_id:<3}  {name:<16}  PIN: {generated[profile_id]}")
    try:
        private_write(env_path, "\n".join(env_lines) + "\n")
        private_write(text_path, "\n".join(text_lines) + "\n")
    except OSError as exc:
        for profile_id, pin_hash in previous.items():
            server.AUTH_USERS[profile_id]["pin_hash"] = pin_hash
        server.persist_auth_users()
        for path in (env_path, text_path):
            try:
                path.unlink()
            except FileNotFoundError:
                pass
        raise RuntimeError("PIN export failed; previous PIN hashes were restored") from exc
    return env_path, text_path, backup_path


def require_profile(profile_id: str) -> dict:
    user = server.AUTH_USERS.get(profile_id)
    if not user:
        raise SystemExit(f"Unknown profile ID: {profile_id}")
    return user


def main() -> None:
    parser = argparse.ArgumentParser(description=__doc__)
    subparsers = parser.add_subparsers(dest="command", required=True)

    email_parser = subparsers.add_parser("set-email", help="Assign a reset email to a profile")
    email_parser.add_argument("profile_id")
    email_parser.add_argument("email")

    pin_parser = subparsers.add_parser("set-pin", help="Set a PIN using a hidden prompt")
    pin_parser.add_argument("profile_id")

    subparsers.add_parser("status", help="Show which profiles have an email configured")
    export_parser = subparsers.add_parser(
        "export-pins", help="Rotate every profile PIN and export a private Desktop list"
    )
    export_parser.add_argument("--output-dir", type=Path, default=Path.home() / "Desktop")
    args = parser.parse_args()

    if args.command == "status":
        for profile_id, user in sorted(server.AUTH_USERS.items()):
            print(f"{profile_id:>3}  {user['mode']:<5}  email={'yes' if user['email'] else 'no'}")
        return

    if args.command == "export-pins":
        env_path, text_path, backup_path = export_all_pins(args.output_dir.expanduser().resolve())
        print(f"Rotated {len(server.AUTH_USERS)} profile PINs.")
        print(f"Private env: {env_path}")
        print(f"Private text: {text_path}")
        print(f"Hash-only rollback: {backup_path.resolve()}")
        print("Restart server.py before using the new PINs.")
        return

    user = require_profile(args.profile_id)
    if args.command == "set-email":
        email = args.email.strip().lower()
        if not re.fullmatch(r"[^\s@]+@[^\s@]+\.[^\s@]+", email):
            raise SystemExit("Enter a valid email address")
        user["email"] = email
    else:
        pin = getpass.getpass("New PIN (4–6 digits): ")
        confirm = getpass.getpass("Confirm PIN: ")
        if pin != confirm or not re.fullmatch(r"\d{4,6}", pin):
            raise SystemExit("PINs must match and contain 4–6 digits")
        user["pin_hash"] = server.hash_pin(pin)

    server.persist_auth_users()
    print("Saved securely in .env. Restart server.py to load the change.")


if __name__ == "__main__":
    main()
