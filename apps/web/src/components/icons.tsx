/** Compact line icons for dock / chrome — no emoji as primary UI. */

const stroke = {
  fill: "none",
  stroke: "currentColor",
  strokeWidth: 1.8,
  strokeLinecap: "round" as const,
  strokeLinejoin: "round" as const,
};

export function IconHome() {
  return (
    <svg viewBox="0 0 24 24" width="20" height="20" aria-hidden {...stroke}>
      <path d="M4 10.5 12 4l8 6.5V20a1 1 0 0 1-1 1h-5v-6H10v6H5a1 1 0 0 1-1-1z" />
    </svg>
  );
}

export function IconPlan() {
  return (
    <svg viewBox="0 0 24 24" width="20" height="20" aria-hidden {...stroke}>
      <rect x="4" y="5" width="16" height="15" rx="2" />
      <path d="M8 3v4M16 3v4M4 10h16" />
    </svg>
  );
}

export function IconStock() {
  return (
    <svg viewBox="0 0 24 24" width="20" height="20" aria-hidden {...stroke}>
      <path d="M4 8h16l-1.2 11.2A2 2 0 0 1 16.82 21H7.18a2 2 0 0 1-1.98-1.8L4 8Z" />
      <path d="M9 8V6a3 3 0 0 1 6 0v2" />
    </svg>
  );
}

export function IconSpark() {
  return (
    <svg viewBox="0 0 24 24" width="20" height="20" aria-hidden {...stroke}>
      <path d="M12 3v4M12 17v4M4.9 6.5l2.8 2.8M16.3 14.7l2.8 2.8M3 12h4M17 12h4M4.9 17.5l2.8-2.8M16.3 9.3l2.8-2.8" />
      <circle cx="12" cy="12" r="2.2" />
    </svg>
  );
}

export function IconMore() {
  return (
    <svg viewBox="0 0 24 24" width="20" height="20" aria-hidden {...stroke}>
      <circle cx="6" cy="12" r="1.4" fill="currentColor" stroke="none" />
      <circle cx="12" cy="12" r="1.4" fill="currentColor" stroke="none" />
      <circle cx="18" cy="12" r="1.4" fill="currentColor" stroke="none" />
    </svg>
  );
}

export function IconGames() {
  return (
    <svg viewBox="0 0 24 24" width="20" height="20" aria-hidden {...stroke}>
      <rect x="3" y="8" width="18" height="10" rx="3" />
      <path d="M8 13h2M9 12v2M15.2 12.2h.01M17.2 14.2h.01" />
    </svg>
  );
}

export function IconMe() {
  return (
    <svg viewBox="0 0 24 24" width="20" height="20" aria-hidden {...stroke}>
      <circle cx="12" cy="8" r="3.2" />
      <path d="M5.5 19.2c1.4-3 3.7-4.5 6.5-4.5s5.1 1.5 6.5 4.5" />
    </svg>
  );
}
