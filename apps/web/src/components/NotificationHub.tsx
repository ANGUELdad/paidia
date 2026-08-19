"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { api } from "@/lib/api";
import { ensureNotifPermission } from "@/lib/reminders";
import type { Lang } from "@/lib/i18n";

type Due = { kind?: string; title?: string; body?: string; url?: string };

export function NotificationHub({
  open,
  onClose,
  lang,
}: {
  open: boolean;
  onClose: () => void;
  lang: Lang;
}) {
  const [due, setDue] = useState<Due[]>([]);
  const [perm, setPerm] = useState<NotificationPermission>("default");
  const el = lang === "el";

  useEffect(() => {
    if (!open) return;
    if ("Notification" in window) setPerm(Notification.permission);
    api<{ due: Due[] }>("/api/notify/evaluate")
      .then((r) => setDue(r.due || []))
      .catch(() => setDue([]));
  }, [open]);

  if (!open) return null;

  return (
    <div className="hub-overlay" role="presentation" onClick={onClose} data-testid="notify-hub">
      <div className="hub-sheet" role="dialog" aria-modal="true" aria-labelledby="hub-title" onClick={(e) => e.stopPropagation()}>
        <header className="hub-head">
          <h2 id="hub-title">{el ? "Ειδοποιήσεις" : "Mitteilungen"}</h2>
          <button type="button" className="more-sheet-close" onClick={onClose} aria-label={el ? "Κλείσιμο" : "Schließen"}>
            ✕
          </button>
        </header>
        <p className="hub-lead">
          {el
            ? "Όμορφα, σύντομα σήματα για τη βάρδια — στο app και στο λειτουργικό."
            : "Klare, kurze Signale für die Schicht — in der App und im Betriebssystem."}
        </p>
        {perm !== "granted" && "Notification" in window && (
          <button
            type="button"
            className="btn w-full mb-3"
            onClick={async () => {
              const next = await ensureNotifPermission();
              setPerm(next);
            }}
          >
            {el ? "Ειδοποιήσεις συστήματος" : "System-Mitteilungen erlauben"}
          </button>
        )}
        {perm === "granted" && (
          <p className="chip on mb-3" style={{ display: "inline-flex" }}>
            {el ? "Σύστημα ενεργό" : "System aktiv"}
          </p>
        )}
        <div className="hub-list">
          {due.length === 0 ? (
            <p className="muted text-sm m-0">{el ? "Όλα ήσυχα." : "Alles ruhig."}</p>
          ) : (
            due.map((item, i) => (
              <Link key={`${item.kind}-${i}`} href={item.url || "/home"} className="hub-row" onClick={onClose}>
                <b>{item.title || item.kind}</b>
                <small>{item.body}</small>
              </Link>
            ))
          )}
        </div>
      </div>
    </div>
  );
}
