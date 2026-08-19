"use client";

import { useEffect, useState } from "react";
import { Dock } from "@/components/Dock";
import { EmptyState } from "@/components/EmptyState";
import { GuidedTour } from "@/components/GuidedTour";
import { PageShell } from "@/components/PageShell";
import { api } from "@/lib/api";
import { getStoredLang, t, type Lang } from "@/lib/i18n";
import { useRequireMode } from "@/lib/session";

type Tab = "list" | "friday" | "supermarket" | "suggestions";

type ListEntry = {
  id: string;
  name: string;
  qty: number;
  unit: string;
  status?: string;
  fridayDate?: string;
  houseId?: string;
};

type ReorderItem = {
  houseId: string;
  houseName?: string;
  productId: string;
  name: string;
  qty: number;
  unit: string;
  stockQty?: number;
  parLevel?: number;
};

type OcrItem = { name: string; qty: number; unit: string };

const TABS: { id: Tab; label: string }[] = [
  { id: "list", label: "Liste" },
  { id: "friday", label: "Freitag" },
  { id: "supermarket", label: "Im Supermarkt" },
  { id: "suggestions", label: "Vorschläge" },
];

export default function ShopPage() {
  const { ready } = useRequireMode("staff");
  const [lang, setLang] = useState<Lang>("de");
  const [tab, setTab] = useState<Tab>("list");
  const [entries, setEntries] = useState<ListEntry[]>([]);
  const [fridayDate, setFridayDate] = useState("");
  const [reorderItems, setReorderItems] = useState<ReorderItem[]>([]);
  const [suggestions, setSuggestions] = useState<Array<{ key: string; score: number; houseId?: string }>>([]);
  const [name, setName] = useState("");
  const [ocrText, setOcrText] = useState("");
  const [ocrDraft, setOcrDraft] = useState<OcrItem[]>([]);
  const [busy, setBusy] = useState(false);
  const [supermarketMode, setSupermarketMode] = useState(false);

  async function loadList() {
    const data = await api<{ entries: ListEntry[] }>("/api/shop/list");
    setEntries(data.entries || []);
    const s = await api<{ suggestions: typeof suggestions }>("/api/shop/suggestions");
    setSuggestions(s.suggestions || []);
  }

  async function loadFriday() {
    const data = await api<{ entries: ListEntry[]; fridayDate: string }>("/api/shop/friday");
    setEntries(data.entries || []);
    setFridayDate(data.fridayDate || "");
  }

  async function loadSupermarket() {
    const data = await api<{ entries: ListEntry[]; supermarketMode: boolean }>("/api/shop/supermarket");
    setEntries(data.entries || []);
    setSupermarketMode(Boolean(data.supermarketMode));
  }

  async function loadSuggestions() {
    const data = await api<{ items: ReorderItem[] }>("/api/shop/reorder-suggestions");
    setReorderItems(data.items || []);
  }

  async function load() {
    if (tab === "friday") await loadFriday();
    else if (tab === "supermarket") await loadSupermarket();
    else if (tab === "suggestions") await loadSuggestions();
    else await loadList();
  }

  useEffect(() => {
    if (!ready) return;
    setLang(getStoredLang());
    load().catch(console.error);
  }, [ready, tab]);

  async function add(n?: string, friday = false) {
    const value = (n || name).trim();
    if (!value) return;
    const path = friday ? "/api/shop/friday/add" : "/api/shop/add";
    await api(path, { method: "POST", body: JSON.stringify({ name: value, qty: 1, houseId: "h1" }) });
    setName("");
    await load();
  }

  async function done(id: string) {
    await api("/api/shop/done", { method: "POST", body: JSON.stringify({ entryId: id }) });
    await load();
  }

  async function setStatus(id: string, status: "open" | "bought" | "missing") {
    await api("/api/shop/status", { method: "POST", body: JSON.stringify({ entryId: id, status }) });
    await load();
  }

  async function toggleSupermarketMode() {
    const next = !supermarketMode;
    await api("/api/shop/supermarket/mode", {
      method: "POST",
      body: JSON.stringify({ enabled: next }),
    });
    setSupermarketMode(next);
  }

  async function parseOcr() {
    const data = await api<{ items: OcrItem[] }>("/api/shop/ocr", {
      method: "POST",
      body: JSON.stringify({ text: ocrText }),
    });
    setOcrDraft(data.items || []);
  }

  async function applyOcr() {
    if (!ocrDraft.length) return;
    setBusy(true);
    try {
      await api("/api/shop/reorder-apply", {
        method: "POST",
        body: JSON.stringify({
          items: ocrDraft.map((item) => ({
            houseId: "h1",
            name: item.name,
            qty: item.qty,
            unit: item.unit,
          })),
        }),
      });
      setOcrText("");
      setOcrDraft([]);
      setTab("list");
    } finally {
      setBusy(false);
    }
  }

  async function applyReorder(item: ReorderItem) {
    setBusy(true);
    try {
      await api("/api/shop/reorder-apply", {
        method: "POST",
        body: JSON.stringify({ items: [item] }),
      });
      await loadSuggestions();
    } finally {
      setBusy(false);
    }
  }

  async function applyAllReorder() {
    if (!reorderItems.length) return;
    setBusy(true);
    try {
      await api("/api/shop/reorder-apply", {
        method: "POST",
        body: JSON.stringify({ items: reorderItems }),
      });
      await loadSuggestions();
    } finally {
      setBusy(false);
    }
  }

  if (!ready) return <main className="page">Laden…</main>;

  return (
    <>
      <PageShell eyebrow="Liste" title="Einkaufsliste" lead="Vorschläge aus Bestand und Vergangenheit — immer bestätigen." back="/home">
      <div data-tour="tour-shop">
      <div className="seg-bar" role="tablist" aria-label="Listen">
        {TABS.map((tdef) => (
          <button
            key={tdef.id}
            type="button"
            role="tab"
            aria-selected={tab === tdef.id}
            className={`btn-sec ${tab === tdef.id ? "ring-2 ring-[var(--brand)]" : ""}`}
            onClick={() => setTab(tdef.id)}
          >
            {tdef.label}
          </button>
        ))}
      </div>

      {tab === "list" && suggestions.length > 0 && (
        <div className="mt-3 flex flex-wrap gap-2">
          {suggestions.map((s) => (
            <button key={s.key} type="button" className="btn-sec !min-h-9 text-sm" onClick={() => add(s.key)}>
              ＋ {s.key}
            </button>
          ))}
        </div>
      )}

      {tab !== "suggestions" && tab !== "supermarket" && (
        <div className="list-panel mt-3">
          <div className="list-row" style={{ cursor: "default", flexWrap: "wrap", gap: 8 }}>
            <input
              className="min-h-11 min-w-0 flex-1 rounded-[var(--radius-sm)] border border-[var(--line)] px-3"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="z.B. Reis"
              aria-label="Artikel"
              onKeyDown={(e) => {
                if (e.key === "Enter") add(undefined, tab === "friday");
              }}
            />
            <button className="btn" type="button" onClick={() => add(undefined, tab === "friday")}>
              {t("add", lang)}
            </button>
          </div>
        </div>
      )}

      {tab === "supermarket" && (
        <div className="list-panel mt-3">
          <div className="list-sticky">
            <span>{t("supermarket", lang)}</span>
            <button className="btn-sec" type="button" style={{ minHeight: 36, fontSize: "0.75rem" }} onClick={toggleSupermarketMode} data-testid="supermarket-mode">
              {supermarketMode ? "Modus an" : "Modus aus"}
            </button>
          </div>
          <div className="list-row" style={{ cursor: "default" }}>
            <div className="list-row__meta">Gekauft / fehlt markieren — dann erledigen.</div>
          </div>
        </div>
      )}

      {tab === "list" && (
        <details className="list-panel mt-3">
          <summary className="list-sticky cursor-pointer">Text importieren</summary>
          <div className="stack p-3">
            <p className="muted m-0 text-sm">Zeilen wie „Milch 2“ oder „2 kg Reis“ — erst prüfen, dann bestätigen.</p>
            <textarea
              className="w-full rounded-[var(--radius-sm)] border border-[var(--line)] px-3 py-2"
              rows={4}
              value={ocrText}
              onChange={(e) => setOcrText(e.target.value)}
              placeholder={"Milch 2\nReis 1 kg\n3 Eier"}
            />
            <div className="row gap-2">
              <button className="btn-sec" type="button" onClick={parseOcr}>
                Analysieren
              </button>
              {ocrDraft.length > 0 && (
                <button className="btn" type="button" disabled={busy} onClick={applyOcr}>
                  {t("confirm", lang)} ({ocrDraft.length})
                </button>
              )}
            </div>
            {ocrDraft.length > 0 && (
              <ul className="m-0 space-y-1 text-sm">
                {ocrDraft.map((item, i) => (
                  <li key={`${item.name}-${i}`}>
                    {item.qty} {item.unit} — {item.name}
                  </li>
                ))}
              </ul>
            )}
          </div>
        </details>
      )}

      {tab === "friday" && fridayDate && (
        <p className="muted mt-3 text-sm">Freitag: {fridayDate}</p>
      )}

      {tab === "suggestions" && reorderItems.length > 0 && (
        <button className="btn mt-4 w-full" type="button" disabled={busy} onClick={applyAllReorder}>
          {t("reorderAll", lang)}
        </button>
      )}

      <div className="list-panel mt-3">
        {tab === "suggestions" ? (
          reorderItems.length ? (
            reorderItems.map((item) => (
              <div key={`${item.houseId}:${item.productId}`} className="list-row is-warn">
                <div className="list-row__main">
                  <div className="list-row__title">{item.name}</div>
                  <div className="list-row__meta">
                    {item.houseName || item.houseId} · Bestand {item.stockQty ?? 0} · Ziel {item.parLevel ?? 2}
                  </div>
                </div>
                <div className="list-row__trail">
                  <span className="list-row__qty">{item.qty}</span>
                  <button className="btn-sec" type="button" disabled={busy} onClick={() => applyReorder(item)}>
                    {t("toList", lang)}
                  </button>
                </div>
              </div>
            ))
          ) : (
            <div className="list-row">
              <div className="list-row__meta">Keine Vorschläge — Bestand ok.</div>
            </div>
          )
        ) : entries.length ? (
          entries.map((e) => (
            <div key={e.id} className={`list-row ${e.status === "missing" ? "is-gap" : e.status === "bought" ? "is-warn" : ""}`}>
              <div className="list-row__main">
                <div className="list-row__title">{e.name}</div>
                <div className="list-row__meta">
                  {e.qty} {e.unit}
                  {e.status && e.status !== "open"
                    ? ` · ${e.status === "bought" ? t("bought", lang) : e.status === "missing" ? t("missing", lang) : e.status}`
                    : ""}
                </div>
              </div>
              <div className="list-row__trail">
                {tab === "supermarket" ? (
                  <>
                    <button className={`btn-sec ${e.status === "bought" ? "ring-2 ring-[var(--brand)]" : ""}`} type="button" onClick={() => setStatus(e.id, "bought")}>{t("bought", lang)}</button>
                    <button className={`btn-sec ${e.status === "missing" ? "ring-2 ring-[var(--brand)]" : ""}`} type="button" onClick={() => setStatus(e.id, "missing")}>{t("missing", lang)}</button>
                    <button className="btn-sec" type="button" onClick={() => done(e.id)}>Fertig</button>
                  </>
                ) : (
                  <button className="btn-sec" type="button" onClick={() => done(e.id)}>Erledigt</button>
                )}
              </div>
            </div>
          ))
        ) : (
          <EmptyState
            title={tab === "friday" ? "Freitagsliste leer" : tab === "supermarket" ? "Nichts zum Einkaufen" : "Liste leer"}
            hint={tab === "friday" ? "Artikel für den Einkauf am Freitag hinzufügen." : "Starte mit einem Vorschlag oder eigenem Eintrag."}
          />
        )}
      </div>
      </div>
      </PageShell>
      <Dock />
      <GuidedTour />
    </>
  );
}
