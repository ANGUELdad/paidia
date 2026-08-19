/* Armonia PWA service worker — local notifications + Web Push (no app precache) */

function safeAppUrl(url) {
  const raw = String(url || "/home");
  if (raw.startsWith("/") && !raw.startsWith("//")) return raw;
  try {
    const parsed = new URL(raw, self.location.origin);
    if (parsed.origin === self.location.origin) {
      return parsed.pathname + parsed.search + parsed.hash;
    }
  } catch (_) {
    /* ignore */
  }
  return "/home";
}

self.addEventListener("install", (event) => {
  event.waitUntil(self.skipWaiting());
});

self.addEventListener("activate", (event) => {
  event.waitUntil(self.clients.claim());
});

self.addEventListener("push", (event) => {
  let data = { title: "Armonia", body: "Neue Erinnerung", url: "/home" };
  try {
    data = { ...data, ...event.data.json() };
  } catch (_) {
    /* ignore */
  }
  event.waitUntil(
    self.registration.showNotification(data.title, {
      body: data.body,
      data: { url: safeAppUrl(data.url) },
      icon: "/icon-192.png",
      badge: "/icon-192.png",
      lang: "de",
      tag: data.kind || "armonia",
      renotify: true,
    })
  );
});

self.addEventListener("message", (event) => {
  const data = event.data || {};
  if (data.type === "schedule-reminder") {
    const delay = Math.min(Math.max(Number(data.delay) || 0, 0), 2147483647);
    setTimeout(() => {
      self.registration.showNotification(data.title || "Armonia", {
        body: data.body || "Erinnerung",
        data: { url: safeAppUrl(data.url) },
        icon: "/icon-192.png",
        badge: "/icon-192.png",
        tag: "armonia-reminder",
      });
    }, delay);
  }
});

self.addEventListener("notificationclick", (event) => {
  event.notification.close();
  const url = safeAppUrl(event.notification.data && event.notification.data.url);
  event.waitUntil(
    self.clients.matchAll({ type: "window", includeUncontrolled: true }).then((clientList) => {
      // Prefer a client that is already on our origin
      const focusable = clientList.find((c) => "focus" in c);
      if (focusable) {
        const nav = focusable.navigate ? focusable.navigate(url) : Promise.resolve();
        return Promise.resolve(nav).then(() => focusable.focus()).catch(() => self.clients.openWindow(url));
      }
      return self.clients.openWindow(url);
    })
  );
});
