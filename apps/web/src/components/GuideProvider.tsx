"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
  type ReactNode,
} from "react";
import { usePathname, useRouter } from "next/navigation";
import type { GuideTarget } from "@/lib/guide-intents";

type ActiveGuide = GuideTarget & { source?: "tour" | "zoai" | "home" };

type StartOpts = { navigate?: boolean };

type GuideCtx = {
  active: ActiveGuide | null;
  startGuide: (target: GuideTarget, source?: ActiveGuide["source"], opts?: StartOpts) => void;
  clearGuide: () => void;
};

const Ctx = createContext<GuideCtx | null>(null);

export function useGuide() {
  const ctx = useContext(Ctx);
  if (!ctx) throw new Error("useGuide requires GuideProvider");
  return ctx;
}

export function useGuideOptional() {
  return useContext(Ctx);
}

export function GuideProvider({ children }: { children: ReactNode }) {
  const router = useRouter();
  const path = usePathname();
  const [active, setActive] = useState<ActiveGuide | null>(null);
  const [rect, setRect] = useState<DOMRect | null>(null);
  const retryRef = useRef(0);

  const clearGuide = useCallback(() => {
    setActive(null);
    setRect(null);
    retryRef.current = 0;
    document.querySelectorAll(".tour-spotlight-target").forEach((el) => {
      el.classList.remove("tour-spotlight-target");
    });
  }, []);

  const measure = useCallback((spotlight: string) => {
    document.querySelectorAll(".tour-spotlight-target").forEach((el) => {
      el.classList.remove("tour-spotlight-target");
    });
    const el = document.querySelector(`[data-tour="${spotlight}"]`) as HTMLElement | null;
    if (!el) {
      setRect(null);
      return false;
    }
    el.classList.add("tour-spotlight-target");
    el.scrollIntoView({ block: "center", behavior: "smooth" });
    setRect(el.getBoundingClientRect());
    return true;
  }, []);

  const startGuide = useCallback(
    (target: GuideTarget, source: ActiveGuide["source"] = "tour", opts?: StartOpts) => {
      const navigate = opts?.navigate ?? source !== "zoai";
      setActive({ ...target, source });
      retryRef.current = 0;
      if (navigate && target.href !== path) {
        router.push(target.href);
      } else if (target.href === path) {
        requestAnimationFrame(() => measure(target.spotlight));
      }
    },
    [measure, path, router],
  );

  useEffect(() => {
    if (!active) return;
    let cancelled = false;
    retryRef.current = 0;

    const tick = () => {
      if (cancelled) return;
      const ok = measure(active.spotlight);
      if (ok) {
        retryRef.current = 0;
        return;
      }
      retryRef.current += 1;
      if (retryRef.current < 20) {
        window.setTimeout(tick, 100);
      }
    };

    const t = window.setTimeout(tick, 80);
    const onResize = () => measure(active.spotlight);
    window.addEventListener("resize", onResize);
    window.addEventListener("scroll", onResize, true);
    return () => {
      cancelled = true;
      window.clearTimeout(t);
      window.removeEventListener("resize", onResize);
      window.removeEventListener("scroll", onResize, true);
    };
  }, [active, path, measure]);

  useEffect(() => {
    document.body.classList.toggle("guide-active", !!active);
    return () => document.body.classList.remove("guide-active");
  }, [active]);

  const value = useMemo(() => ({ active, startGuide, clearGuide }), [active, startGuide, clearGuide]);

  const pad = 8;
  const hole = rect
    ? {
        top: Math.max(8, rect.top - pad),
        left: Math.max(8, rect.left - pad),
        width: rect.width + pad * 2,
        height: rect.height + pad * 2,
      }
    : null;

  const needsGo = !!active && active.href !== path;

  return (
    <Ctx.Provider value={value}>
      {children}
      {active && (
        <div className="guide-layer" data-testid="guide-layer" aria-live="polite">
          {(hole || !needsGo) && <div className="guide-scrim" onClick={clearGuide} />}
          {hole && (
            <div
              className="guide-hole"
              style={{
                top: hole.top,
                left: hole.left,
                width: hole.width,
                height: hole.height,
              }}
            />
          )}
          {active.source !== "tour" && (
            <div className="guide-coach" role="dialog" aria-label="Bildschirmführung">
              <p className="eyebrow">{active.source === "zoai" ? "Zo-Ai führt dich" : "Führung"}</p>
              <h2 className="text-xl m-0">{active.title}</h2>
              <p className="muted mt-2 mb-0">{active.body}</p>
              <div className="guide-coach-actions">
                <button type="button" className="btn ghost" onClick={clearGuide} data-testid="guide-dismiss">
                  {needsGo ? "Später" : "Verstanden"}
                </button>
                {needsGo && (
                  <button
                    type="button"
                    className="btn"
                    data-testid="guide-go"
                    onClick={() => router.push(active.href)}
                  >
                    Zeig mir
                  </button>
                )}
              </div>
            </div>
          )}
        </div>
      )}
    </Ctx.Provider>
  );
}
