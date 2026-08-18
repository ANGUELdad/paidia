import { getStoredLang } from "@/lib/i18n";

export type ZoAiAction = { type: string; payload?: Record<string, unknown> } & Record<string, unknown>;

function loc(de: string, el: string) {
  return getStoredLang() === "el" ? el : de;
}

const BLOCK_LABELS: Record<string, string> = {
  morning: "Vormittag",
  afternoon: "Nachmittag",
  evening: "Abend",
};

const AUDIENCE_LABELS: Record<string, string> = {
  staff: "Team",
  all: "Alle",
  admin: "Admin",
  children: "Kinder",
};

export const TAB_HREF: Record<string, string> = {
  home: "/home",
  gallery: "/calendar",
  schedule: "/plan",
  plan: "/plan",
  stock: "/stock",
  shop: "/shop",
  book: "/book",
  talk: "/talk",
  calendar: "/calendar",
  events: "/calendar",
};

const TAB_LABEL: Record<string, string> = {
  home: "Heute",
  gallery: "Galerie / Kalender",
  schedule: "Wochenplan",
  plan: "Wochenplan",
  stock: "Lager",
  shop: "Einkaufsliste",
  book: "Schichtbuch",
  talk: "Talk",
  calendar: "Kalender",
  events: "Events",
};

function field(action: ZoAiAction, key: string): unknown {
  if (action.payload && key in action.payload) return action.payload[key];
  return action[key];
}

export function actionStr(action: ZoAiAction, key: string, fallback = ""): string {
  const raw = field(action, key);
  if (raw == null || raw === "") return fallback;
  return String(raw);
}

function str(action: ZoAiAction, key: string, fallback = ""): string {
  return actionStr(action, key, fallback);
}

function num(action: ZoAiAction, key: string, fallback = 0): number {
  const raw = field(action, key);
  const n = Number(raw);
  return Number.isFinite(n) ? n : fallback;
}

function chip(label: string, value: string, href?: string): { label: string; value: string; href?: string } | null {
  const v = value.trim();
  if (!v) return null;
  return href ? { label, value: v, href } : { label, value: v };
}

export function actionNeedsPin(action: ZoAiAction): boolean {
  const type = action.type || "";
  if (isNavigateAction(action)) return false;
  return type.includes("schedule") || type.includes("template") || type.includes("broadcast");
}

export function tabHref(tab: string): string {
  return TAB_HREF[tab] || "/home";
}

export function isNavigateAction(action: ZoAiAction): boolean {
  const type = action.type || "";
  return type === "open_tab" || type === "event_announce";
}

export type ActionChip = { label: string; value: string; href?: string };

export type ActionCardView = {
  kind: string;
  sentence: string;
  chips: ActionChip[];
  pinRequired: boolean;
  href?: string;
  navigateOnly?: boolean;
};

export function describeAction(action: ZoAiAction): ActionCardView {
  const type = action.type || "unknown";
  const house = str(action, "houseId", "h1");
  const product = str(action, "name") || str(action, "productQuery") || "Artikel";
  const unit = str(action, "unit", "Stk");
  const pinRequired = actionNeedsPin(action);

  switch (type) {
    case "shop_add": {
      const qty = num(action, "qty", 1);
      return {
        kind: "Einkaufsliste",
        sentence: `${qty}× ${product} auf die Einkaufsliste setzen.`,
        chips: [chip("Haus", house), chip("Menge", String(qty)), chip("Einheit", unit)].filter(Boolean) as ActionChip[],
        pinRequired,
      };
    }
    case "shop_remove": {
      return {
        kind: loc("Einkaufsliste", "Λίστα"),
        sentence: loc(`${product} von der Einkaufsliste entfernen.`, `${product}: αφαίρεση από τη λίστα.`),
        chips: [chip(loc("Haus", "Σπίτι"), house), chip(loc("Artikel", "Είδος"), product), chip(loc("Liste", "Λίστα"), loc("Einkauf", "Αγορές"), "/shop")].filter(Boolean) as ActionChip[],
        pinRequired,
      };
    }
    case "want_bought": {
      return {
        kind: loc("Freitagsliste", "Λίστα Παρασκευής"),
        sentence: loc(`${product} für die Freitagsliste vormerken.`, `${product}: σημείωση για τη λίστα Παρασκευής.`),
        chips: [chip(loc("Haus", "Σπίτι"), house), chip(loc("Artikel", "Είδος"), product), chip(loc("Liste", "Λίστα"), loc("Freitag", "Παρασκευή"), "/shop")].filter(Boolean) as ActionChip[],
        pinRequired,
      };
    }
    case "stock_adjust": {
      const dir = str(action, "dir", "IN").toUpperCase();
      const qty = num(action, "qty", 1);
      const verb = dir === "OUT" ? "entnehmen" : "einbuchen";
      return {
        kind: "Lager",
        sentence: `${qty} ${unit} ${product} ${verb}.`,
        chips: [
          chip("Richtung", dir === "OUT" ? "Abgang" : "Zugang"),
          chip("Haus", house),
          chip("Menge", String(qty)),
          chip("Einheit", unit),
        ].filter(Boolean) as ActionChip[],
        pinRequired,
      };
    }
    case "stock_set": {
      const qty = num(action, "qty", 0);
      return {
        kind: "Lager",
        sentence: `Bestand von ${product} auf ${qty} ${unit} setzen.`,
        chips: [chip("Haus", house), chip("Menge", String(qty)), chip("Einheit", unit)].filter(Boolean) as ActionChip[],
        pinRequired,
      };
    }
    case "schedule_add": {
      const date = str(action, "date");
      const block = BLOCK_LABELS[str(action, "block", "morning")] || str(action, "block", "morning");
      const activity = str(action, "activity") || str(action, "activityQuery") || "Betreuung";
      const houseIds = field(action, "houseIds");
      const houses = Array.isArray(houseIds) ? houseIds.map(String).join(", ") : house;
      const from = str(action, "from");
      const to = str(action, "to");
      const note = str(action, "note");
      return {
        kind: "Plan",
        sentence: `${activity} am ${date || "heute"} (${block}) einplanen.`,
        chips: [
          chip("Datum", date),
          chip("Block", block),
          from && to ? chip("Zeit", `${from}–${to}`) : null,
          chip("Häuser", houses),
          chip("Notiz", note),
        ].filter(Boolean) as ActionChip[],
        pinRequired: true,
      };
    }
    case "broadcast_email": {
      const audience = AUDIENCE_LABELS[str(action, "audience", "staff")] || str(action, "audience", "staff");
      const subject = str(action, "subject", "Hinweis");
      const message = str(action, "message") || str(action, "body");
      const preview = message.length > 80 ? `${message.slice(0, 77)}…` : message;
      return {
        kind: "Broadcast",
        sentence: `E-Mail an ${audience}: „${subject}“.`,
        chips: [chip("Empfänger", audience), chip("Betreff", subject), preview ? chip("Nachricht", preview) : null].filter(
          Boolean,
        ) as ActionChip[],
        pinRequired: true,
      };
    }
    case "open_tab": {
      const tab = str(action, "tab", "home");
      const href = tabHref(tab);
      const label = TAB_LABEL[tab] || tab;
      return {
        kind: loc("Navigation", "Πλοήγηση"),
        sentence: loc(`${label} öffnen.`, `Άνοιγμα: ${label}.`),
        chips: [chip(loc("Bereich", "Περιοχή"), label, href)].filter(Boolean) as ActionChip[],
        pinRequired: false,
        href,
        navigateOnly: true,
      };
    }
    case "event_announce": {
      return {
        kind: loc("Events", "Εκδηλώσεις"),
        sentence: loc("Event-Tools öffnen — Termin prüfen und veröffentlichen.", "Άνοιγμα εργαλείων εκδηλώσεων — έλεγχος και δημοσίευση."),
        chips: [chip(loc("Bereich", "Περιοχή"), loc("Kalender", "Ημερολόγιο"), "/calendar")].filter(Boolean) as ActionChip[],
        pinRequired: false,
        href: "/calendar",
        navigateOnly: true,
      };
    }
    default:
      return {
        kind: type,
        sentence: "Unbekannte Aktion — bitte Zo-Ai erneut fragen.",
        chips: [],
        pinRequired,
      };
  }
}
