"use client";

import Link from "next/link";
import { useEffect } from "react";
import { usePathname } from "next/navigation";
import { t } from "@/lib/i18n";

type LinkItem = { href: string; label: string };
type Group = { title: string; items: LinkItem[] };

function buildGroups(admin: boolean): Group[] {
  const groups: Group[] = [
    {
      title: "Schicht",
      items: [
        { href: "/handover", label: "Übergabe" },
        { href: "/coverage", label: t("coverage") },
        { href: "/incidents", label: t("incidents") },
        { href: "/care", label: t("careLog") },
        { href: "/book", label: "Schichtbuch" },
        { href: "/talk", label: "Talk" },
      ],
    },
    {
      title: "Versorgung",
      items: [{ href: "/shop", label: "Liste" }],
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
  if (admin) {
    groups.push({ title: "Admin", items: [{ href: "/admin/notify", label: "Automationen" }] });
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

  const groups = buildGroups(admin);

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
          <h2 id="more-title">Mehr</h2>
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
