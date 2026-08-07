/* Armonia PWA service worker — local notifications + Web Push */
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
      data: { url: data.url || "/home" },
      icon: "/icon-192.png",
    })
  );
});

self.addEventListener("message", (event) => {
  const data = event.data || {};
  if (data.type === "schedule-reminder") {
    const delay = Math.min(Number(data.delay) || 0, 2147483647);
    setTimeout(() => {
      self.registration.showNotification(data.title || "Armonia", {
        body: data.body || "Erinnerung",
        data: { url: data.url || "/home" },
        icon: "/icon-192.png",
      });
    }, delay);
  }
});

self.addEventListener("notificationclick", (event) => {
  event.notification.close();
  const url = (event.notification.data && event.notification.data.url) || "/home";
  event.waitUntil(self.clients.openWindow(url));
});
