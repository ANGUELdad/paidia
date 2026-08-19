"use client";

import Link from "next/link";
import { useEffect } from "react";
import { usePathname } from "next/navigation";
import { getStoredLang } from "@/lib/i18n";
import { Icon } from "./Icon";

type LinkItem = { href: string; labelDe: string; labelEl: string; icon: Parameters<typeof Icon>[0]["name"] };
type Group = { titleDe: string; titleEl: string; items: LinkItem[] };

function buildGroups(admin: boolean): Group[] {
  const groups: Group[] = [
    {
      titleDe: "Schicht",
      titleEl: "Βάρδια",
      items: [
        { href: "/handover",  labelDe: "Übergabe",    labelEl: "Παράδοση",      icon: "handover"  },
        { href: "/coverage",  labelDe: "Abdeckung",   labelEl: "Κάλυψη",        icon: "coverage"  },
        { href: "/incidents", labelDe: "Vorfälle",    labelEl: "Περιστατικά",   icon: "incident"  },
        { href: "/care",      labelDe: "Kind-Tag",    labelEl: "Ημέρα παιδιού", icon: "care"      },
        { href: "/book",      labelDe: "Schichtbuch", labelEl: "Βιβλίο",        icon: "book"      },
        { href: "/talk",      labelDe: "Talk",        labelEl: "Talk",           icon: "talk"      },
      ],
    },
    {
      titleDe: "Versorgung",
      titleEl: "Εφοδιασμός",
      items: [
        { href: "/shop", labelDe: "Liste", labelEl: "Λίστα", icon: "shop" },
      ],
    },
    {
      titleDe: "Termine",
      titleEl: "Ημερολόγιο",
      items: [
        { href: "/calendar", labelDe: "Kalender", labelEl: "Ημερολόγιο", icon: "calendar" },
      ],
    },
    {
      titleDe: "Konto",
      titleEl: "Λογαριασμός",
      items: [
        { href: "/profile", labelDe: "Profil", labelEl: "Προφίλ", icon: "profile" },
      ],
    },
  ];
  if (admin) {
    groups.push({
      titleDe: "Admin",
      titleEl: "Admin",
      items: [{ href: "/admin/notify", labelDe: "Automationen", labelEl: "Αυτοματισμοί", icon: "admin" }],
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
}: {
  open: boolean;
  onClose: () => void;
  admin?: boolean;
}) {
  const path = usePathname();
  const lang = getStoredLang();

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

  const groups = buildGroups(admin);

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
        aria-labelledby="more-title"
        data-testid="more-sheet"
        onClick={(e) => e.stopPropagation()}
      >
        <header className="more-sheet-header">
          <h2 id="more-title">{lang === "el" ? "Περισσότερα" : "Mehr"}</h2>
          <button
            type="button"
            className="more-sheet-close"
            onClick={onClose}
            aria-label={lang === "el" ? "Κλείσιμο" : "Schließen"}
          >
            <Icon name="close" size={16} />
          </button>
        </header>
        {groups.map((group) => (
          <section key={group.titleDe} className="more-group">
            <h3 className="more-group-title">
              {lang === "el" ? group.titleEl : group.titleDe}
            </h3>
            <div className="more-links">
              {group.items.map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  className={isLinkActive(path, item.href) ? "active" : ""}
                  data-testid={`more-${item.labelDe.toLowerCase().replace(/\s+/g, "-")}`}
                  onClick={onClose}
                  aria-current={isLinkActive(path, item.href) ? "page" : undefined}
                >
                  <span className="more-link-icon">
                    <Icon name={item.icon} size={18} />
                  </span>
                  {lang === "el" ? item.labelEl : item.labelDe}
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
