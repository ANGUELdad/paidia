"use client";

import { FormEvent, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Dock } from "@/components/Dock";
import { PageShell } from "@/components/PageShell";
import { api, urlBase64ToUint8Array } from "@/lib/api";
import { setStoredLang, t, type Lang } from "@/lib/i18n";
import { useRequireMode } from "@/lib/session";
import { createPasskey } from "@/lib/webauthn";

type Me = {
  id: string;
  name: string;
  role: string;
  nickname?: string;
  emoji?: string;
  color?: string;
  lang?: string;
};

export default function ProfilePage() {
  const router = useRouter();
  const { session, ready } = useRequireMode("any");
  const mode = session?.mode === "child" ? "child" : "staff";
  const [me, setMe] = useState<Me | null>(null);
  const [nickname, setNickname] = useState("");
  const [emoji, setEmoji] = useState("");
  const [color, setColor] = useState("#1f6b4f");
  const [lang, setLang] = useState<Lang>("de");
  const [status, setStatus] = useState("");
  const [originOk, setOriginOk] = useState(true);
  const [vapidPublic, setVapidPublic] = useState("");
  const [pushStatus, setPushStatus] = useState("");
  const [passkeysAvailable, setPasskeysAvailable] = useState(false);
  const [passkeyCount, setPasskeyCount] = useState(0);
  const [freshPin, setFreshPin] = useState("");
  const [passkeyStatus, setPasskeyStatus] = useState("");
  const [feedUrl, setFeedUrl] = useState("");
  const [feedToken, setFeedToken] = useState("");
  const [feedStatus, setFeedStatus] = useState("");

  useEffect(() => {
    if (!ready) return;
    setOriginOk(window.location.protocol === "https:" || window.location.hostname === "localhost");
    api<{
      authenticated: boolean;
      profile?: Me;
      name?: string;
      role?: string;
      nickname?: string;
      emoji?: string;
      color?: string;
      lang?: string;
    }>("/api/auth/me")
      .then((r) => {
        const p = r.profile || {
          id: "",
          name: r.name || "",
          role: r.role || "",
          nickname: r.nickname,
          emoji: r.emoji,
          color: r.color,
          lang: r.lang,
        };
        setMe(p);
        setNickname(p.nickname || p.name);
        setEmoji(p.emoji || "🌿");
        setColor(p.color || "#1f6b4f");
        const l = (p.lang === "el" ? "el" : "de") as Lang;
        setLang(l);
        setStoredLang(l);
      })
      .catch(() => router.replace("/"));
    api<{ vapidPublicKey?: string; passkeysAvailable?: boolean }>("/api/health")
      .then((h) => {
        setVapidPublic((h as { vapidPublicKey?: string }).vapidPublicKey || "");
        setPasskeysAvailable(Boolean((h as { passkeysAvailable?: boolean }).passkeysAvailable));
      })
      .catch(() => undefined);
    api<{ count?: number }>("/api/auth/passkey/list")
      .then((r) => setPasskeyCount(r.count || 0))
      .catch(() => undefined);
  }, [ready, router]);

  async function save(e: FormEvent) {
    e.preventDefault();
    await api("/api/auth/prefs", {
      method: "POST",
      body: JSON.stringify({ nickname, emoji, color, lang }),
    });
    setStoredLang(lang);
    setStatus(t("saved", lang));
  }

  async function logout() {
    await api("/api/auth/logout", { method: "POST" });
    router.replace("/");
  }

  async function enablePush() {
    if (!("serviceWorker" in navigator) || !("PushManager" in window)) {
      setPushStatus("Push nicht verfügbar");
      return;
    }
    if (!vapidPublic) {
      setPushStatus("VAPID-Schlüssel fehlt");
      return;
    }
    try {
      const permission = await Notification.requestPermission();
      if (permission !== "granted") {
        setPushStatus("Benachrichtigung abgelehnt");
        return;
      }
      const readySw = await navigator.serviceWorker.ready;
      const sub = await readySw.pushManager.subscribe({
        userVisibleOnly: true,
        applicationServerKey: urlBase64ToUint8Array(vapidPublic) as BufferSource,
      });
      await api("/api/notify/subscribe", { method: "POST", body: JSON.stringify({ subscription: sub.toJSON() }) });
      setPushStatus("Push aktiv");
    } catch {
      setPushStatus("Push fehlgeschlagen (iOS: App zum Home-Bildschirm?)");
    }
  }

  async function registerPasskey() {
    if (!freshPin || freshPin.length < 4) {
      setPasskeyStatus(t("pinIfNeeded", lang));
      return;
    }
    setPasskeyStatus("");
    try {
      // Fresh PIN gate before WebAuthn ceremony (server still requires session).
      await api("/api/auth/login", {
        method: "POST",
        body: JSON.stringify({ profileId: me?.id || session?.profileId, mode, pin: freshPin }),
      });
      const options = await api<Record<string, unknown>>("/api/auth/passkey/register/options", {
        method: "POST",
        body: JSON.stringify({}),
      });
      const credential = await createPasskey(options);
      await api("/api/auth/passkey/register/verify", {
        method: "POST",
        body: JSON.stringify({ credential }),
      });
      setPasskeyCount((n) => n + 1);
      setFreshPin("");
      setPasskeyStatus(t("passkeySaved", lang));
    } catch {
      setPasskeyStatus(t("passkeyError", lang));
    }
  }

  async function removePasskeys() {
    if (!freshPin || freshPin.length < 4) {
      setPasskeyStatus(t("pinIfNeeded", lang));
      return;
    }
    try {
      const r = await api<{ removed: number }>("/api/auth/passkey/remove", {
        method: "POST",
        body: JSON.stringify({ pin: freshPin }),
      });
      setPasskeyCount(0);
      setFreshPin("");
      setPasskeyStatus(`${t("passkeyRemoved", lang)} (${r.removed})`);
    } catch {
      setPasskeyStatus(t("passkeyError", lang));
    }
  }

  async function mintFeed() {
    try {
      const r = await api<{ url: string; webcalUrl?: string; token: string }>("/api/calendar/feed", {
        method: "POST",
        body: JSON.stringify({ mode: mode === "child" ? "child" : "staff", name: me?.name || "Armonia" }),
      });
      setFeedToken(r.token);
      setFeedUrl(r.webcalUrl || r.url);
      setFeedStatus(t("feedReady", lang));
    } catch {
      setFeedStatus(t("feedError", lang));
    }
  }

  async function rotateFeed() {
    if (!feedToken) {
      await mintFeed();
      return;
    }
    try {
      const r = await api<{ url: string; webcalUrl?: string; token: string }>("/api/calendar/feed/rotate", {
        method: "POST",
        body: JSON.stringify({ token: feedToken }),
      });
      setFeedToken(r.token);
      setFeedUrl(r.webcalUrl || r.url);
      setFeedStatus(t("feedRotated", lang));
    } catch {
      setFeedStatus(t("feedError", lang));
    }
  }

  async function copyFeed() {
    if (!feedUrl) return;
    try {
      await navigator.clipboard.writeText(feedUrl);
      setFeedStatus(t("feedCopied", lang));
    } catch {
      setFeedStatus(feedUrl);
    }
  }

  if (!ready) return <main className="page">{t("loading")}</main>;

  return (
    <>
      <PageShell eyebrow={t("profile", lang)} title={me?.name || "…"} lead={t("profileLead", lang)}>
        <div className="list-panel mb-3">
          <div className="list-sticky">
            <span>{t("profile", lang)}</span>
            <span>{me?.role || mode}</span>
          </div>
          <form className="stack p-3" onSubmit={save}>
            <label>
              {t("nickname", lang)}
              <input value={nickname} onChange={(e) => setNickname(e.target.value)} />
            </label>
            <label>
              {t("emoji", lang)}
              <input value={emoji} onChange={(e) => setEmoji(e.target.value)} />
            </label>
            <label>
              {t("color", lang)}
              <input type="color" value={color} onChange={(e) => setColor(e.target.value)} />
            </label>
            <label>
              {t("language", lang)}
              <select
                value={lang}
                onChange={(e) => {
                  const l = e.target.value as Lang;
                  setLang(l);
                  setStoredLang(l);
                }}
              >
                <option value="de">Deutsch</option>
                <option value="el">Ελληνικά</option>
              </select>
            </label>
            <button className="btn" type="submit">
              {t("save", lang)}
            </button>
            {status && <p className="m-0 text-sm text-[var(--brand)]">{status}</p>}
          </form>
        </div>

        {mode === "staff" && (
          <div className="list-panel mb-3">
            <div className="list-sticky">
              <span>{t("enablePush", lang)}</span>
            </div>
            <div className="list-row" style={{ cursor: "default", flexWrap: "wrap", gap: 8 }}>
              <div className="list-row__main">
                <div className="list-row__meta">
                  {!originOk ? t("biometricsBlocked", lang) : t("biometricsHint", lang)}
                  {pushStatus ? ` · ${pushStatus}` : ""}
                </div>
              </div>
              <button className="btn-sec" type="button" onClick={enablePush} data-testid="enable-push" style={{ minHeight: 40 }}>
                {t("enablePush", lang)}
              </button>
            </div>
          </div>
        )}

        {mode === "staff" && originOk && passkeysAvailable && (
          <div className="list-panel mb-3" data-testid="passkey-panel">
            <div className="list-sticky">
              <span>{t("passkeys", lang)}</span>
              <span>
                {t("passkeyCount", lang)}: {passkeyCount}
              </span>
            </div>
            <div className="stack p-3">
              <input
                type="password"
                inputMode="numeric"
                maxLength={6}
                value={freshPin}
                onChange={(e) => setFreshPin(e.target.value.replace(/\D/g, "").slice(0, 6))}
                placeholder={t("pinIfNeeded", lang)}
                data-testid="passkey-pin"
              />
              <div className="row gap-2">
                <button className="btn-sec flex-1" type="button" onClick={registerPasskey} data-testid="passkey-register">
                  {t("passkeyRegister", lang)}
                </button>
                <button className="btn-sec flex-1" type="button" onClick={removePasskeys} data-testid="passkey-remove">
                  {t("passkeyRemove", lang)}
                </button>
              </div>
              {passkeyStatus && <p className="muted text-sm m-0">{passkeyStatus}</p>}
            </div>
          </div>
        )}

        {mode === "staff" && (
          <div className="list-panel mb-3" data-testid="ics-panel">
            <div className="list-sticky">
              <span>{t("calendarFeed", lang)}</span>
            </div>
            <div className="stack p-3">
              <p className="muted text-sm m-0">{t("calendarFeedHint", lang)}</p>
              <div className="row gap-2 flex-wrap">
                <button className="btn-sec" type="button" onClick={mintFeed} data-testid="ics-mint">
                  {t("feedMint", lang)}
                </button>
                <button className="btn-sec" type="button" onClick={rotateFeed} data-testid="ics-rotate">
                  {t("feedRotate", lang)}
                </button>
                <button className="btn-sec" type="button" onClick={copyFeed} disabled={!feedUrl} data-testid="ics-copy">
                  {t("feedCopy", lang)}
                </button>
              </div>
              {feedUrl && <p className="break-all text-xs text-[var(--muted)] m-0">{feedUrl}</p>}
              {feedStatus && <p className="muted text-sm m-0">{feedStatus}</p>}
            </div>
          </div>
        )}

        <p className="muted text-sm">{t("profileSwitch", lang)}</p>
        <button className="btn-sec w-full" type="button" onClick={logout}>
          {t("logout", lang)}
        </button>
      </PageShell>
      <Dock mode={mode} />
    </>
  );
}
