/** Map “how do I…?” questions to on-screen guide targets. */

export type GuideTarget = {
  id: string;
  href: string;
  spotlight: string;
  title: string;
  body: string;
  ask?: string;
};

export const GUIDE_TARGETS: GuideTarget[] = [
  {
    id: "presence",
    href: "/home",
    spotlight: "tour-presence",
    title: "Schicht starten",
    body: "Tippe „Schicht starten“ auf Heute — oder melde Verspätung mit Grund.",
    ask: "Wie starte ich meine Schicht?",
  },
  {
    id: "home",
    href: "/home",
    spotlight: "tour-home",
    title: "Heute",
    body: "Dein Tagesstart: Präsenz, was jetzt zählt, und Zo-Ai fragen.",
    ask: "Was sehe ich auf Heute?",
  },
  {
    id: "now",
    href: "/home",
    spotlight: "tour-now",
    title: "Jetzt",
    body: "Die wichtigste nächste Aufgabe — zuerst erledigen.",
    ask: "Was ist jetzt wichtig?",
  },
  {
    id: "plan",
    href: "/plan",
    spotlight: "tour-plan",
    title: "Wochenplan",
    body: "Tag wählen, Blöcke prüfen. Änderungen brauchen Confirm + PIN.",
    ask: "Wie ändere ich den Plan?",
  },
  {
    id: "stock",
    href: "/stock",
    spotlight: "tour-stock",
    title: "Lager",
    body: "＋/− Bestand. Niedrige Artikel auf die Einkaufsliste setzen.",
    ask: "Wie pflege ich das Lager?",
  },
  {
    id: "shop",
    href: "/shop",
    spotlight: "tour-shop",
    title: "Einkaufsliste",
    body: "Vorschläge prüfen — immer bestätigen, nie automatisch.",
    ask: "Wie funktioniert die Einkaufsliste?",
  },
  {
    id: "zoai",
    href: "/zoai",
    spotlight: "tour-zoai",
    title: "Zo-Ai",
    body: "Frag auf Deutsch oder Griechisch. Aktionen nur nach Confirm (+ PIN bei Plan).",
    ask: "Wie nutze ich Zo-Ai?",
  },
  {
    id: "talk",
    href: "/talk",
    spotlight: "tour-talk",
    title: "Talk",
    body: "Team-Chat und Besprechungsnotizen der ISO-Woche.",
    ask: "Wie schreibe ich im Talk?",
  },
  {
    id: "book",
    href: "/book",
    spotlight: "tour-book",
    title: "Schichtbuch",
    body: "Pflicht-Eintrag für die Schicht. Audit zeigt, was passiert ist.",
    ask: "Wie fülle ich das Schichtbuch?",
  },
  {
    id: "calendar",
    href: "/calendar",
    spotlight: "tour-cal",
    title: "Kalender",
    body: "Termine, ICS und Erinnerungen.",
    ask: "Wo sehe ich Termine?",
  },
];

const RULES: { re: RegExp; id: string }[] = [
  { re: /schicht\s*start|präsenz|anwesend|check.?in|zu\s*spät|verspät/i, id: "presence" },
  { re: /jetzt\s*wichtig|was\s*jetzt|nächste\s*aufgabe/i, id: "now" },
  { re: /wochenplan|tagesplan|\bplan\b|schedule|block/i, id: "plan" },
  { re: /lager|bestand|vorrat|milch|stock/i, id: "stock" },
  { re: /einkauf|liste|shop|einkaufen/i, id: "shop" },
  { re: /zo.?ai|assistent|ki\b|frage\s*stellen/i, id: "zoai" },
  { re: /\btalk\b|chat|besprechung|notiz/i, id: "talk" },
  { re: /schichtbuch|\bbuch\b|journal|audit/i, id: "book" },
  { re: /kalender|termin|ics/i, id: "calendar" },
  { re: /heute|home|start\s*bildschirm|übersicht/i, id: "home" },
];

export function resolveGuideIntent(text: string): GuideTarget | null {
  const q = text.trim();
  if (!q) return null;
  const how = /wie|how|wo\s*(finde|sehe|öffne)|zeig|erklä|help|hilfe|\?/i.test(q);
  for (const rule of RULES) {
    if (rule.re.test(q)) {
      const target = GUIDE_TARGETS.find((t) => t.id === rule.id) || null;
      if (target && (how || rule.id !== "home")) return target;
    }
  }
  return how ? GUIDE_TARGETS.find((t) => t.id === "home") || null : null;
}

export const TOUR_DONE_KEY = {
  staff: "armonia.tour.staff.v3",
  child: "armonia.tour.child.v3",
} as const;
