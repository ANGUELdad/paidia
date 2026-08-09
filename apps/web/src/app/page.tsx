"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { api } from "@/lib/api";
import { getPasskey } from "@/lib/webauthn";

const BUILD = {
  version: 1,
  label: "v1-platform",
  changed: {
    de: "Neue Plattform · Zo-Ai · Automationen · Kids-Belohnungen",
    el: "Νέα πλατφόρμα · Zo-Ai · Αυτοματισμοί · Kids rewards",
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
  const [passkeysAvailable, setPasskeysAvailable] = useState(false);
  const [profilesError, setProfilesError] = useState("");

  useEffect(() => {
    api<{ authenticated: boolean; mode?: string }>("/api/auth/session")
      .then((s) => {
        if (s.authenticated) router.replace(s.mode === "child" ? "/kids" : "/home");
      })
      .catch(() => {});
    api<{ passkeysAvailable?: boolean }>("/api/health")
      .then((h) => setPasskeysAvailable(Boolean(h.passkeysAvailable)))
      .catch(() => undefined);
  }, [router]);

  async function loadMode(next: "staff" | "child") {
    setMode(next);
    setErr("");
    setProfilesError("");
    try {
      const data = await api<{ profiles: Profile[] }>(`/api/auth/profiles?mode=${next}`);
      setProfiles(data.profiles);
      if (!data.profiles?.length) setProfilesError(lang === "el" ? "Δεν υπάρχουν προφίλ" : "Keine Profile geladen");
    } catch {
      setProfiles([]);
      setProfilesError(lang === "el" ? "Φόρτωση απέτυχε" : "Profile konnten nicht geladen werden");
    }
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

  async function loginWithPasskey() {
    if (!who) return;
    setBusy(true);
    setErr("");
    try {
      const options = await api<Record<string, unknown>>("/api/auth/passkey/login/options", {
        method: "POST",
        body: JSON.stringify({ profileId: who.id }),
      });
      const credential = await getPasskey(options);
      const data = await api<{ mode: string }>("/api/auth/passkey/login/verify", {
        method: "POST",
        body: JSON.stringify({ profileId: who.id, credential }),
      });
      router.replace(data.mode === "child" ? "/kids" : "/home");
    } catch {
      setErr(lang === "el" ? "Passkey απέτυχε" : "Passkey fehlgeschlagen");
    } finally {
      setBusy(false);
    }
  }

  const note = BUILD.changed[lang];

  return (
    <main className="login-shell mx-auto flex min-h-dvh max-w-md flex-col px-4 pb-8 pt-[max(1.25rem,env(safe-area-inset-top))]">
      <div className="mb-4 flex gap-2 self-end">
        <button
          className={`btn-sec !min-h-9 !px-3 text-sm ${lang === "de" ? "ring-2 ring-[var(--brand)]" : ""}`}
          type="button"
          data-testid="lang-de"
          onClick={() => setLang("de")}
        >
          DE
        </button>
        <button
          className={`btn-sec !min-h-9 !px-3 text-sm ${lang === "el" ? "ring-2 ring-[var(--brand)]" : ""}`}
          type="button"
          data-testid="lang-el"
          onClick={() => setLang("el")}
        >
          ΕΛ
        </button>
      </div>

      {mode === "pick" && (
        <section className="list-panel mt-2">
          <div className="list-sticky">
            <span>Armonia Thassos</span>
            <span>{BUILD.label}</span>
          </div>
          <div className="stack p-4">
            <p className="eyebrow m-0 text-[var(--sea)]">Paidia</p>
            <h1 className="m-0 text-3xl text-[var(--ink)]">{lang === "el" ? "Ποιος/ποια είσαι;" : "Wer bist du?"}</h1>
            <p className="m-0 text-sm text-[var(--muted)]">{lang === "el" ? "Προσωπικό ή παιδιά" : "Personal oder Kinder"}</p>
            <button className="btn w-full" type="button" data-testid="enter-staff" onClick={() => loadMode("staff")}>
              {lang === "el" ? "Προσωπικό" : "Personal"}
            </button>
            <button className="btn-sec w-full" type="button" data-testid="enter-child" onClick={() => loadMode("child")}>
              {lang === "el" ? "Παιδιά" : "Kinder"}
            </button>
          </div>
        </section>
      )}

      {(mode === "staff" || mode === "child") && (
        <section className="list-panel mt-2">
          <div className="list-sticky">
            <button className="text-sm text-[var(--sea)]" type="button" onClick={() => setMode("pick")}>
              ← {lang === "el" ? "Πίσω" : "Zurück"}
            </button>
            <span>{mode === "child" ? (lang === "el" ? "Παιδιά" : "Kinder") : lang === "el" ? "Προσωπικό" : "Personal"}</span>
          </div>
          {profilesError && (
            <div className="list-row" style={{ cursor: "default" }}>
              <div className="list-row__meta text-red-600" data-testid="profiles-error">
                {profilesError}
              </div>
            </div>
          )}
          {profiles.map((p) => (
            <button
              key={p.id}
              type="button"
              data-testid={`profile-${p.id}`}
              className="list-row"
              onClick={() => {
                setWho(p);
                setMode("pin");
                setPin("");
                setErr("");
              }}
            >
              <div
                className="grid h-10 w-10 shrink-0 place-items-center rounded-full text-sm font-bold text-white"
                style={{ background: p.color || "#2a6b52" }}
              >
                {p.name.slice(0, 2)}
              </div>
              <div className="list-row__main">
                <div className="list-row__title">{p.name}</div>
                <div className="list-row__meta">{p.role || p.mode}</div>
              </div>
              <span aria-hidden>→</span>
            </button>
          ))}
        </section>
      )}

      {mode === "pin" && who && (
        <section className="list-panel mt-2">
          <div className="list-sticky">
            <button className="text-sm text-[var(--sea)]" type="button" onClick={() => setMode(who.mode as "staff" | "child")}>
              ←
            </button>
            <span>{who.name}</span>
          </div>
          <div className="stack p-4">
            <div
              className="grid h-14 w-14 place-items-center rounded-full text-lg font-bold text-white"
              style={{ background: who.color || "#2a6b52" }}
            >
              {who.name.slice(0, 2)}
            </div>
            <p className="m-0 text-sm text-[var(--muted)]">{lang === "el" ? "Βάλε PIN" : "PIN eingeben"}</p>
            <input
              className="w-full rounded-[var(--radius-sm)] border border-[var(--line)] bg-white px-4 py-3 text-center text-2xl tracking-[0.4em]"
              inputMode="numeric"
              maxLength={6}
              value={pin}
              data-testid="pin-input"
              onChange={(e) => setPin(e.target.value.replace(/\D/g, "").slice(0, 6))}
              onKeyDown={(e) => e.key === "Enter" && login()}
              autoFocus
            />
            <div className="min-h-5 text-sm text-red-600" data-testid="login-error">
              {err}
            </div>
            <button className="btn w-full" type="button" data-testid="login-submit" disabled={busy || pin.length < 4} onClick={login}>
              {busy ? "…" : lang === "el" ? "Είσοδος" : "Anmelden"}
            </button>
            {passkeysAvailable && (
              <button className="btn-sec w-full" type="button" data-testid="passkey-login" disabled={busy} onClick={loginWithPasskey}>
                {lang === "el" ? "Είσοδος με Passkey" : "Mit Passkey anmelden"}
              </button>
            )}
            <p className="m-0 text-xs text-[var(--muted)]">
              {lang === "el" ? "Μετά: Face ID από Προφίλ" : "Danach: Face ID unter Profil einrichten"}
            </p>
          </div>
        </section>
      )}

      <div className="mt-auto pt-8 text-center text-xs text-[var(--muted)]">
        <b className="mr-2 uppercase tracking-wider text-[var(--brand)]">{BUILD.label}</b>
        <span>{note}</span>
      </div>
    </main>
  );
}
