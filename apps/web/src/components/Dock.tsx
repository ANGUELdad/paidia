"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import { useSession } from "@/lib/session";
import { Icon } from "./Icon";
import { isMoreRoute, MoreSheet } from "./MoreSheet";

const STAFF = [
  { href: "/home",  label: "Heute",  icon: "home"  as const },
  { href: "/plan",  label: "Plan",   icon: "plan"  as const },
  { href: "/stock", label: "Lager",  icon: "stock" as const },
  { href: "/zoai",  label: "Zo-Ai",  icon: "zoai"  as const },
];

const CHILD = [
  { href: "/kids",        label: "Heute",  icon: "today"   as const },
  { href: "/kids/games",  label: "Spiele", icon: "games"   as const },
  { href: "/kids/zoai",   label: "Zo-Ai",  icon: "zoai"    as const },
  { href: "/profile",     label: "Ich",    icon: "me"      as const },
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
      <nav
        className="dock"
        style={{ maxWidth: "48rem" }}
        aria-label="Hauptnavigation"
        data-testid="dock"
      >
        {items.map((item) => {
          const active = isActive(path, item.href);
          return (
            <Link
              key={item.href}
              href={item.href}
              className={active ? "active" : ""}
              aria-current={active ? "page" : undefined}
              data-testid={`dock-${item.label.toLowerCase()}`}
            >
              <Icon name={item.icon} size={20} />
              <span>{item.label}</span>
            </Link>
          );
        })}
        {mode === "staff" && (
          <button
            type="button"
            className={isMoreRoute(path) ? "active" : ""}
            data-testid="dock-mehr"
            aria-expanded={moreOpen}
            aria-haspopup="dialog"
            onClick={() => setMoreOpen(true)}
          >
            <Icon name="mehr" size={20} />
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
