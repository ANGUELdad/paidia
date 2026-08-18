"use client";

import Link from "next/link";
import { useEffect } from "react";
import { usePathname } from "next/navigation";
import { t, type Lang } from "@/lib/i18n";

type LinkItem = { href: string; label: string; testId: string };
type Group = { title: string; items: LinkItem[] };

function buildGroups(admin: boolean, lang: Lang): Group[] {
  const el = lang === "el";
  const groups: Group[] = [
    {
      title: el ? "Βάρδια" : "Schicht",
      items: [
        { href: "/handover", label: el ? "Παράδοση" : "Übergabe", testId: "more-übergabe" },
        { href: "/coverage", label: t("coverage", lang), testId: "more-abdeckung" },
        { href: "/incidents", label: t("incidents", lang), testId: "more-vorfälle" },
        { href: "/care", label: t("careLog", lang), testId: "more-kind-tag" },
        { href: "/book", label: el ? "Βιβλίο βάρδιας" : "Schichtbuch", testId: "more-schichtbuch" },
        { href: "/talk", label: "Talk", testId: "more-talk" },
      ],
    },
    {
      title: el ? "Προμήθεια" : "Versorgung",
      items: [{ href: "/shop", label: el ? "Λίστα" : "Liste", testId: "more-liste" }],
    },
    {
      title: el ? "Ραντεβού" : "Termine",
      items: [{ href: "/calendar", label: el ? "Ημερολόγιο" : "Kalender", testId: "more-kalender" }],
    },
    {
      title: el ? "Λογαριασμός" : "Konto",
      items: [{ href: "/profile", label: t("profile", lang), testId: "more-profil" }],
    },
  ];
  if (admin) {
    groups.push({
      title: "Admin",
      items: [{ href: "/admin/notify", label: el ? "Αυτοματισμοί" : "Automationen", testId: "more-automationen" }],
    });
  }
  return groups;
}

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

  const groups = buildGroups(admin, lang);

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
          <section key={group.title} className="more-group">
            <h3 className="more-group-title">{group.title}</h3>
            <div className="more-links">
              {group.items.map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  className={isLinkActive(path, item.href) ? "active" : ""}
                  data-testid={item.testId}
                  onClick={onClose}
                >
                  {item.label}
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
  "/profile",
  "/admin",
];

export function isMoreRoute(path: string) {
  return MORE_ROUTES.some((r) => path === r || path.startsWith(`${r}/`));
}
