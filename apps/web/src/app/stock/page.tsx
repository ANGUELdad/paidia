"use client";

import { useEffect, useMemo, useState } from "react";
import { Dock } from "@/components/Dock";
import { GuidedTour } from "@/components/GuidedTour";
import { PageShell } from "@/components/PageShell";
import { api } from "@/lib/api";
import { getStoredLang, t, type Lang } from "@/lib/i18n";
import { useRequireMode } from "@/lib/session";

type Product = { id: string; name: { de: string }; unit: string; parLevel?: number };
type House = { id: string; name: string };

const DEFAULT_PAR = 2;

export default function StockPage() {
  const { ready } = useRequireMode("staff");
  const [lang, setLang] = useState<Lang>("de");
  const [houses, setHouses] = useState<House[]>([]);
  const [products, setProducts] = useState<Product[]>([]);
  const [stock, setStock] = useState<Record<string, number>>({});
  const [houseId, setHouseId] = useState("h1");
  const [filter, setFilter] = useState<"all" | "low">("all");
  const [msg, setMsg] = useState("");
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");

  async function load() {
    setError("");
    try {
      const data = await api<{ houses: House[]; products: Product[]; stock: Record<string, number> }>("/api/stock/snapshot");
      setHouses(data.houses);
      setProducts(data.products);
      setStock(data.stock);
    } catch (e) {
      setError((e as Error).message || "Lager konnte nicht geladen werden");
    }
  }

  useEffect(() => {
    if (!ready) return;
    setLang(getStoredLang());
    load().catch(console.error);
  }, [ready]);

  const rows = useMemo(() => {
    return products
      .map((p) => {
        const qty = Number(stock[`${houseId}:${p.id}`] || 0);
        const par = p.parLevel ?? DEFAULT_PAR;
        return { product: p, qty, par, low: qty <= par };
      })
      .filter((row) => (filter === "low" ? row.low : true));
  }, [products, stock, houseId, filter]);

  const lowItems = useMemo(() => rows.filter((r) => r.low), [rows]);

  async function adjust(productId: string, dir: "IN" | "OUT") {
    await api("/api/stock/adjust", {
      method: "POST",
      body: JSON.stringify({ houseId, productId, dir, qty: 1, reason: dir === "OUT" ? "Verbrauch" : "Lieferung" }),
    });
    await load();
  }

  async function addToList(product: Product, qty?: number) {
    const par = product.parLevel ?? DEFAULT_PAR;
    const current = Number(stock[`${houseId}:${product.id}`] || 0);
    const need = qty ?? Math.max(1, par - current);
    setBusy(true);
    try {
      await api("/api/shop/add", {
        method: "POST",
        body: JSON.stringify({
          houseId,
          productId: product.id,
          name: product.name.de,
          qty: need,
          unit: product.unit,
        }),
      });
      setMsg(`${product.name.de} auf die Liste`);
    } finally {
      setBusy(false);
    }
  }

  async function reorderAll() {
    if (!lowItems.length) return;
    setBusy(true);
    try {
      await api("/api/shop/reorder-apply", {
        method: "POST",
        body: JSON.stringify({
          items: lowItems.map(({ product, qty, par }) => ({
            houseId,
            productId: product.id,
            name: product.name.de,
            qty: Math.max(1, par - qty),
            unit: product.unit,
          })),
        }),
      });
      setMsg(`${lowItems.length} Artikel auf die Liste`);
    } finally {
      setBusy(false);
    }
  }

  async function signOff() {
    const today = new Date().toISOString().slice(0, 10);
    const counts: Record<string, number> = {};
    products.forEach((p) => {
      counts[p.id] = Number(stock[`${houseId}:${p.id}`] || 0);
    });
    await api("/api/stock/check", {
      method: "POST",
      body: JSON.stringify({ houseId, date: today, notes: "Lager-Check", counts }),
    });
    setMsg("Lager-Check gespeichert");
  }

  if (!ready) return <main className="page">Laden…</main>;

  return (
    <>
      <PageShell eyebrow="Lager" title="Lager" lead="Dichte Bestandsliste — Check unten sticky.">
        <div data-tour="tour-stock">
          <div className="seg-bar" aria-label="Häuser">
            {houses.map((h) => (
              <button
                key={h.id}
                type="button"
                className={`btn-sec ${houseId === h.id ? "ring-2 ring-[var(--brand)]" : ""}`}
                onClick={() => setHouseId(h.id)}
              >
                {h.name}
              </button>
            ))}
          </div>
          <div className="seg-bar">
            <button type="button" className={`btn-sec ${filter === "all" ? "ring-2 ring-[var(--brand)]" : ""}`} onClick={() => setFilter("all")}>
              Alle
            </button>
            <button type="button" className={`btn-sec ${filter === "low" ? "ring-2 ring-[var(--brand)]" : ""}`} onClick={() => setFilter("low")}>
              Niedrig ({lowItems.length})
            </button>
          </div>
          {error && <p className="warn">{error}</p>}
          {msg && <p className="muted text-sm">{msg}</p>}

          <div className="list-panel">
            <div className="list-sticky">
              <span>Artikel</span>
              <span>Menge</span>
            </div>
            {rows.map(({ product: p, qty, par, low }) => (
              <div key={p.id} className={`list-row ${low ? "is-warn" : ""}`}>
                <div className="list-row__main">
                  <div className="list-row__title">{p.name.de}</div>
                  <div className="list-row__meta">
                    Ziel {par} {p.unit}
                    {low ? " · nachbestellen" : ""}
                  </div>
                </div>
                <div className="list-row__trail">
                  {low && (
                    <button
                      className="btn-sec"
                      type="button"
                      style={{ minHeight: 44, padding: "0 10px", fontSize: "0.8rem" }}
                      disabled={busy}
                      onClick={() => addToList(p)}
                      aria-label={`${p.name.de} zur Liste`}
                    >
                      Liste
                    </button>
                  )}
                  <button className="btn-sec" type="button" style={{ minWidth: 44 }} aria-label="Abgang" onClick={() => adjust(p.id, "OUT")}>
                    −
                  </button>
                  <span className="list-row__qty">
                    {qty}
                    <span className="muted text-xs"> {p.unit}</span>
                  </span>
                  <button className="btn" type="button" style={{ minWidth: 44 }} aria-label="Zugang" onClick={() => adjust(p.id, "IN")}>
                    ＋
                  </button>
                </div>
              </div>
            ))}
            {!rows.length && (
              <div className="list-row">
                <div className="list-row__meta">Keine Artikel in diesem Filter.</div>
              </div>
            )}
          </div>

          <div className="sticky-footer">
            {lowItems.length > 0 && (
              <button className="btn-sec flex-1" type="button" disabled={busy} onClick={reorderAll}>
                {t("reorderAll", lang)}
              </button>
            )}
            <button className="btn flex-1" type="button" onClick={signOff}>
              Check abschließen
            </button>
          </div>
        </div>
      </PageShell>
      <Dock />
      <GuidedTour />
    </>
  );
}
