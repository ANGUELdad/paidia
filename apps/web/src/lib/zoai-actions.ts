export type ZoAiAction = { type: string; payload?: Record<string, unknown> } & Record<string, unknown>;

const BLOCK_LABELS: Record<string, string> = {
  morning: "Vormittag",
  afternoon: "Nachmittag",
  evening: "Abend",
};

const AUDIENCE_LABELS: Record<string, string> = {
  staff: "Team",
  all: "Alle",
  admin: "Admin",
};

function field(action: ZoAiAction, key: string): unknown {
  if (action.payload && key in action.payload) return action.payload[key];
  return action[key];
}

function str(action: ZoAiAction, key: string, fallback = ""): string {
  const raw = field(action, key);
  if (raw == null || raw === "") return fallback;
  return String(raw);
}

function num(action: ZoAiAction, key: string, fallback = 0): number {
  const raw = field(action, key);
  const n = Number(raw);
  return Number.isFinite(n) ? n : fallback;
}

function chip(label: string, value: string): { label: string; value: string } | null {
  const v = value.trim();
  if (!v) return null;
  return { label, value: v };
}

export function actionNeedsPin(action: ZoAiAction): boolean {
  const type = action.type || "";
  return type.includes("schedule") || type.includes("template") || type.includes("broadcast");
}

export type ActionCardView = {
  kind: string;
  sentence: string;
  chips: { label: string; value: string }[];
  pinRequired: boolean;
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
        chips: [
          chip("Haus", house),
          chip("Menge", String(qty)),
          chip("Einheit", unit),
        ].filter(Boolean) as { label: string; value: string }[],
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
        ].filter(Boolean) as { label: string; value: string }[],
        pinRequired,
      };
    }
    case "stock_set": {
      const qty = num(action, "qty", 0);
      return {
        kind: "Lager",
        sentence: `Bestand von ${product} auf ${qty} ${unit} setzen.`,
        chips: [
          chip("Haus", house),
          chip("Menge", String(qty)),
          chip("Einheit", unit),
        ].filter(Boolean) as { label: string; value: string }[],
        pinRequired,
      };
    }
    case "schedule_add": {
      const date = str(action, "date");
      const block = BLOCK_LABELS[str(action, "block", "morning")] || str(action, "block", "morning");
      const activity = str(action, "activity", "Betreuung");
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
        ].filter(Boolean) as { label: string; value: string }[],
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
        chips: [
          chip("Empfänger", audience),
          chip("Betreff", subject),
          preview ? chip("Nachricht", preview) : null,
        ].filter(Boolean) as { label: string; value: string }[],
        pinRequired: true,
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
