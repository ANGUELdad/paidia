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
  const [msg, setMsg] = useState("");
  const [busy, setBusy] = useState(false);

  async function load() {
    const data = await api<{ houses: House[]; products: Product[]; stock: Record<string, number> }>("/api/stock/snapshot");
    setHouses(data.houses);
    setProducts(data.products);
    setStock(data.stock);
  }

  useEffect(() => {
    if (!ready) return;
    setLang(getStoredLang());
    load().catch(console.error);
  }, [ready]);

  const lowItems = useMemo(() => {
    return products
      .map((p) => {
        const qty = Number(stock[`${houseId}:${p.id}`] || 0);
        const par = p.parLevel ?? DEFAULT_PAR;
        return { product: p, qty, par, low: qty <= par };
      })
      .filter((row) => row.low);
  }, [products, stock, houseId]);

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
      setMsg(`${product.name.de} auf die Liste ✓`);
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
      setMsg(`${lowItems.length} Artikel auf die Liste ✓`);
    } finally {
      setBusy(false);
    }
  }

  async function signOff() {
    const today = new Date().toISOString().slice(0, 10);
    const counts: Record<string, number> = {};
    products.forEach((p) => { counts[p.id] = Number(stock[`${houseId}:${p.id}`] || 0); });
    await api("/api/stock/check", {
      method: "POST",
      body: JSON.stringify({ houseId, date: today, notes: "Admin storage keeping", counts }),
    });
    setMsg("Lager-Check gespeichert ✓");
  }

  if (!ready) return <main className="page">Laden…</main>;

  return (
    <>
      <PageShell eyebrow="Lager" title="Lager" lead="Bestand führen — Admins: Check mit Sign-off.">
      <div data-tour="tour-stock">
      <div className="flex gap-2">
        {houses.map((h) => (
          <button key={h.id} type="button" className={`btn-sec !min-h-10 ${houseId === h.id ? "ring-2 ring-[var(--brand)]" : ""}`} onClick={() => setHouseId(h.id)}>{h.name}</button>
        ))}
      </div>
      {lowItems.length > 0 && (
        <button className="btn mt-4 w-full" type="button" disabled={busy} onClick={reorderAll}>
          {t("reorderAll", lang)}
        </button>
      )}
      <div className="mt-4 grid gap-2">
        {products.map((p) => {
          const qty = Number(stock[`${houseId}:${p.id}`] || 0);
          const par = p.parLevel ?? DEFAULT_PAR;
          const low = qty <= par;
          return (
            <div key={p.id} className={`card flex items-center justify-between gap-2 ${low ? "border-[var(--sun)]" : ""}`}>
              <div className="min-w-0 flex-1">
                <div className="font-semibold">{p.name.de}</div>
                <div className="text-sm text-[var(--muted)]">{qty} {p.unit}{low ? " · niedrig" : ""}</div>
              </div>
              <div className="flex shrink-0 items-center gap-2">
                {low && (
                  <button className="btn-sec !min-h-9 text-sm" type="button" disabled={busy} onClick={() => addToList(p)}>
                    {t("toList", lang)}
                  </button>
                )}
                <button className="btn-sec !min-h-10 !px-3" type="button" onClick={() => adjust(p.id, "OUT")}>−</button>
                <button className="btn !min-h-10 !px-3" type="button" onClick={() => adjust(p.id, "IN")}>＋</button>
              </div>
            </div>
          );
        })}
      </div>
      <button className="btn mt-4 w-full" type="button" onClick={signOff}>Lager-Check abschließen</button>
      {msg && <p className="mt-2 text-sm text-[var(--brand)]">{msg}</p>}
      </div>
      </PageShell>
      <Dock />
      <GuidedTour />
    </>
  );
}
