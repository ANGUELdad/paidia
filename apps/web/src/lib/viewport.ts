"use client";

export type OsKind = "ios" | "ipados" | "macos" | "windows" | "android" | "other";
export type FormKind = "phone" | "tablet" | "desktop";
export type OrientKind = "portrait" | "landscape";

export type ViewportState = {
  os: OsKind;
  form: FormKind;
  orient: OrientKind;
  standalone: boolean;
  coarse: boolean;
  hover: boolean;
  width: number;
  height: number;
};

function detectOs(): OsKind {
  if (typeof navigator === "undefined") return "other";
  const ua = navigator.userAgent || "";
  const iPad =
    /iPad/i.test(ua) ||
    (navigator.platform === "MacIntel" && (navigator.maxTouchPoints || 0) > 1);
  if (iPad) return "ipados";
  if (/iPhone|iPod/i.test(ua)) return "ios";
  if (/Android/i.test(ua)) return "android";
  if (/Win/i.test(ua)) return "windows";
  if (/Mac/i.test(ua)) return "macos";
  return "other";
}

export function readViewport(): ViewportState {
  const width = typeof window === "undefined" ? 390 : window.innerWidth;
  const height = typeof window === "undefined" ? 844 : window.innerHeight;
  const os = detectOs();
  const coarse =
    typeof window !== "undefined" && window.matchMedia("(pointer: coarse)").matches;
  const hover =
    typeof window !== "undefined" && window.matchMedia("(hover: hover)").matches;
  const standalone =
    typeof window !== "undefined" &&
    (window.matchMedia("(display-mode: standalone)").matches ||
      ("standalone" in navigator && Boolean((navigator as Navigator & { standalone?: boolean }).standalone)));
  const orient: OrientKind = height >= width ? "portrait" : "landscape";
  let form: FormKind = "desktop";
  if (os === "ipados" || (coarse && width >= 700 && width < 1100)) form = "tablet";
  else if (os === "ios" || os === "android" || width < 700) form = "phone";
  else if (width < 900 && coarse) form = "tablet";
  return { os, form, orient, standalone, coarse, hover, width, height };
}

export function applyViewport(state: ViewportState) {
  if (typeof document === "undefined") return;
  const root = document.documentElement;
  root.dataset.os = state.os;
  root.dataset.form = state.form;
  root.dataset.orient = state.orient;
  root.dataset.standalone = state.standalone ? "1" : "0";
  root.dataset.pointer = state.coarse ? "coarse" : "fine";
  const vv = window.visualViewport;
  const h = vv?.height || state.height;
  root.style.setProperty("--vvh", `${h}px`);
  root.style.setProperty("--app-w", `${state.width}px`);
  root.style.setProperty("--app-h", `${state.height}px`);
  const kb = vv && Math.max(0, state.height - vv.height) > 80;
  root.dataset.keyboard = kb ? "1" : "0";
}
