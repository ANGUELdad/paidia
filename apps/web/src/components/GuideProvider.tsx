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

function clearSpotlightClass() {
  document.querySelectorAll(".tour-spotlight-target").forEach((el) => {
    el.classList.remove("tour-spotlight-target");
  });
}

export function GuideProvider({ children }: { children: ReactNode }) {
  const router = useRouter();
  const path = usePathname();
  const [active, setActive] = useState<ActiveGuide | null>(null);
  const [holeStyle, setHoleStyle] = useState<React.CSSProperties | null>(null);
  const tries = useRef(0);

  const clearGuide = useCallback(() => {
    setActive(null);
    setHoleStyle(null);
    tries.current = 0;
    clearSpotlightClass();
  }, []);

  const measure = useCallback((spotlight: string) => {
    clearSpotlightClass();
    const el = document.querySelector(`[data-tour="${spotlight}"]`) as HTMLElement | null;
    if (!el) {
      setHoleStyle(null);
      return false;
    }
    const r = el.getBoundingClientRect();
    if (r.width < 4 || r.height < 4) {
      setHoleStyle(null);
      return false;
    }
    el.classList.add("tour-spotlight-target");
    el.scrollIntoView({ block: "center", behavior: "smooth" });
    const pad = 10;
    const top = Math.max(0, r.top - pad);
    const left = Math.max(0, r.left - pad);
    const right = Math.min(window.innerWidth, r.right + pad);
    const bottom = Math.min(window.innerHeight, r.bottom + pad);
    // Even-odd polygon: full screen with rectangular hole
    const clip = `polygon(evenodd, 0% 0%, 0% 100%, 100% 100%, 100% 0%, 0% 0%, ${left}px ${top}px, ${right}px ${top}px, ${right}px ${bottom}px, ${left}px ${bottom}px, ${left}px ${top}px)`;
    setHoleStyle({
      clipPath: clip,
      WebkitClipPath: clip,
    } as React.CSSProperties);
    return true;
  }, []);

  const startGuide = useCallback(
    (target: GuideTarget, source: ActiveGuide["source"] = "tour", opts?: StartOpts) => {
      const navigate = opts?.navigate ?? source !== "zoai";
      setActive({ ...target, source });
      setHoleStyle(null);
      tries.current = 0;
      if (navigate && target.href !== path) router.push(target.href);
    },
    [path, router],
  );

  useEffect(() => {
    if (!active) return;
    let cancelled = false;
    let timer = 0;
    tries.current = 0;

    const tick = () => {
      if (cancelled) return;
      if (measure(active.spotlight)) {
        tries.current = 0;
        return;
      }
      tries.current += 1;
      if (tries.current < 50) timer = window.setTimeout(tick, 80);
    };

    timer = window.setTimeout(tick, 30);
    const onResize = () => measure(active.spotlight);
    window.addEventListener("resize", onResize);
    window.addEventListener("scroll", onResize, true);
    const mo = new MutationObserver(() => {
      if (!cancelled) measure(active.spotlight);
    });
    mo.observe(document.body, { childList: true, subtree: true });

    return () => {
      cancelled = true;
      window.clearTimeout(timer);
      mo.disconnect();
      window.removeEventListener("resize", onResize);
      window.removeEventListener("scroll", onResize, true);
    };
  }, [active, path, measure]);

  useEffect(() => {
    document.body.classList.toggle("guide-active", !!active);
    return () => document.body.classList.remove("guide-active");
  }, [active]);

  const value = useMemo(() => ({ active, startGuide, clearGuide }), [active, startGuide, clearGuide]);
  const needsGo = !!active && active.href !== path;

  return (
    <Ctx.Provider value={value}>
      {children}
      {active && (
        <div className="guide-layer" data-testid="guide-layer" aria-live="polite">
          <div
            className={`guide-scrim${holeStyle ? " guide-scrim-cut" : ""}`}
            data-testid="guide-hole"
            style={holeStyle || undefined}
            onClick={clearGuide}
          />
          {active.source !== "tour" && (
            <div className="guide-coach" role="dialog" aria-label="Bildschirmführung">
              <p className="eyebrow">{active.source === "zoai" ? "Zo-Ai führt dich" : "Führung"}</p>
              <h2 className="text-xl m-0">{active.title}</h2>
              <p className="muted mt-2 mb-0">{active.body}</p>
              <div className="guide-coach-actions">
                <button type="button" className="btn ghost" onClick={clearGuide} data-testid="guide-dismiss">
                  {needsGo ? "Später" : "Verstanden"}
                </button>
                {needsGo ? (
                  <button type="button" className="btn" data-testid="guide-go" onClick={() => router.push(active.href)}>
                    Zeig mir
                  </button>
                ) : null}
              </div>
            </div>
          )}
        </div>
      )}
    </Ctx.Provider>
  );
}
