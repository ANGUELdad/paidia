"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState, type ReactNode } from "react";
import { useSession } from "@/lib/session";
import { t, useLang } from "@/lib/i18n";
import { AppChrome } from "./AppChrome";
import { isMoreRoute, MoreSheet } from "./MoreSheet";
import { IconGames, IconHome, IconMe, IconMore, IconPlan, IconSpark, IconStock } from "./icons";

type DockItem = { href: string; label: string; testId: string; icon: ReactNode };

function isActive(path: string, href: string) {
  if (href === "/home") return path === "/home";
  if (href === "/kids") return path === "/kids";
  return path === href || path.startsWith(`${href}/`);
}

export function Dock({ mode = "staff" }: { mode?: "staff" | "child" }) {
  const path = usePathname();
  const { session } = useSession();
  const [lang] = useLang();
  const [moreOpen, setMoreOpen] = useState(false);
  const el = lang === "el";

  const items: DockItem[] =
    mode === "child"
      ? [
          { href: "/kids", label: t("kidsToday", lang), testId: "dock-heute", icon: <IconHome /> },
          { href: "/kids/games", label: t("kidsGames", lang), testId: "dock-spiele", icon: <IconGames /> },
          { href: "/kids/zoai", label: "Zo-Ai", testId: "dock-zo-ai", icon: <IconSpark /> },
          { href: "/profile", label: el ? "Εγώ" : "Ich", testId: "dock-ich", icon: <IconMe /> },
        ]
      : [
          { href: "/home", label: el ? "Σήμερα" : "Heute", testId: "dock-heute", icon: <IconHome /> },
          { href: "/plan", label: el ? "Πλάνο" : "Plan", testId: "dock-plan", icon: <IconPlan /> },
          { href: "/stock", label: el ? "Αποθήκη" : "Lager", testId: "dock-lager", icon: <IconStock /> },
          { href: "/zoai", label: "Zo-Ai", testId: "dock-zo-ai", icon: <IconSpark /> },
        ];

  return (
    <>
      <AppChrome mode={mode} />
      <nav className="dock max-w-3xl" aria-label={el ? "Κύρια πλοήγηση" : "Hauptnavigation"} data-testid="dock">
        {items.map((item) => (
          <Link
            key={item.href}
            href={item.href}
            className={isActive(path, item.href) ? "active" : ""}
            data-testid={item.testId}
          >
            {item.icon}
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
            <IconMore />
            <span>{el ? "Περισσότερα" : "Mehr"}</span>
          </button>
        )}
      </nav>
      {mode === "staff" && (
        <MoreSheet open={moreOpen} onClose={() => setMoreOpen(false)} admin={!!session?.admin} lang={lang} />
      )}
    </>
  );
}
