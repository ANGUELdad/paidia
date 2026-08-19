"use client";

import { useEffect, useState } from "react";
import { REGULATORY_ITEMS, t, type Lang } from "@/lib/i18n";
import { scheduleLocalReminder } from "@/lib/reminders";

const REGULATORY_LAST_CHECK_KEY = "armonia.regulatory.lastCheck";

export function hadRegulatoryCheckToday(): boolean {
  if (typeof window === "undefined") return false;
  const stored = localStorage.getItem(REGULATORY_LAST_CHECK_KEY);
  if (!stored) return false;
  return stored.slice(0, 10) === new Date().toISOString().slice(0, 10);
}

export function markRegulatoryCheckDone() {
  if (typeof window === "undefined") return;
  localStorage.setItem(REGULATORY_LAST_CHECK_KEY, new Date().toISOString());
}

export function RegulatorySheet({
  open,
  lang,
  busy,
  onConfirm,
  onClose,
}: {
  open: boolean;
  lang: Lang;
  busy?: boolean;
  onConfirm: () => void;
  onClose: () => void;
}) {
  const items = REGULATORY_ITEMS[lang];
  const [checked, setChecked] = useState<boolean[]>([false, false, false, false, false]);
  const allChecked = checked.every(Boolean);

  useEffect(() => {
    if (!open) setChecked([false, false, false, false, false]);
  }, [open]);

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open, onClose]);

  if (!open) return null;

  function toggle(i: number) {
    setChecked((prev) => prev.map((v, idx) => (idx === i ? !v : v)));
  }

  async function handleSkip() {
    const at = new Date(Date.now() + 10 * 60 * 1000).toISOString();
    const title =
      lang === "el"
        ? t("regulatoryReminder", "el")
        : t("regulatoryReminder", "de");
    await scheduleLocalReminder(title, at, "/home?regulatory=1");
    onClose();
  }

  function handleConfirm() {
    if (!allChecked) return;
    markRegulatoryCheckDone();
    onConfirm();
  }

  return (
    <div
      className="more-overlay"
      role="presentation"
      data-testid="regulatory-sheet"
      onClick={onClose}
    >
      <div
        className="more-sheet"
        role="dialog"
        aria-modal="true"
        aria-labelledby="regulatory-title"
        onClick={(e) => e.stopPropagation()}
        style={{ maxHeight: "90dvh", overflowY: "auto" }}
      >
        <header className="more-sheet-header">
          <h2 id="regulatory-title">{t("regulatoryTitle", lang)}</h2>
          <button type="button" className="more-sheet-close" onClick={onClose} aria-label={t("cancel", lang)}>
            ✕
          </button>
        </header>
        <p className="muted" style={{ marginBottom: "1rem" }}>
          {t("regulatoryLead", lang)}
        </p>

        <ul style={{ listStyle: "none", padding: 0, margin: "0 0 1.25rem" }}>
          {items.map((label, i) => (
            <li
              key={i}
              style={{
                display: "flex",
                alignItems: "center",
                gap: "0.75rem",
                padding: "0.65rem 0",
                borderBottom: i < items.length - 1 ? "1px solid rgba(0,0,0,.08)" : "none",
              }}
            >
              <input
                type="checkbox"
                id={`reg-item-${i}`}
                checked={checked[i]}
                onChange={() => toggle(i)}
                data-testid={`regulatory-item-${i}`}
                style={{ width: 20, height: 20, accentColor: "#2a6b52", flexShrink: 0 }}
              />
              <label htmlFor={`reg-item-${i}`} style={{ cursor: "pointer", fontSize: "0.95rem" }}>
                {label}
              </label>
            </li>
          ))}
        </ul>

        <div className="row gap-2">
          <button
            className="btn-sec flex-1"
            type="button"
            onClick={handleSkip}
            data-testid="regulatory-skip"
          >
            {t("regulatorySkip", lang)}
          </button>
          <button
            className="btn flex-1"
            type="button"
            disabled={!allChecked || busy}
            onClick={handleConfirm}
            data-testid="regulatory-confirm"
            style={{ opacity: allChecked ? 1 : 0.45 }}
          >
            {t("regulatoryConfirm", lang)}
          </button>
        </div>
      </div>
    </div>
  );
}
