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
    body: "Oben auf Heute: „Schicht starten“ oder Verspätung. Läuft die Schicht schon: Übergabe / Tagesplan.",
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
  { re: /schichtbuch|\bbuch\b|journal|audit|βιβλίο|ημερολόγιο\s*βάρδιας/i, id: "book" },
  { re: /(?<![\wäöü])schicht(?!buch)|präsenz|anwesend|check.?in|zu\s*spät|verspät|\bstarte?\b|βάρδια|παρουσία|καθυστέρ|ξεκίνα/i, id: "presence" },
  { re: /jetzt\s*wichtig|was\s*jetzt|nächste\s*aufgabe|τι\s*τώρα|επόμενη\s*εργασία/i, id: "now" },
  { re: /wochenplan|tagesplan|\bplan\b|schedule|block|πρόγραμμα|εβδομάδα/i, id: "plan" },
  { re: /lager|bestand|vorrat|milch|stock|αποθήκη|απόθεμα/i, id: "stock" },
  { re: /einkauf|liste|shop|einkaufen|λίστα|ψώνια/i, id: "shop" },
  { re: /zo.?ai|assistent|ki\b|frage\s*stellen|führung|βοηθός/i, id: "zoai" },
  { re: /\btalk\b|chat|besprechung|notiz|συνομιλία|σημείωση/i, id: "talk" },
  { re: /kalender|termin|ics|ημερολόγιο|ραντεβού/i, id: "calendar" },
  { re: /heute|home|start\s*bildschirm|übersicht|σήμερα|αρχική/i, id: "home" },
];

export function resolveGuideIntent(text: string): GuideTarget | null {
  const q = text.trim();
  if (!q) return null;
  // How-to / where questions (DE/EL). Greek questions often end with `;`.
  const how =
    /wie|how|wo\s*(finde|sehe|öffne)|zeig\s+mir|erklä|help|hilfe|\?|πώς|πως|πού|που\s+|δείξ|βοήθεια|;/i.test(q);
  if (!how) return null;
  for (const rule of RULES) {
    if (rule.re.test(q)) {
      return GUIDE_TARGETS.find((t) => t.id === rule.id) || null;
    }
  }
  return GUIDE_TARGETS.find((t) => t.id === "home") || null;
}

export const TOUR_DONE_KEY = {
  staff: "armonia.tour.staff.v3",
  child: "armonia.tour.child.v3",
} as const;
