#!/usr/bin/env python3
"""Manage PAIDIA server-only profile emails and PIN hashes in .env."""

from __future__ import annotations

import argparse
import getpass
import re

import server


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
    args = parser.parse_args()

    if args.command == "status":
        for profile_id, user in sorted(server.AUTH_USERS.items()):
            print(f"{profile_id:>3}  {user['mode']:<5}  email={'yes' if user['email'] else 'no'}")
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
