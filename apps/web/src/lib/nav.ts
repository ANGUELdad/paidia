import type { Lang } from "@/lib/i18n";

export type NavItem = {
  href: string;
  testId: string;
  group: "shift" | "supply" | "campus" | "kids" | "account" | "admin";
  de: string;
  el: string;
  hintDe: string;
  hintEl: string;
  staff?: boolean;
  child?: boolean;
  admin?: boolean;
  keywords: string;
};

export const NAV: NavItem[] = [
  {
    href: "/home",
    testId: "nav-home",
    group: "shift",
    de: "Heute",
    el: "Σήμερα",
    hintDe: "Schicht, Check-in, Erinnerungen",
    hintEl: "Βάρδια, check-in, υπενθυμίσεις",
    staff: true,
    keywords: "home heute dashboard start schicht",
  },
  {
    href: "/plan",
    testId: "nav-plan",
    group: "shift",
    de: "Plan",
    el: "Πλάνο",
    hintDe: "Tages- und Wochenplan",
    hintEl: "Πλάνο ημέρας και εβδομάδας",
    staff: true,
    keywords: "plan schedule pläno",
  },
  {
    href: "/stock",
    testId: "nav-stock",
    group: "supply",
    de: "Lager",
    el: "Αποθήκη",
    hintDe: "Bestand der Häuser",
    hintEl: "Απόθεμα σπιτιών",
    staff: true,
    keywords: "lager stock vorrat kalyvia",
  },
  {
    href: "/shop",
    testId: "more-liste",
    group: "supply",
    de: "Liste",
    el: "Λίστα",
    hintDe: "Einkauf Freitag",
    hintEl: "Αγορές Παρασκευής",
    staff: true,
    keywords: "liste shop einkauf friday",
  },
  {
    href: "/handover",
    testId: "more-übergabe",
    group: "shift",
    de: "Übergabe",
    el: "Παράδοση",
    hintDe: "An die nächste Schicht",
    hintEl: "Στην επόμενη βάρδια",
    staff: true,
    keywords: "handover übergabe",
  },
  {
    href: "/coverage",
    testId: "more-abdeckung",
    group: "shift",
    de: "Abdeckung",
    el: "Κάλυψη",
    hintDe: "Wer ist da — Lücken",
    hintEl: "Ποιος είναι — κενά",
    staff: true,
    keywords: "coverage abdeckung lücken",
  },
  {
    href: "/incidents",
    testId: "more-vorfälle",
    group: "shift",
    de: "Vorfälle",
    el: "Περιστατικά",
    hintDe: "Sicher dokumentieren",
    hintEl: "Ασφαλής καταγραφή",
    staff: true,
    keywords: "incident vorfall",
  },
  {
    href: "/care",
    testId: "more-kind-tag",
    group: "campus",
    de: "Kind-Tag",
    el: "Ημέρα παιδιού",
    hintDe: "Pflege-Log der Kinder",
    hintEl: "Ημερολόγιο φροντίδας",
    staff: true,
    keywords: "care kind tag pflege",
  },
  {
    href: "/book",
    testId: "more-schichtbuch",
    group: "campus",
    de: "Schichtbuch",
    el: "Βιβλίο βάρδιας",
    hintDe: "Journal der Schicht",
    hintEl: "Ημερολόγιο βάρδιας",
    staff: true,
    keywords: "book journal schichtbuch",
  },
  {
    href: "/talk",
    testId: "more-talk",
    group: "campus",
    de: "Talk",
    el: "Talk",
    hintDe: "Team und Besprechung",
    hintEl: "Ομάδα και σύσκεψη",
    staff: true,
    keywords: "talk team chat meeting",
  },
  {
    href: "/campus",
    testId: "more-campus",
    group: "campus",
    de: "Campus",
    el: "Campus",
    hintDe: "Notizen, Module, Übersicht",
    hintEl: "Σημειώσεις, ενότητες, επισκόπηση",
    staff: true,
    keywords: "campus notes moodle universis lms notizen module",
  },
  {
    href: "/calendar",
    testId: "more-kalender",
    group: "campus",
    de: "Kalender",
    el: "Ημερολόγιο",
    hintDe: "Termine und ICS",
    hintEl: "Ραντεβού και ICS",
    staff: true,
    keywords: "calendar kalender termin",
  },
  {
    href: "/zoai",
    testId: "nav-zoai",
    group: "shift",
    de: "Zo-Ai",
    el: "Zo-Ai",
    hintDe: "Fragen und Aktionen",
    hintEl: "Ερωτήσεις και ενέργειες",
    staff: true,
    keywords: "zoai ai assistant hilfe",
  },
  {
    href: "/profile",
    testId: "more-profil",
    group: "account",
    de: "Profil",
    el: "Προφίλ",
    hintDe: "Name, PIN, Passkey",
    hintEl: "Όνομα, PIN, Passkey",
    staff: true,
    child: true,
    keywords: "profil profile ich me",
  },
  {
    href: "/admin/notify",
    testId: "more-automationen",
    group: "admin",
    de: "Automationen",
    el: "Αυτοματισμοί",
    hintDe: "E-Mail, Erinnerungen, Push",
    hintEl: "Email, υπενθυμίσεις, push",
    staff: true,
    admin: true,
    keywords: "admin notify email push automation",
  },
  {
    href: "/kids",
    testId: "nav-kids",
    group: "kids",
    de: "Heute",
    el: "Σήμερα",
    hintDe: "XP, Stimmung, Events",
    hintEl: "XP, διάθεση, εκδηλώσεις",
    child: true,
    keywords: "kids heute home",
  },
  {
    href: "/kids/games",
    testId: "nav-games",
    group: "kids",
    de: "Spiele",
    el: "Παιχνίδια",
    hintDe: "Memory, Quiz, Atemreise",
    hintEl: "Μνήμη, κουίζ, αναπνοή",
    child: true,
    keywords: "spiele games play",
  },
  {
    href: "/kids/zoai",
    testId: "nav-kids-zoai",
    group: "kids",
    de: "Zo-Ai",
    el: "Zo-Ai",
    hintDe: "Nur Fragen — keine Staff-Tools",
    hintEl: "Μόνο ερωτήσεις",
    child: true,
    keywords: "zoai kids ai",
  },
];

export const GROUP_LABEL: Record<NavItem["group"], { de: string; el: string }> = {
  shift: { de: "Schicht", el: "Βάρδια" },
  supply: { de: "Versorgung", el: "Προμήθεια" },
  campus: { de: "Campus", el: "Campus" },
  kids: { de: "Insel", el: "Νησί" },
  account: { de: "Konto", el: "Λογαριασμός" },
  admin: { de: "Admin", el: "Admin" },
};

export function navLabel(item: NavItem, lang: Lang) {
  return lang === "el" ? item.el : item.de;
}

export function navHint(item: NavItem, lang: Lang) {
  return lang === "el" ? item.hintEl : item.hintDe;
}

export function visibleNav(opts: { mode: "staff" | "child"; admin?: boolean }) {
  return NAV.filter((item) => {
    if (opts.mode === "child") return Boolean(item.child);
    if (!item.staff) return false;
    if (item.admin && !opts.admin) return false;
    return true;
  });
}

export function searchNav(query: string, opts: { mode: "staff" | "child"; admin?: boolean; lang: Lang }) {
  const q = query.trim().toLowerCase();
  const items = visibleNav(opts);
  if (!q) return items;
  return items.filter((item) => {
    const blob = `${item.de} ${item.el} ${item.hintDe} ${item.hintEl} ${item.keywords} ${item.href}`.toLowerCase();
    return blob.includes(q);
  });
}

export function currentNav(path: string, opts: { mode: "staff" | "child"; admin?: boolean }) {
  const items = visibleNav(opts);
  return (
    items.find((item) => path === item.href) ||
    items.find((item) => item.href !== "/home" && item.href !== "/kids" && path.startsWith(item.href)) ||
    items[0]
  );
}
