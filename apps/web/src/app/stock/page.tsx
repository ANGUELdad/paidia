"use client";

import { useEffect, useState } from "react";
import { Dock } from "@/components/Dock";
import { GuidedTour } from "@/components/GuidedTour";
import { api } from "@/lib/api";
import { useRequireMode } from "@/lib/session";

type Product = { id: string; name: { de: string }; unit: string };
type House = { id: string; name: string };

export default function StockPage() {
  const { ready } = useRequireMode("staff");
  const [houses, setHouses] = useState<House[]>([]);
  const [products, setProducts] = useState<Product[]>([]);
  const [stock, setStock] = useState<Record<string, number>>({});
  const [houseId, setHouseId] = useState("h1");
  const [msg, setMsg] = useState("");

  async function load() {
    const data = await api<{ houses: House[]; products: Product[]; stock: Record<string, number> }>("/api/stock/snapshot");
    setHouses(data.houses);
    setProducts(data.products);
    setStock(data.stock);
  }

  useEffect(() => {
    if (!ready) return;
    load().catch(console.error);
  }, [ready]);

  async function adjust(productId: string, dir: "IN" | "OUT") {
    await api("/api/stock/adjust", {
      method: "POST",
      body: JSON.stringify({ houseId, productId, dir, qty: 1, reason: dir === "OUT" ? "Verbrauch" : "Lieferung" }),
    });
    await load();
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
    <main className="page-pad mx-auto max-w-3xl px-4 pt-6">
      <h1 className="text-3xl">Lager</h1>
      <p className="text-sm text-[var(--muted)]">Bestand führen — Admins: Check mit Sign-off.</p>
      <div className="mt-4 flex gap-2">
        {houses.map((h) => (
          <button key={h.id} type="button" className={`btn-sec !min-h-10 ${houseId === h.id ? "ring-2 ring-[var(--brand)]" : ""}`} onClick={() => setHouseId(h.id)}>{h.name}</button>
        ))}
      </div>
      <div className="mt-4 grid gap-2">
        {products.map((p) => {
          const qty = Number(stock[`${houseId}:${p.id}`] || 0);
          const low = qty <= 2;
          return (
            <div key={p.id} className={`card flex items-center justify-between ${low ? "border-[var(--sun)]" : ""}`}>
              <div>
                <div className="font-semibold">{p.name.de}</div>
                <div className="text-sm text-[var(--muted)]">{qty} {p.unit}{low ? " · niedrig" : ""}</div>
              </div>
              <div className="flex gap-2">
                <button className="btn-sec !min-h-10 !px-3" type="button" onClick={() => adjust(p.id, "OUT")}>−</button>
                <button className="btn !min-h-10 !px-3" type="button" onClick={() => adjust(p.id, "IN")}>＋</button>
              </div>
            </div>
          );
        })}
      </div>
      <button className="btn mt-4 w-full" type="button" onClick={signOff}>Lager-Check abschließen</button>
      {msg && <p className="mt-2 text-sm text-[var(--brand)]">{msg}</p>}
      <Dock />
      <GuidedTour />
    </main>
  );
}
