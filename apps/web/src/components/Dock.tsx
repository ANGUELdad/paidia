"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const STAFF = [
  { href: "/home", label: "Home" },
  { href: "/plan", label: "Plan" },
  { href: "/stock", label: "Lager" },
  { href: "/shop", label: "Liste" },
  { href: "/talk", label: "Talk" },
  { href: "/calendar", label: "Kalender" },
  { href: "/book", label: "Buch" },
];

const CHILD = [
  { href: "/kids", label: "Heute" },
  { href: "/kids/games", label: "Spiele" },
  { href: "/kids/zoai", label: "Zo-Ai" },
];

export function Dock({ mode = "staff" }: { mode?: "staff" | "child" }) {
  const path = usePathname();
  const items = mode === "child" ? CHILD : STAFF;
  return (
    <nav className="dock max-w-3xl" aria-label="Main" data-testid="dock">
      {items.map((item) => (
        <Link
          key={item.href}
          href={item.href}
          className={path === item.href || (item.href !== "/home" && path.startsWith(item.href)) ? "active" : ""}
          data-testid={`dock-${item.label.toLowerCase()}`}
        >
          <span>{item.label}</span>
        </Link>
      ))}
      {mode === "staff" && (
        <Link href="/zoai" className={path.startsWith("/zoai") ? "active" : ""} data-testid="dock-zoai">
          Zo-Ai
        </Link>
      )}
    </nav>
  );
}
