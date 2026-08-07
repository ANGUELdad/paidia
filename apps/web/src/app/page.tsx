"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { api } from "@/lib/api";

const BUILD = {
  version: 1,
  label: "v1-platform",
  changed: {
    de: "Neue Plattform · Widgets · Zo-Ai · Automationen · Kids Rewards",
    el: "Νέα πλατφόρμα · Widgets · Zo-Ai · Automations · Kids rewards",
  },
};

type Profile = { id: string; name: string; mode: string; role?: string; color?: string; admin?: boolean };

export default function LoginPage() {
  const router = useRouter();
  const [lang, setLang] = useState<"de" | "el">("de");
  const [mode, setMode] = useState<"pick" | "staff" | "child" | "pin">("pick");
  const [profiles, setProfiles] = useState<Profile[]>([]);
  const [who, setWho] = useState<Profile | null>(null);
  const [pin, setPin] = useState("");
  const [err, setErr] = useState("");
  const [busy, setBusy] = useState(false);

  useEffect(() => {
    api<{ authenticated: boolean; mode?: string }>("/api/auth/session")
      .then((s) => {
        if (s.authenticated) router.replace(s.mode === "child" ? "/kids" : "/home");
      })
      .catch(() => {});
  }, [router]);

  async function loadMode(next: "staff" | "child") {
    setMode(next);
    setErr("");
    const data = await api<{ profiles: Profile[] }>(`/api/auth/profiles?mode=${next}`);
    setProfiles(data.profiles);
  }

  async function login() {
    if (!who || pin.length < 4) return;
    setBusy(true);
    setErr("");
    try {
      const data = await api<{ mode: string }>("/api/auth/login", {
        method: "POST",
        body: JSON.stringify({ profileId: who.id, mode: who.mode, pin }),
      });
      router.replace(data.mode === "child" ? "/kids" : "/home");
    } catch {
      setErr(lang === "el" ? "Λάθος PIN" : "Falsche PIN");
      setPin("");
    } finally {
      setBusy(false);
    }
  }

  const note = BUILD.changed[lang];

  return (
    <main className="mx-auto flex min-h-dvh max-w-md flex-col px-4 pb-10 pt-8">
      <div className="mb-6 flex gap-2 self-end">
        <button className={`btn-sec !min-h-9 !px-3 text-sm ${lang === "de" ? "ring-2 ring-[var(--brand)]" : ""}`} type="button" data-testid="lang-de" onClick={() => setLang("de")}>DE</button>
        <button className={`btn-sec !min-h-9 !px-3 text-sm ${lang === "el" ? "ring-2 ring-[var(--brand)]" : ""}`} type="button" data-testid="lang-el" onClick={() => setLang("el")}>ΕΛ</button>
      </div>

      {mode === "pick" && (
        <section className="card mt-4">
          <div className="text-xs font-bold uppercase tracking-[0.14em] text-[var(--sea)]">Armonia Thassos</div>
          <h1 className="mt-2 text-3xl">{lang === "el" ? "Ποιος/ποια είσαι;" : "Wer bist du?"}</h1>
          <p className="mt-2 text-sm text-[var(--muted)]">{lang === "el" ? "Προσωπικό ή παιδιά" : "Personal oder Kinder"}</p>
          <div className="mt-6 grid gap-3">
            <button className="btn w-full" type="button" data-testid="enter-staff" onClick={() => loadMode("staff")}>{lang === "el" ? "Προσωπικό" : "Personal"}</button>
            <button className="btn-sec w-full" type="button" data-testid="enter-child" onClick={() => loadMode("child")}>{lang === "el" ? "Παιδιά" : "Kinder"}</button>
          </div>
        </section>
      )}

      {(mode === "staff" || mode === "child") && (
        <section className="card mt-4">
          <button className="text-sm text-[var(--sea)]" type="button" onClick={() => setMode("pick")}>← {lang === "el" ? "Πίσω" : "Zurück"}</button>
          <h2 className="mt-3 text-2xl">{mode === "child" ? (lang === "el" ? "Παιδιά" : "Kinder") : (lang === "el" ? "Προσωπικό" : "Personal")}</h2>
          <div className="mt-4 grid grid-cols-2 gap-3">
            {profiles.map((p) => (
              <button
                key={p.id}
                type="button"
                data-testid={`profile-${p.id}`}
                className="rounded-2xl border border-[var(--line)] bg-white/90 p-3 text-left"
                onClick={() => { setWho(p); setMode("pin"); setPin(""); setErr(""); }}
              >
                <div className="mb-2 grid h-10 w-10 place-items-center rounded-full text-sm font-bold text-white" style={{ background: p.color || "#2a6b52" }}>
                  {p.name.slice(0, 2)}
                </div>
                <div className="font-semibold">{p.name}</div>
                <div className="text-xs text-[var(--muted)]">{p.role}</div>
              </button>
            ))}
          </div>
        </section>
      )}

      {mode === "pin" && who && (
        <section className="card mt-4">
          <button className="text-sm text-[var(--sea)]" type="button" onClick={() => setMode(who.mode as "staff" | "child")}>←</button>
          <div className="mt-3 grid h-14 w-14 place-items-center rounded-full text-lg font-bold text-white" style={{ background: who.color || "#2a6b52" }}>{who.name.slice(0, 2)}</div>
          <h2 className="mt-3 text-2xl">{who.name}</h2>
          <p className="text-sm text-[var(--muted)]">{lang === "el" ? "Βάλε PIN" : "PIN eingeben"}</p>
          <input
            className="mt-4 w-full rounded-2xl border border-[var(--line)] bg-white px-4 py-3 text-center text-2xl tracking-[0.4em]"
            inputMode="numeric"
            maxLength={6}
            value={pin}
            data-testid="pin-input"
            onChange={(e) => setPin(e.target.value.replace(/\D/g, "").slice(0, 6))}
            onKeyDown={(e) => e.key === "Enter" && login()}
            autoFocus
          />
          <div className="mt-2 min-h-5 text-sm text-red-600" data-testid="login-error">{err}</div>
          <button className="btn mt-4 w-full" type="button" data-testid="login-submit" disabled={busy || pin.length < 4} onClick={login}>
            {busy ? "…" : lang === "el" ? "Είσοδος" : "Anmelden"}
          </button>
          <p className="mt-3 text-xs text-[var(--muted)]">
            {lang === "el" ? "Μετά: Face ID από Προφίλ" : "Danach: Face ID unter Profil einrichten"}
          </p>
        </section>
      )}

      <div className="mt-auto pt-8 text-center text-xs text-[var(--muted)]">
        <b className="mr-2 uppercase tracking-wider text-[var(--brand)]">{BUILD.label}</b>
        <span>{note}</span>
      </div>
    </main>
  );
}
