"use client";

import { useEffect, useMemo, useState } from "react";
import { usePathname, useRouter } from "next/navigation";
import { useGuideOptional } from "@/components/GuideProvider";
import { GUIDE_TARGETS, TOUR_DONE_KEY, type GuideTarget } from "@/lib/guide-intents";

type Step = GuideTarget & { adminOnly?: boolean };

const STAFF_STEPS: Step[] = [
  GUIDE_TARGETS.find((t) => t.id === "home")!,
  GUIDE_TARGETS.find((t) => t.id === "presence")!,
  GUIDE_TARGETS.find((t) => t.id === "now")!,
  GUIDE_TARGETS.find((t) => t.id === "plan")!,
  GUIDE_TARGETS.find((t) => t.id === "stock")!,
  GUIDE_TARGETS.find((t) => t.id === "zoai")!,
  GUIDE_TARGETS.find((t) => t.id === "shop")!,
  GUIDE_TARGETS.find((t) => t.id === "talk")!,
  GUIDE_TARGETS.find((t) => t.id === "book")!,
  {
    ...GUIDE_TARGETS.find((t) => t.id === "calendar")!,
  },
  {
    id: "notify",
    href: "/admin/notify",
    spotlight: "tour-admin",
    title: "Automationen",
    body: "Admin: Regeln an/aus, Push, Rundsendung.",
    ask: "Wie richte ich Automationen ein?",
    adminOnly: true,
  },
];

const CHILD_STEPS: Step[] = [
  {
    id: "kids",
    href: "/kids",
    spotlight: "tour-kids",
    title: "Heute",
    body: "XP, Serie und Termine — keine Personal-Tools.",
    ask: "Was kann ich hier machen?",
  },
  {
    id: "games",
    href: "/kids/games",
    spotlight: "tour-games",
    title: "Spiele",
    body: "Memory, Quiz, Atemreise — belohnen dich.",
  },
  {
    id: "zoai",
    href: "/kids/zoai",
    spotlight: "tour-zoai",
    title: "Zo-Ai",
    body: "Fragen erlaubt — keine Lager-/Plan-Änderungen.",
  },
];

function storageKey(mode: string) {
  return `armonia.tour.state.${mode}.v3`;
}

export function GuidedTour({ mode = "staff", admin = false }: { mode?: "staff" | "child"; admin?: boolean }) {
  const router = useRouter();
  const path = usePathname();
  const guide = useGuideOptional();
  const steps = useMemo(() => {
    const base = mode === "child" ? CHILD_STEPS : STAFF_STEPS;
    return base.filter((s) => !s.adminOnly || admin);
  }, [mode, admin]);
  const [open, setOpen] = useState(false);
  const [idx, setIdx] = useState(0);
  const [hydrated, setHydrated] = useState(false);
  const step = steps[idx] || steps[0];
  const doneKey = TOUR_DONE_KEY[mode];

  useEffect(() => {
    const done = localStorage.getItem(doneKey);
    if (done) {
      setOpen(false);
      setHydrated(true);
      return;
    }
    try {
      const raw = sessionStorage.getItem(storageKey(mode));
      if (raw) {
        const parsed = JSON.parse(raw) as { idx?: number; open?: boolean };
        if (typeof parsed.idx === "number") setIdx(Math.max(0, Math.min(parsed.idx, steps.length - 1)));
        setOpen(parsed.open !== false);
      } else {
        setOpen(true);
      }
    } catch {
      setOpen(true);
    }
    setHydrated(true);
  }, [mode, steps.length, doneKey]);

  useEffect(() => {
    if (!hydrated) return;
    if (localStorage.getItem(doneKey)) return;
    sessionStorage.setItem(storageKey(mode), JSON.stringify({ idx, open }));
  }, [hydrated, idx, open, mode, doneKey]);

  useEffect(() => {
    if (!open || !step) return;
    if (step.href !== path) {
      router.push(step.href);
      return;
    }
    guide?.startGuide(step, "tour");
  }, [open, idx, step, path, router, guide]);

  useEffect(() => {
    document.body.classList.toggle("sheet-open", open);
    return () => document.body.classList.remove("sheet-open");
  }, [open]);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (!open) return;
      if (e.key === "Escape") finish();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open, mode]);

  const progress = useMemo(() => ((idx + 1) / Math.max(steps.length, 1)) * 100, [idx, steps.length]);

  function finish() {
    localStorage.setItem(doneKey, "1");
    sessionStorage.removeItem(storageKey(mode));
    guide?.clearGuide();
    setOpen(false);
  }

  function next() {
    if (idx >= steps.length - 1) {
      finish();
      return;
    }
    setIdx(idx + 1);
  }

  function prev() {
    if (idx <= 0) return;
    setIdx(idx - 1);
  }

  function askAi() {
    if (!step?.ask) return;
    const q = encodeURIComponent(step.ask);
    finish();
    router.push(`/zoai?guideAsk=${q}`);
  }

  if (!hydrated || !step) return null;

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
        Hilfe
      </button>
    );
  }

  return (
    <div className="tour-rail" data-testid="guided-tour" role="dialog" aria-label="Geführte Tour">
      <div className="tour-card tour-card-compact">
        <div className="tour-progress" style={{ width: `${progress}%` }} />
        <p className="eyebrow">
          Tour {idx + 1}/{steps.length}
        </p>
        <h2 className="text-xl m-0">{step.title}</h2>
        <p className="muted mt-2 mb-0 body-sm">{step.body}</p>
        <div className="tour-actions tour-actions-compact">
          <button type="button" className="btn ghost" onClick={prev} disabled={idx === 0}>
            Zurück
          </button>
          {step.ask && mode === "staff" && (
            <button type="button" className="btn-sec" onClick={askAi} data-testid="tour-ask-ai">
              Frag Zo-Ai
            </button>
          )}
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
