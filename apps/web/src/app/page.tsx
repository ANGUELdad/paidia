"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { api } from "@/lib/api";
import { getPasskey } from "@/lib/webauthn";
import { t } from "@/lib/i18n";
import { Icon } from "@/components/Icon";

const BUILD = {
  version: 1,
  label: "v1-platform",
  changed: {
    de: "Neue Plattform · Zo-Ai · Automationen · Kids-Belohnungen",
    el: "Νέα πλατφόρμα · Zo-Ai · Αυτοματισμοί · Kids rewards",
  },
};

type Profile = { id: string; name: string; mode: string; role?: string; color?: string; admin?: boolean };
type Lang = "de" | "el";

export default function LoginPage() {
  const router = useRouter();
  const [lang, setLang] = useState<Lang>("de");
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
      if (!data.profiles?.length)
        setProfilesError(lang === "el" ? "Δεν υπάρχουν προφίλ" : "Keine Profile geladen");
    } catch (e) {
      setProfiles([]);
      const msg = e instanceof Error ? e.message : "";
      if (/unreachable|502|fetch|Zeitüberschreitung/i.test(msg)) {
        setProfilesError(lang === "el" ? "API μη διαθέσιμο" : "API nicht erreichbar — Deploy prüfen");
      } else {
        setProfilesError(lang === "el" ? "Φόρτωση απέτυχε" : "Profile konnten nicht geladen werden");
      }
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
    } catch (e) {
      const msg = e instanceof Error ? e.message : "";
      if (/unreachable|502|Zeitüberschreitung/i.test(msg)) {
        setErr(lang === "el" ? "API μη διαθέσιμο" : "API nicht erreichbar");
      } else {
        setErr(lang === "el" ? "Λάθος PIN" : "Falsche PIN");
      }
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
    <main className="login-dawn">
      {/* Language toggle */}
      <div className="login-dawn-header">
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

      {/* Hero */}
      <div className="login-dawn-hero">
        <p className="login-dawn-wordmark">Armonia Thassos</p>
        <h1 className="login-dawn-title">
          {lang === "el" ? "Καλώς ήρθες" : "Willkommen"}
        </h1>
        <p className="login-dawn-lead">
          {lang === "el" ? "Προσωπικό ή παιδιά" : "Personal oder Kinder"}
        </p>
      </div>

      {/* Pick mode */}
      {mode === "pick" && (
        <section className="stack" data-testid="mode-pick">
          <button
            className="btn w-full"
            type="button"
            data-testid="enter-staff"
            onClick={() => loadMode("staff")}
          >
            <Icon name="profile" size={18} aria-hidden />
            <span style={{ marginLeft: 8 }}>
              {t("loginEnterStaff", lang)}
            </span>
          </button>
          <button
            className="btn-sec w-full"
            type="button"
            data-testid="enter-child"
            onClick={() => loadMode("child")}
          >
            <Icon name="games" size={18} aria-hidden />
            <span style={{ marginLeft: 8 }}>
              {t("loginEnterKids", lang)}
            </span>
          </button>
        </section>
      )}

      {/* Profile list */}
      {(mode === "staff" || mode === "child") && (
        <section className="list-panel" data-testid="profile-list">
          <div className="list-sticky">
            <button
              className="text-sm"
              style={{ color: "var(--sea)" }}
              type="button"
              onClick={() => setMode("pick")}
            >
              ← {t("loginBack", lang)}
            </button>
            <span>
              {mode === "child"
                ? t("loginEnterKids", lang)
                : t("loginEnterStaff", lang)}
            </span>
          </div>
          {profilesError && (
            <div className="list-row" style={{ cursor: "default" }}>
              <div className="list-row__meta" style={{ color: "var(--out)" }} data-testid="profiles-error">
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
                style={{ background: p.color || "var(--brand)" }}
                aria-hidden
              >
                {p.name.slice(0, 2)}
              </div>
              <div className="list-row__main">
                <div className="list-row__title">{p.name}</div>
                <div className="list-row__meta">{p.role || p.mode}</div>
              </div>
              <Icon name="arrow" size={16} aria-hidden />
            </button>
          ))}
        </section>
      )}

      {/* PIN entry */}
      {mode === "pin" && who && (
        <section className="list-panel" data-testid="pin-panel">
          <div className="list-sticky">
            <button
              className="text-sm"
              style={{ color: "var(--sea)" }}
              type="button"
              onClick={() => setMode(who.mode as "staff" | "child")}
            >
              ← {t("loginBack", lang)}
            </button>
            <span>{who.name}</span>
          </div>
          <div className="stack" style={{ padding: "1rem" }}>
            <div
              className="grid h-14 w-14 place-items-center rounded-full text-lg font-bold text-white"
              style={{ background: who.color || "var(--brand)" }}
              aria-hidden
            >
              {who.name.slice(0, 2)}
            </div>
            <p className="m-0 text-sm" style={{ color: "var(--muted)" }}>
              {t("loginPinLabel", lang)}
            </p>
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
            <div className="min-h-5 text-sm" style={{ color: "var(--out)" }} data-testid="login-error">
              {err}
            </div>
            <button
              className="btn w-full"
              type="button"
              data-testid="login-submit"
              disabled={busy || pin.length < 4}
              onClick={login}
            >
              {busy ? "…" : t("loginSubmit", lang)}
            </button>
            {passkeysAvailable && (
              <button
                className="btn-sec w-full"
                type="button"
                data-testid="passkey-login"
                disabled={busy}
                onClick={loginWithPasskey}
              >
                <Icon name="profile" size={16} aria-hidden />
                <span style={{ marginLeft: 6 }}>
                  {t("passkeyLogin", lang)}
                </span>
              </button>
            )}
            <p className="m-0 text-xs" style={{ color: "var(--muted)" }}>
              {t("loginPasskeyHint", lang)}
            </p>
          </div>
        </section>
      )}

      {/* Version chip */}
      <div className="login-dawn-note" data-testid="login-version">
        <span className="login-dawn-version">{BUILD.label}</span>
        <span>{note}</span>
      </div>
    </main>
  );
}
