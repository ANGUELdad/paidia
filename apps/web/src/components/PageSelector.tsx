"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { currentNav, navHint, navLabel, searchNav } from "@/lib/nav";
import { t, type Lang } from "@/lib/i18n";

export function PageSelector({
  open,
  onClose,
  mode,
  admin,
  lang,
}: {
  open: boolean;
  onClose: () => void;
  mode: "staff" | "child";
  admin?: boolean;
  lang: Lang;
}) {
  const router = useRouter();
  const [q, setQ] = useState("");
  const [idx, setIdx] = useState(0);
  const inputRef = useRef<HTMLInputElement>(null);
  const items = useMemo(
    () => searchNav(q, { mode, admin, lang }),
    [q, mode, admin, lang],
  );
  const here =
    typeof window === "undefined" ? "/" : window.location.pathname;

  useEffect(() => {
    if (!open) return;
    setQ("");
    setIdx(0);
    const tmr = window.setTimeout(() => inputRef.current?.focus(), 30);
    return () => window.clearTimeout(tmr);
  }, [open]);

  useEffect(() => {
    setIdx(0);
  }, [q]);

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        e.preventDefault();
        onClose();
      } else if (e.key === "ArrowDown") {
        e.preventDefault();
        setIdx((i) => Math.min(items.length - 1, i + 1));
      } else if (e.key === "ArrowUp") {
        e.preventDefault();
        setIdx((i) => Math.max(0, i - 1));
      } else if (e.key === "Enter" && items[idx]) {
        e.preventDefault();
        router.push(items[idx].href);
        onClose();
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open, items, idx, onClose, router]);

  if (!open) return null;
  const el = lang === "el";

  return (
    <div className="selector-overlay" role="presentation" onClick={onClose} data-testid="page-selector">
      <div
        className="selector-sheet"
        role="dialog"
        aria-modal="true"
        aria-label={el ? "Επιλογή σελίδας" : "Seite wählen"}
        onClick={(e) => e.stopPropagation()}
      >
        <input
          ref={inputRef}
          className="selector-input"
          value={q}
          onChange={(e) => setQ(e.target.value)}
          placeholder={el ? "Σελίδα, σημείωση, εργαλείο…" : "Seite, Notiz, Werkzeug…"}
          aria-label={el ? "Αναζήτηση σελίδων" : "Seiten suchen"}
        />
        <ul className="selector-list">
          {items.map((item, i) => (
            <li key={item.href}>
              <button
                type="button"
                className={`selector-row${i === idx ? " on" : ""}${here.startsWith(item.href) ? " here" : ""}`}
                data-testid={item.testId.startsWith("nav-") ? item.testId : undefined}
                onClick={() => {
                  router.push(item.href);
                  onClose();
                }}
              >
                <span>
                  <b>{navLabel(item, lang)}</b>
                  <small>{navHint(item, lang)}</small>
                </span>
              </button>
            </li>
          ))}
          {items.length === 0 && (
            <li className="selector-empty">{t("emptyDefault", lang)}</li>
          )}
        </ul>
        <p className="selector-hint">
          {el ? "Enter ανοίγει · Esc κλείνει" : "Enter öffnet · Esc schließt"}
        </p>
      </div>
    </div>
  );
}

export function usePageSelectorHotkey(onOpen: () => void) {
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === "k") {
        e.preventDefault();
        onOpen();
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [onOpen]);
}

export function pageTitle(path: string, mode: "staff" | "child", admin: boolean, lang: Lang) {
  const item = currentNav(path, { mode, admin });
  return item ? navLabel(item, lang) : "Armonia";
}
