"use client";

import { FormEvent, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Dock } from "@/components/Dock";
import { api } from "@/lib/api";
import { useRequireMode } from "@/lib/session";

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
  const [lang, setLang] = useState("de");
  const [status, setStatus] = useState("");
  const [originOk, setOriginOk] = useState(true);

  useEffect(() => {
    if (!ready) return;
    setOriginOk(window.location.protocol === "https:" || window.location.hostname === "localhost");
    api<{ authenticated: boolean; profile?: Me; name?: string; role?: string; nickname?: string; emoji?: string; color?: string; lang?: string }>(
      "/api/auth/me"
    )
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
        setLang(p.lang || "de");
      })
      .catch(() => {
        router.replace("/");
      });
  }, [ready, router]);

  async function save(e: FormEvent) {
    e.preventDefault();
    await api("/api/auth/prefs", {
      method: "POST",
      body: JSON.stringify({ nickname, emoji, color, lang }),
    });
    setStatus("Saved");
  }

  async function logout() {
    await api("/api/auth/logout", { method: "POST" });
    router.replace("/");
  }

  if (!ready) return <main className="page">Laden…</main>;

  return (
    <main className="page">
      <header className="top">
        <div>
          <p className="eyebrow">Profile</p>
          <h1>{me?.name || "…"}</h1>
        </div>
      </header>
      <section className="panel stack">
        <form className="stack" onSubmit={save}>
          <label>
            Nickname
            <input value={nickname} onChange={(e) => setNickname(e.target.value)} />
          </label>
          <label>
            Emoji
            <input value={emoji} onChange={(e) => setEmoji(e.target.value)} />
          </label>
          <label>
            Color
            <input type="color" value={color} onChange={(e) => setColor(e.target.value)} />
          </label>
          <label>
            Language
            <select value={lang} onChange={(e) => setLang(e.target.value)}>
              <option value="de">Deutsch</option>
              <option value="el">Ελληνικά</option>
            </select>
          </label>
          <button className="btn" type="submit">
            Save prefs
          </button>
        </form>
        {!originOk && (
          <p className="warn">
            WebAuthn needs HTTPS (or localhost). Face ID / fingerprint setup is blocked on this origin.
          </p>
        )}
        {originOk && mode === "staff" && (
          <p className="muted">Biometrics: register after first PIN on a secure origin (platform authenticator).</p>
        )}
        {status && <p>{status}</p>}
        <p className="muted text-sm">Profil wechseln: abmelden — neues Profil braucht PIN.</p>
        <button className="btn ghost" type="button" onClick={logout}>
          Log out
        </button>
      </section>
      <Dock mode={mode} />
    </main>
  );
}
