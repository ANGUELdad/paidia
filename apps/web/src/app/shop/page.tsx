"use client";

import { useEffect, useState } from "react";
import { Dock } from "@/components/Dock";
import { api } from "@/lib/api";
import { useRequireMode } from "@/lib/session";

export default function ShopPage() {
  const { ready } = useRequireMode("staff");
  const [entries, setEntries] = useState<Array<{ id: string; name: string; qty: number; unit: string }>>([]);
  const [name, setName] = useState("");
  const [suggestions, setSuggestions] = useState<Array<{ key: string; score: number }>>([]);

  async function load() {
    const data = await api<{ entries: typeof entries }>("/api/shop/list");
    setEntries(data.entries || []);
    const s = await api<{ suggestions: typeof suggestions }>("/api/shop/suggestions");
    setSuggestions(s.suggestions || []);
  }

  useEffect(() => {
    if (!ready) return;
    load().catch(console.error);
  }, [ready]);

  async function add(n?: string) {
    const value = (n || name).trim();
    if (!value) return;
    await api("/api/shop/add", { method: "POST", body: JSON.stringify({ name: value, qty: 1, houseId: "h1" }) });
    setName("");
    await load();
  }

  async function done(id: string) {
    await api("/api/shop/done", { method: "POST", body: JSON.stringify({ entryId: id }) });
    await load();
  }

  if (!ready) return <main className="page">Laden…</main>;

  return (
    <main className="page-pad mx-auto max-w-3xl px-4 pt-6">
      <h1 className="text-3xl">Einkaufsliste</h1>
      <p className="text-sm text-[var(--muted)]">Vorschläge aus bisherigen Daten — immer bestätigen.</p>
      {suggestions.length > 0 && (
        <div className="mt-3 flex flex-wrap gap-2">
          {suggestions.map((s) => (
            <button key={s.key} type="button" className="btn-sec !min-h-9 text-sm" onClick={() => add(s.key)}>＋ {s.key}</button>
          ))}
        </div>
      )}
      <div className="card mt-4 flex gap-2">
        <input className="flex-1 rounded-xl border border-[var(--line)] px-3 py-2" value={name} onChange={(e) => setName(e.target.value)} placeholder="z.B. Reis" />
        <button className="btn" type="button" onClick={() => add()}>Add</button>
      </div>
      <div className="mt-4 grid gap-2">
        {entries.map((e) => (
          <div key={e.id} className="card flex items-center justify-between gap-3">
            <span className="font-semibold">{e.name}</span>
            <div className="flex items-center gap-2">
              <span className="text-sm text-[var(--muted)]">{e.qty} {e.unit}</span>
              <button className="btn-sec !min-h-9 text-sm" type="button" onClick={() => done(e.id)}>Erledigt</button>
            </div>
          </div>
        ))}
        {!entries.length && <div className="card text-sm text-[var(--muted)]">Liste leer — starte mit einem Vorschlag.</div>}
      </div>
      <Dock />
    </main>
  );
}
