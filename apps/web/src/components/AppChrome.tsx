"use client";

import Link from "next/link";
import { useCallback, useState } from "react";
import { usePathname } from "next/navigation";
import { useLang } from "@/lib/i18n";
import { GROUP_LABEL, currentNav, navLabel, visibleNav } from "@/lib/nav";
import { useSession } from "@/lib/session";
import { ViewportSync } from "./ViewportSync";
import { NotificationHub } from "./NotificationHub";
import { PageSelector, pageTitle, usePageSelectorHotkey } from "./PageSelector";
import { IconSpark } from "./icons";

export function AppChrome({ mode }: { mode: "staff" | "child" }) {
  const path = usePathname() || "/";
  const { session } = useSession();
  const [lang] = useLang();
  const admin = !!session?.admin;
  const [selector, setSelector] = useState(false);
  const [hub, setHub] = useState(false);
  const openSelector = useCallback(() => setSelector(true), []);
  usePageSelectorHotkey(openSelector);

  const el = lang === "el";
  const items = visibleNav({ mode, admin });
  const groups = Array.from(new Set(items.map((i) => i.group)));
  const current = currentNav(path, { mode, admin });
  const title = pageTitle(path, mode, admin, lang);
  const aiHref = mode === "child" ? "/kids/zoai" : "/zoai";
  const hideAi = path === "/zoai" || path.startsWith("/kids/zoai");

  return (
    <>
      <ViewportSync mode={mode} />
      <header className="app-topbar" data-testid="app-topbar">
        <button type="button" className="topbar-pages" onClick={openSelector} data-testid="page-select">
          <span className="topbar-kicker">{el ? "Σελίδες" : "Seiten"}</span>
          <strong>{title}</strong>
        </button>
        <div className="topbar-actions">
          {!hideAi && (
            <Link href={aiHref} className="topbar-icon" aria-label="Zo-Ai" data-testid="chrome-zoai">
              <IconSpark />
            </Link>
          )}
          <button
            type="button"
            className="topbar-icon"
            aria-label={el ? "Ειδοποιήσεις" : "Mitteilungen"}
            data-testid="chrome-notify"
            onClick={() => setHub(true)}
          >
            <svg viewBox="0 0 24 24" width="18" height="18" aria-hidden fill="none" stroke="currentColor" strokeWidth="1.8">
              <path d="M6 9a6 6 0 0 1 12 0c0 7 3 7 3 9H3s3-2 3-9" />
              <path d="M10 20a2 2 0 0 0 4 0" />
            </svg>
          </button>
        </div>
      </header>

      <aside className="side-nav" aria-label={el ? "Πλοήγηση" : "Navigation"} data-testid="side-nav">
        <p className="side-brand">
          Armonia
          <span>Thassos</span>
        </p>
        {groups.map((group) => (
          <section key={group} className="side-group">
            <h2>{lang === "el" ? GROUP_LABEL[group].el : GROUP_LABEL[group].de}</h2>
            {items
              .filter((item) => item.group === group)
              .map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  className={current?.href === item.href ? "active" : ""}
                >
                  {navLabel(item, lang)}
                </Link>
              ))}
          </section>
        ))}
      </aside>

      <PageSelector open={selector} onClose={() => setSelector(false)} mode={mode} admin={admin} lang={lang} />
      <NotificationHub open={hub} onClose={() => setHub(false)} lang={lang} />
    </>
  );
}
