"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import { useSession } from "@/lib/session";
import { isMoreRoute, MoreSheet } from "./MoreSheet";

const STAFF = [
  { href: "/home", label: "Heute" },
  { href: "/plan", label: "Plan" },
  { href: "/stock", label: "Lager" },
  { href: "/zoai", label: "Zo-Ai" },
];

const CHILD = [
  { href: "/kids", label: "Heute" },
  { href: "/kids/games", label: "Spiele" },
  { href: "/kids/zoai", label: "Zo-Ai" },
  { href: "/profile", label: "Ich" },
];

function isActive(path: string, href: string) {
  if (href === "/home") return path === "/home";
  if (href === "/kids") return path === "/kids";
  return path === href || path.startsWith(`${href}/`);
}

export function Dock({ mode = "staff" }: { mode?: "staff" | "child" }) {
  const path = usePathname();
  const { session } = useSession();
  const [moreOpen, setMoreOpen] = useState(false);
  const items = mode === "child" ? CHILD : STAFF;

  return (
    <>
      <nav className="dock max-w-3xl" aria-label="Hauptnavigation" data-testid="dock">
        {items.map((item) => (
          <Link
            key={item.href}
            href={item.href}
            className={isActive(path, item.href) ? "active" : ""}
            data-testid={`dock-${item.label.toLowerCase()}`}
          >
            <span>{item.label}</span>
          </Link>
        ))}
        {mode === "staff" && (
          <button
            type="button"
            className={isMoreRoute(path) ? "active" : ""}
            data-testid="dock-mehr"
            aria-expanded={moreOpen}
            aria-haspopup="dialog"
            onClick={() => setMoreOpen(true)}
          >
            <span>Mehr</span>
          </button>
        )}
      </nav>
      {mode === "staff" && (
        <MoreSheet open={moreOpen} onClose={() => setMoreOpen(false)} admin={!!session?.admin} />
      )}
    </>
  );
}
