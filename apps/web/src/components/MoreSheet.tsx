"use client";

import Link from "next/link";
import { useEffect } from "react";
import { usePathname } from "next/navigation";

type LinkItem = { href: string; label: string };

type Group = { title: string; items: LinkItem[] };

const BASE_GROUPS: Group[] = [
  {
    title: "Schicht",
    items: [
      { href: "/handover", label: "Übergabe" },
      { href: "/book", label: "Schichtbuch" },
      { href: "/talk", label: "Talk" },
    ],
  },
  {
    title: "Versorgung",
    items: [
      { href: "/stock", label: "Lager" },
      { href: "/shop", label: "Liste" },
    ],
  },
  {
    title: "Termine",
    items: [{ href: "/calendar", label: "Kalender" }],
  },
  {
    title: "Konto",
    items: [{ href: "/profile", label: "Profil" }],
  },
];

function isLinkActive(path: string, href: string) {
  return path === href || path.startsWith(`${href}/`);
}

export function MoreSheet({
  open,
  onClose,
  admin = false,
}: {
  open: boolean;
  onClose: () => void;
  admin?: boolean;
}) {
  const path = usePathname();

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open, onClose]);

  if (!open) return null;

  const groups = admin
    ? [...BASE_GROUPS, { title: "Admin", items: [{ href: "/admin/notify", label: "Automationen" }] }]
    : BASE_GROUPS;

  return (
    <div
      className="more-overlay"
      role="presentation"
      onClick={onClose}
      data-testid="more-overlay"
    >
      <div
        className="more-sheet"
        role="dialog"
        aria-modal="true"
        aria-label="Mehr"
        data-testid="more-sheet"
        onClick={(e) => e.stopPropagation()}
      >
        <header className="more-sheet-header">
          <h2>Mehr</h2>
          <button type="button" className="more-sheet-close" onClick={onClose} aria-label="Schließen">
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
                  data-testid={`more-${item.label.toLowerCase().replace(/\s+/g, "-")}`}
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
