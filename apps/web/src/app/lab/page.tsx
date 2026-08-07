"use client";

import { useEffect, useRef, useState } from "react";

/** iPhone-frame device lab — embeds the live app for manual + automated QA */
export default function PhoneLabPage() {
  const [width, setWidth] = useState(390);
  const [height, setHeight] = useState(844);
  const [src, setSrc] = useState("/?tour=1");
  const iframeRef = useRef<HTMLIFrameElement>(null);

  useEffect(() => {
    document.documentElement.classList.add("lab-root");
    return () => document.documentElement.classList.remove("lab-root");
  }, []);

  return (
    <main className="lab">
      <header className="lab-bar">
        <div>
          <p className="eyebrow">Device lab</p>
          <h1 className="text-2xl">iPhone simulation</h1>
        </div>
        <div className="lab-controls">
          <button type="button" className="btn-sec" onClick={() => { setWidth(390); setHeight(844); }}>
            iPhone 14
          </button>
          <button type="button" className="btn-sec" onClick={() => { setWidth(430); setHeight(932); }}>
            iPhone 15 Pro Max
          </button>
          <button type="button" className="btn-sec" onClick={() => { setWidth(360); setHeight(740); }}>
            Compact
          </button>
          <select value={src} onChange={(e) => setSrc(e.target.value)}>
            <option value="/">Login</option>
            <option value="/home">Home</option>
            <option value="/plan">Plan</option>
            <option value="/stock">Lager</option>
            <option value="/shop">Liste</option>
            <option value="/talk">Talk</option>
            <option value="/book">Buch</option>
            <option value="/calendar">Kalender</option>
            <option value="/zoai">Zo-Ai</option>
            <option value="/kids">Kids</option>
            <option value="/admin/notify">Automationen</option>
          </select>
          <button type="button" className="btn" onClick={() => iframeRef.current?.contentWindow?.location.reload()}>
            Reload
          </button>
        </div>
      </header>
      <div className="phone-stage">
        <div className="phone-chrome" style={{ width, height }}>
          <div className="phone-notch" />
          <iframe ref={iframeRef} title="Armonia iPhone" src={src} className="phone-screen" />
        </div>
      </div>
    </main>
  );
}
