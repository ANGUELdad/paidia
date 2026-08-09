"use client";

import { useEffect, useMemo, useState } from "react";
import { usePathname, useRouter } from "next/navigation";

type Step = {
  id: string;
  title: string;
  body: string;
  href: string;
  spotlight?: string;
  adminOnly?: boolean;
};

const STAFF_STEPS: Step[] = [
  { id: "home", title: "Dein Tag", body: "Hier stehen die nächsten Schritte: Präsenz und Erinnerungen.", href: "/home", spotlight: "tour-home" },
  { id: "presence", title: "Schicht starten", body: "Tippe „Schicht starten“ — oder melde Verspätung mit Grund.", href: "/home", spotlight: "tour-presence" },
  { id: "plan", title: "Wochenplan", body: "Raster mit echten Daten. Konflikte brauchen einen Override-Grund.", href: "/plan", spotlight: "tour-plan" },
  { id: "stock", title: "Lager", body: "＋/− Bestand. Niedrige Artikel auf die Liste setzen.", href: "/stock", spotlight: "tour-stock" },
  { id: "shop", title: "Liste", body: "Vorschläge aus Vergangenheit — immer bestätigen, nie auto.", href: "/shop", spotlight: "tour-shop" },
  { id: "talk", title: "Talk", body: "Team-Chat + Besprechungsnotizen der ISO-Woche.", href: "/talk", spotlight: "tour-talk" },
  { id: "book", title: "Schichtbuch", body: "Pflicht-Eintrag. Audit zeigt, was passiert ist.", href: "/book", spotlight: "tour-book" },
  { id: "calendar", title: "Kalender", body: "Events, ICS, Google Calendar, Erinnerungen.", href: "/calendar", spotlight: "tour-cal" },
  { id: "zoai", title: "Zo-Ai", body: "Frag, bestätige Aktionen, PIN nur bei Plan/Broadcast.", href: "/zoai", spotlight: "tour-zoai" },
  { id: "notify", title: "Automationen", body: "Admin: Regeln an/aus, Push, Broadcast.", href: "/admin/notify", spotlight: "tour-admin", adminOnly: true },
];

const CHILD_STEPS: Step[] = [
  { id: "kids", title: "Heute", body: "XP, Streak und Events — keine Staff-Tools.", href: "/kids", spotlight: "tour-kids" },
  { id: "games", title: "Spiele", body: "Memory, Quiz, Calm — belohnen dich.", href: "/kids/games", spotlight: "tour-games" },
  { id: "zoai", title: "Zo-Ai (safe)", body: "Fragen erlaubt — keine Lager-/Plan-Änderungen.", href: "/kids/zoai", spotlight: "tour-zoai" },
];

export function GuidedTour({ mode = "staff", admin = false }: { mode?: "staff" | "child"; admin?: boolean }) {
  const router = useRouter();
  const path = usePathname();
  const steps = useMemo(() => {
    const base = mode === "child" ? CHILD_STEPS : STAFF_STEPS;
    return base.filter((s) => !s.adminOnly || admin);
  }, [mode, admin]);
  const [open, setOpen] = useState(false);
  const [idx, setIdx] = useState(0);
  const step = steps[idx] || steps[0];

  useEffect(() => {
    const done = localStorage.getItem(`armonia.tour.${mode}`);
    if (!done) setOpen(true);
  }, [mode]);

  useEffect(() => {
    if (!open || !step?.spotlight) return;
    const el = document.querySelector(`[data-tour="${step.spotlight}"]`);
    if (el) el.scrollIntoView({ block: "center", behavior: "smooth" });
  }, [open, idx, step?.spotlight, path]);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (!open) return;
      if (e.key === "Escape") setOpen(false);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open]);

  const progress = useMemo(() => ((idx + 1) / Math.max(steps.length, 1)) * 100, [idx, steps.length]);

  function finish() {
    localStorage.setItem(`armonia.tour.${mode}`, "1");
    setOpen(false);
  }

  function next() {
    if (idx >= steps.length - 1) {
      finish();
      return;
    }
    const n = idx + 1;
    setIdx(n);
    if (steps[n].href !== path) router.push(steps[n].href);
  }

  function prev() {
    if (idx <= 0) return;
    const n = idx - 1;
    setIdx(n);
    if (steps[n].href !== path) router.push(steps[n].href);
  }

  function doStep() {
    if (step.href !== path) router.push(step.href);
  }

  if (!step) return null;

  if (!open) {
    return (
      <button
        type="button"
        className="tour-fab"
        data-testid="tour-reopen"
        onClick={() => {
          setIdx(0);
          setOpen(true);
          router.push(steps[0].href);
        }}
      >
        Tour
      </button>
    );
  }

  return (
    <div className="tour-overlay" role="dialog" aria-modal="true" aria-label="Geführte Tour" data-testid="guided-tour">
      <div className="tour-card">
        <div className="tour-progress" style={{ width: `${progress}%` }} />
        <p className="eyebrow">
          Schritt {idx + 1} / {steps.length}
        </p>
        <h2 className="text-2xl">{step.title}</h2>
        <p className="muted mt-2">{step.body}</p>
        <div className="tour-actions">
          <button type="button" className="btn ghost" onClick={prev} disabled={idx === 0}>
            Zurück
          </button>
          <button type="button" className="btn-sec" onClick={doStep} data-testid="tour-go">
            Zeig mir
          </button>
          <button type="button" className="btn" onClick={next} data-testid="tour-next">
            {idx >= steps.length - 1 ? "Fertig" : "Weiter"}
          </button>
        </div>
        <button type="button" className="tour-skip" onClick={finish}>
          Später
        </button>
      </div>
    </div>
  );
}
