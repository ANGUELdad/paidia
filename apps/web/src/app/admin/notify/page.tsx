"use client";

import { FormEvent, useEffect, useState } from "react";
import { Dock } from "@/components/Dock";
import { api } from "@/lib/api";

type Rule = {
  id: string;
  type?: string;
  kind?: string;
  enabled: boolean;
  schedule?: string;
  label?: string;
};

const CATALOG = [
  "shift_start",
  "presence_late",
  "low_stock",
  "friday_list",
  "journal_due",
  "event_publish",
  "meeting_notes_due",
  "broadcast",
  "child_event",
];

export default function AdminNotifyPage() {
  const [rules, setRules] = useState<Rule[]>([]);
  const [due, setDue] = useState<unknown[]>([]);
  const [subject, setSubject] = useState("");
  const [body, setBody] = useState("");
  const [audience, setAudience] = useState("staff");
  const [status, setStatus] = useState("");

  async function load() {
    const r = await api<{ rules: Rule[] }>("/api/notify/rules");
    setRules(r.rules || []);
  }

  useEffect(() => {
    load().catch(() => {
      window.location.href = "/";
    });
  }, []);

  async function toggle(rule: Rule) {
    await api(`/api/notify/rules/${rule.id}`, {
      method: "PATCH",
      body: JSON.stringify({ enabled: !rule.enabled }),
    });
    await load();
  }

  async function evaluate() {
    const r = await api<{ due: unknown[] }>("/api/notify/evaluate", { method: "POST" });
    setDue(r.due || []);
  }

  async function subscribePush() {
    if (!("serviceWorker" in navigator) || !("PushManager" in window)) {
      setStatus("Push not supported");
      return;
    }
    const reg = await navigator.serviceWorker.register("/sw.js");
    const key = process.env.NEXT_PUBLIC_VAPID_PUBLIC_KEY;
    if (!key) {
      setStatus("Set NEXT_PUBLIC_VAPID_PUBLIC_KEY to enable push subscribe");
      return;
    }
    const sub = await reg.pushManager
      .subscribe({
        userVisibleOnly: true,
        applicationServerKey: urlBase64ToUint8Array(key),
      })
      .catch(() => null);
    if (!sub) {
      setStatus("Subscribe failed (need valid VAPID)");
      return;
    }
    await api("/api/notify/subscribe", {
      method: "POST",
      body: JSON.stringify({ subscription: sub.toJSON() }),
    });
    setStatus("Push subscribed");
  }

  async function broadcast(e: FormEvent) {
    e.preventDefault();
    const aud = audience === "everyone" ? "all" : audience;
    const r = await api<{ ok: boolean; preview?: string }>("/api/notify/broadcast", {
      method: "POST",
      body: JSON.stringify({ subject, message: body, body, audience: aud, channels: ["email", "push", "banner"] }),
    });
    setStatus(r.ok ? r.preview || "Broadcast queued" : "Failed");
  }

  return (
    <main className="page">
      <header className="top">
        <div>
          <p className="eyebrow">Admin</p>
          <h1>Automationen</h1>
        </div>
      </header>
      <section className="panel stack">
        <h2>Reminder catalog</h2>
        <ul className="catalog">
          {CATALOG.map((c) => (
            <li key={c}>{c}</li>
          ))}
        </ul>
        {rules.map((rule) => (
          <div key={rule.id} className="row between">
            <span>
              {rule.label || rule.type || rule.kind} · {rule.enabled ? "on" : "off"}
            </span>
            <button className="btn ghost" type="button" onClick={() => toggle(rule)}>
              Toggle
            </button>
          </div>
        ))}
        <div className="row">
          <button className="btn" type="button" onClick={evaluate}>
            Evaluate now
          </button>
          <button className="btn ghost" type="button" onClick={subscribePush}>
            Enable Web Push
          </button>
        </div>
        {due.length > 0 && <pre className="pre">{JSON.stringify(due, null, 2)}</pre>}
        {status && <p>{status}</p>}
      </section>
      <section className="panel stack">
        <h2>Email / push broadcast</h2>
        <form className="stack" onSubmit={broadcast}>
          <select value={audience} onChange={(e) => setAudience(e.target.value)}>
            <option value="everyone">Everyone</option>
            <option value="staff">Staff</option>
            <option value="children">Children</option>
          </select>
          <input value={subject} onChange={(e) => setSubject(e.target.value)} placeholder="Subject" />
          <textarea value={body} onChange={(e) => setBody(e.target.value)} rows={4} placeholder="Body" />
          <button className="btn" type="submit">
            Send
          </button>
        </form>
      </section>
      <Dock />
    </main>
  );
}

function urlBase64ToUint8Array(base64String: string) {
  const padding = "=".repeat((4 - (base64String.length % 4)) % 4);
  const base64 = (base64String + padding).replace(/-/g, "+").replace(/_/g, "/");
  const raw = atob(base64);
  const out = new Uint8Array(raw.length);
  for (let i = 0; i < raw.length; ++i) out[i] = raw.charCodeAt(i);
  return out;
}
