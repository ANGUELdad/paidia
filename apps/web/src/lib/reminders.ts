/** Local OS notifications + reminder helpers */

export async function ensureNotifPermission(): Promise<NotificationPermission> {
  if (typeof window === "undefined" || !("Notification" in window)) return "denied";
  if (Notification.permission === "granted") return "granted";
  if (Notification.permission !== "denied") {
    return Notification.requestPermission();
  }
  return Notification.permission;
}

export async function scheduleLocalReminder(title: string, atIso: string, url = "/home") {
  const perm = await ensureNotifPermission();
  const when = new Date(atIso).getTime();
  const delay = Math.max(0, when - Date.now());
  const payload = { title, body: "Armonia Erinnerung", url, at: atIso };
  const key = `armonia.rm.${when}.${title}`;
  localStorage.setItem(key, JSON.stringify(payload));

  if (perm === "granted") {
    window.setTimeout(() => {
      try {
        new Notification(title, { body: "Armonia Erinnerung", data: { url } });
      } catch {
        /* ignore */
      }
    }, Math.min(delay, 2147483647));
  }

  if ("serviceWorker" in navigator) {
    const reg = await navigator.serviceWorker.ready.catch(() => null);
    if (reg) {
      // Best-effort show later via SW message
      reg.active?.postMessage({ type: "schedule-reminder", ...payload, delay });
    }
  }
  return { ok: true, delay };
}

export function sweepDueReminders() {
  if (typeof window === "undefined") return;
  const now = Date.now();
  for (let i = 0; i < localStorage.length; i++) {
    const key = localStorage.key(i);
    if (!key?.startsWith("armonia.rm.")) continue;
    try {
      const raw = localStorage.getItem(key);
      if (!raw) continue;
      const data = JSON.parse(raw) as { title: string; at: string; url?: string };
      if (new Date(data.at).getTime() <= now) {
        if (Notification.permission === "granted") {
          new Notification(data.title, { body: "Fällig", data: { url: data.url || "/home" } });
        }
        localStorage.removeItem(key);
      }
    } catch {
      /* ignore */
    }
  }
}
