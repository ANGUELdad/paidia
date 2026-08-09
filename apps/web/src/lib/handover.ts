import { api } from "@/lib/api";

export type RibbonItem = {
  id: string;
  kind: "presence" | "plan" | "stock" | "shop" | "journal" | "notify";
  title: string;
  body: string;
  tone?: "ok" | "warn" | "muted";
  href?: string;
};

type Session = { profileId?: string; name?: string; nickname?: string };

type Presence = { pending?: boolean; checkin?: { status?: string; reason?: string } | null };
type ScheduleDay = {
  entries: Array<{ activity?: string; from?: string; to?: string; cancelled?: boolean }>;
  events?: Array<{ title?: string }>;
};
type StockSnap = {
  products: Array<{ id: string; name: { de: string }; unit: string }>;
  stock: Record<string, number>;
};
type ShopList = { entries: Array<{ name?: string; qty?: number; unit?: string }> };
type Journal = { note?: { text?: string }; due?: boolean };
type NotifyEval = { due: Array<{ kind: string; title: string; body: string; url?: string }> };

export type HandoverData = {
  presence: Presence;
  schedule: ScheduleDay;
  stock: StockSnap;
  shop: ShopList;
  journal: Journal;
  notify: NotifyEval;
};

export async function fetchHandoverData(today: string, profileId: string): Promise<HandoverData> {
  const [presence, schedule, stock, shop, journal, notify] = await Promise.all([
    api<Presence>("/api/presence/active"),
    api<ScheduleDay>(`/api/schedule/day/${today}`),
    api<StockSnap>("/api/stock/snapshot"),
    api<ShopList>("/api/shop/list"),
    api<Journal>(`/api/book/journal/${profileId}?date=${today}`),
    api<NotifyEval>("/api/notify/evaluate"),
  ]);
  return { presence, schedule, stock, shop, journal, notify };
}

export function buildRibbon(data: HandoverData): RibbonItem[] {
  const items: RibbonItem[] = [];

  const { presence, schedule, stock, shop, journal, notify } = data;

  if (presence.pending) {
    items.push({
      id: "presence-pending",
      kind: "presence",
      title: "Präsenz",
      body: "Noch nicht eingecheckt — „Schicht starten“ auf Home.",
      tone: "warn",
      href: "/home",
    });
  } else if (presence.checkin) {
    const late = presence.checkin.status === "late";
    const reason = presence.checkin.reason?.trim();
    items.push({
      id: "presence-ok",
      kind: "presence",
      title: late ? "Präsenz · verspätet" : "Präsenz · da",
      body: reason ? `Grund: ${reason}` : late ? "Verspätung gemeldet." : "Check-in erledigt.",
      tone: late ? "warn" : "ok",
      href: "/home",
    });
  }

  const planEntries = (schedule.entries || []).filter((e) => !e.cancelled);
  if (planEntries.length) {
    items.push({
      id: "plan",
      kind: "plan",
      title: `Plan · ${planEntries.length} Block${planEntries.length > 1 ? "e" : ""}`,
      body: planEntries
        .slice(0, 4)
        .map((e) => `${e.activity || "Betreuung"} ${e.from || ""}–${e.to || ""}`.trim())
        .join(" · "),
      href: "/plan",
    });
  } else {
    items.push({
      id: "plan-empty",
      kind: "plan",
      title: "Plan",
      body: "Keine Einträge für heute.",
      tone: "muted",
      href: "/plan",
    });
  }

  const low: string[] = [];
  for (const p of stock.products || []) {
    const qty = Object.entries(stock.stock || {})
      .filter(([k]) => k.endsWith(`:${p.id}`))
      .reduce((sum, [, v]) => sum + Number(v || 0), 0);
    if (qty <= 2) low.push(`${p.name.de} (${qty} ${p.unit})`);
  }
  items.push({
    id: "stock",
    kind: "stock",
    title: low.length ? `Lager · ${low.length} niedrig` : "Lager",
    body: low.length ? low.slice(0, 5).join(" · ") : "Bestand in Ordnung.",
    tone: low.length ? "warn" : "ok",
    href: "/stock",
  });

  const open = shop.entries || [];
  items.push({
    id: "shop",
    kind: "shop",
    title: open.length ? `Liste · ${open.length} offen` : "Liste",
    body: open.length
      ? open
          .slice(0, 5)
          .map((e) => `${e.qty || 1}× ${e.name || "Artikel"}`)
          .join(" · ")
      : "Keine offenen Positionen.",
    tone: open.length ? "warn" : "ok",
    href: "/shop",
  });

  const noteText = (journal.note?.text || "").trim();
  const snippet = noteText
    ? noteText.split("\n").slice(-2).join(" ").slice(0, 140) + (noteText.length > 140 ? "…" : "")
    : "";
  items.push({
    id: "journal",
    kind: "journal",
    title: journal.due ? "Schichtbuch · fehlt" : "Schichtbuch",
    body: snippet || (journal.due ? "Heute noch nichts geschrieben." : "Einträge vorhanden."),
    tone: journal.due ? "warn" : noteText ? "ok" : "muted",
    href: "/book",
  });

  for (const d of notify.due || []) {
    if (["shift_start", "journal_due", "low_stock", "friday_list"].includes(d.kind)) continue;
    items.push({
      id: `notify-${d.kind}`,
      kind: "notify",
      title: d.title,
      body: d.body,
      tone: "warn",
      href: d.url,
    });
  }

  return items;
}

export function buildHandoverSummary(
  today: string,
  name: string,
  ribbon: RibbonItem[],
  extra = "",
): string {
  const stamp = new Date().toLocaleTimeString("de-DE", { hour: "2-digit", minute: "2-digit" });
  const lines = [`Übergabe ${today} ${stamp} — ${name}`];
  for (const r of ribbon) {
    lines.push(`• ${r.title}: ${r.body}`);
  }
  if (extra.trim()) lines.push(`• Notiz: ${extra.trim()}`);
  return lines.join("\n");
}

export async function loadHandoverSession() {
  return api<Session>("/api/auth/session");
}

export async function completeHandover(today: string, summary: string) {
  await api("/api/book/journal", {
    method: "POST",
    body: JSON.stringify({ date: today, text: summary, mode: "append" }),
  });
  await api("/api/talk/message", {
    method: "POST",
    body: JSON.stringify({ text: summary.slice(0, 500), topic: "handover" }),
  }).catch(() => undefined);
}
