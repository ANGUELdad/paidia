/**
 * Minimal inline SVG icon set.
 * Emoji is allowed only in Kids games and profile nickname.
 * All chrome/ops icons use this component.
 */

type IconProps = { size?: number; className?: string; "aria-hidden"?: boolean | "true" | "false" };

const PATHS: Record<string, string | string[]> = {
  home: "M3 9.5L9 3l6 6.5V16H12v-4H6v4H3V9.5z",
  plan: "M4 5h10M4 9h10M4 13h6",
  stock: "M3 17V7l6-4 6 4v10M9 17v-5h2v5",
  zoai: "M4 12a8 8 0 1 1 16 0 8 8 0 0 1-16 0zm8-4v4l2.5 2.5",
  mehr: ["M5 9h14", "M5 14h14"],
  handover: "M4 7h16M4 12h10m-4 5 4-5-4-5",
  coverage: "M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2m8-10a4 4 0 1 0 0-8 4 4 0 0 0 0 8zm13 10v-2a4 4 0 0 0-3-3.87m-4-12a4 4 0 0 1 0 7.75",
  incident: "M12 9v4m0 4h.01M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z",
  care: "M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z",
  book: "M4 19.5A2.5 2.5 0 0 1 6.5 17H20M4 19.5A2.5 2.5 0 0 0 6.5 22H20V2H6.5A2.5 2.5 0 0 0 4 4.5v15z",
  talk: "M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2v10z",
  shop: "M6 2L3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4zM3 6h18m-5 4a4 4 0 0 1-8 0",
  calendar: "M3 4h18v16a1 1 0 0 1-1 1H4a1 1 0 0 1-1-1V4zm5-2v4m8-4v4M3 10h18",
  profile: "M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2m8-10a4 4 0 1 0 0-8 4 4 0 0 0 0 8z",
  admin: "M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z",
  today: "M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 0 0 2-2V7a2 2 0 0 0-2-2H5a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2z",
  games: "M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16zM3.27 6.96 12 12.01l8.73-5.05M12 22.08V12",
  me: "M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2m8-10a4 4 0 1 0 0-8 4 4 0 0 0 0 8z",
  back: "M19 12H5m7-7-7 7 7 7",
  check: "M20 6L9 17l-5-5",
  plus: "M12 5v14m-7-7h14",
  close: "M18 6L6 18M6 6l12 12",
  arrow: "M5 12h14m-7-7 7 7-7 7",
  warn: "M12 9v4m0 4h.01M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z",
  info: "M12 16v-4m0-4h.01M12 22a10 10 0 1 0 0-20 10 10 0 0 0 0 20z",
  notif: "M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9m-4.27 13a2 2 0 0 1-3.46 0",
  meal: "M3 2v7c0 1.1.9 2 2 2h4a2 2 0 0 0 2-2V2m0 5H3m9 15V7l9-5v20",
  sleep: "M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z",
  mood: "M8 14s1.5 2 4 2 4-2 4-2M9 9h.01M15 9h.01M22 12a10 10 0 1 1-20 0 10 10 0 0 1 20 0z",
  meds: "M9 3H5v4l6.5 6.5M19 3h-4l-7 7M15 21l-6-6m0 0-3 3m9-9 3 3",
  pine: "M12 2L7 12h3l-2 10h8l-2-10h3L12 2z",
};

export function Icon({ name, size = 20, className, "aria-hidden": ariaHidden = true }: IconProps & { name: keyof typeof PATHS }) {
  const d = PATHS[name];
  const paths = Array.isArray(d) ? d : [d];
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.75"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
      aria-hidden={ariaHidden}
    >
      {paths.map((p, i) => <path key={i} d={p} />)}
    </svg>
  );
}
