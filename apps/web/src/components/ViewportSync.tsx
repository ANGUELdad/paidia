"use client";

import { useEffect } from "react";
import { applyViewport, readViewport } from "@/lib/viewport";

export function ViewportSync({ mode }: { mode?: "staff" | "child" }) {
  useEffect(() => {
    const root = document.documentElement;
    if (mode) root.dataset.mode = mode;

    const sync = () => applyViewport(readViewport());
    sync();

    window.addEventListener("resize", sync);
    window.addEventListener("orientationchange", sync);
    window.visualViewport?.addEventListener("resize", sync);
    window.visualViewport?.addEventListener("scroll", sync);

    return () => {
      window.removeEventListener("resize", sync);
      window.removeEventListener("orientationchange", sync);
      window.visualViewport?.removeEventListener("resize", sync);
      window.visualViewport?.removeEventListener("scroll", sync);
    };
  }, [mode]);

  return null;
}
