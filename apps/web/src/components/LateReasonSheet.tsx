"use client";

import { useEffect, useState } from "react";
import { t } from "@/lib/i18n";

export function LateReasonSheet({
  open,
  busy,
  onClose,
  onSubmit,
}: {
  open: boolean;
  busy?: boolean;
  onClose: () => void;
  onSubmit: (reason: string) => void;
}) {
  const [reason, setReason] = useState("");

  useEffect(() => {
    if (!open) setReason("");
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

  return (
    <div className="more-overlay" role="presentation" onClick={onClose} data-testid="late-overlay">
      <div
        className="more-sheet late-sheet"
        role="dialog"
        aria-modal="true"
        aria-labelledby="late-title"
        onClick={(e) => e.stopPropagation()}
        data-testid="late-sheet"
      >
        <header className="more-sheet-header">
          <h2 id="late-title">{t("lateTitle")}</h2>
          <button type="button" className="more-sheet-close" onClick={onClose} aria-label={t("cancel")}>
            ✕
          </button>
        </header>
        <p className="muted">{t("lateLead")}</p>
        <textarea
          className="late-input"
          rows={3}
          value={reason}
          onChange={(e) => setReason(e.target.value)}
          placeholder={t("latePlaceholder")}
          data-testid="late-reason"
          autoFocus
        />
        <div className="row gap-2 mt-3">
          <button className="btn-sec flex-1" type="button" onClick={onClose} disabled={busy}>
            {t("cancel")}
          </button>
          <button
            className="btn flex-1"
            type="button"
            disabled={busy}
            data-testid="late-submit"
            onClick={() => onSubmit(reason.trim())}
          >
            {t("lateSubmit")}
          </button>
        </div>
      </div>
    </div>
  );
}
