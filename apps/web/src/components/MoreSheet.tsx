"use client";

import Link from "next/link";
import { useEffect } from "react";
import { usePathname } from "next/navigation";
import { t, type Lang } from "@/lib/i18n";
import { GROUP_LABEL, navLabel, visibleNav, type NavItem } from "@/lib/nav";

const DOCK_HREFS = new Set(["/home", "/plan", "/stock", "/zoai"]);

function isLinkActive(path: string, href: string) {
  return path === href || path.startsWith(`${href}/`);
}

export function MoreSheet({
  open,
  onClose,
  admin = false,
  lang = "de",
}: {
  open: boolean;
  onClose: () => void;
  admin?: boolean;
  lang?: Lang;
}) {
  const path = usePathname();
  const el = lang === "el";

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open, onClose]);

  useEffect(() => {
    if (!open) return;
    document.body.classList.add("sheet-open");
    return () => document.body.classList.remove("sheet-open");
  }, [open]);

  if (!open) return null;

  const extras = visibleNav({ mode: "staff", admin }).filter((item) => !DOCK_HREFS.has(item.href));
  const groups = Array.from(new Set(extras.map((item) => item.group)));

  return (
    <div className="more-overlay" role="presentation" onClick={onClose} data-testid="more-overlay">
      <div
        className="more-sheet"
        role="dialog"
        aria-modal="true"
        aria-labelledby="more-title"
        data-testid="more-sheet"
        onClick={(e) => e.stopPropagation()}
      >
        <header className="more-sheet-header">
          <h2 id="more-title">{el ? "Περισσότερα" : "Mehr"}</h2>
          <button type="button" className="more-sheet-close" onClick={onClose} aria-label={t("cancel", lang)}>
            ✕
          </button>
        </header>
        {groups.map((group) => (
          <section key={group} className="more-group">
            <h3 className="more-group-title">{lang === "el" ? GROUP_LABEL[group].el : GROUP_LABEL[group].de}</h3>
            <div className="more-links">
              {extras
                .filter((item: NavItem) => item.group === group)
                .map((item) => (
                  <Link
                    key={item.href}
                    href={item.href}
                    className={isLinkActive(path, item.href) ? "active" : ""}
                    data-testid={item.testId}
                    onClick={onClose}
                  >
                    {navLabel(item, lang)}
                  </Link>
                ))}
            </div>
          </section>
        ))}
      </div>
    </div>
  );
}

export const MORE_ROUTES = [
  "/handover",
  "/coverage",
  "/incidents",
  "/care",
  "/book",
  "/talk",
  "/shop",
  "/calendar",
  "/campus",
  "/profile",
  "/admin",
];

export function isMoreRoute(path: string) {
  return MORE_ROUTES.some((r) => path === r || path.startsWith(`${r}/`));
}
