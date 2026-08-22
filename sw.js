// Network-first PWA worker — never serve stale app shells or JS bundles.
const CACHE = 'paidia-v84';
const ASSETS = ['./manifest.webmanifest'];
const NEVER_CACHE = /(?:^|\/)(?:index\.html|gate\.js|app\.js|build\.json|sw\.js)(?:\?|$)/i;

function safeAppUrl(url) {
  const raw = String(url || './');
  if (raw.startsWith('./') || (raw.startsWith('/') && !raw.startsWith('//'))) return raw;
  try {
    const parsed = new URL(raw, self.location.origin);
    if (parsed.origin === self.location.origin) {
      return parsed.pathname + parsed.search + parsed.hash;
    }
  } catch (_) {
    /* ignore */
  }
  return './';
}

function isVolatile(url) {
  if (NEVER_CACHE.test(url.pathname + url.search)) return true;
  if (url.search.includes('v=')) return true;
  return false;
}

self.addEventListener('install', (e) => {
  e.waitUntil(
    caches.open(CACHE)
      .then((c) => c.addAll(ASSETS))
      .then(() => self.skipWaiting())
  );
});

self.addEventListener('activate', (e) => {
  e.waitUntil(
    caches.keys()
      .then((keys) => Promise.all(keys.map((k) => caches.delete(k))))
      .then(() => self.clients.claim())
  );
});

self.addEventListener('message', (event) => {
  if (event.data && event.data.type === 'SKIP_WAITING') self.skipWaiting();
});

self.addEventListener('fetch', (e) => {
  if (e.request.method !== 'GET') return;
  const url = new URL(e.request.url);
  if (url.origin !== self.location.origin) return;

  if (url.pathname.startsWith('/api/') || isVolatile(url)) {
    e.respondWith(fetch(e.request, { cache: 'no-store' }));
    return;
  }

  const isShell = e.request.mode === 'navigate' ||
    url.pathname.endsWith('/') ||
    url.pathname.endsWith('/index.html');
  if (isShell) {
    e.respondWith(
      fetch(e.request, { cache: 'no-store' })
        .catch(() => Response.error())
    );
    return;
  }

  e.respondWith(
    fetch(e.request, { cache: 'no-store' })
      .then((res) => {
        if (res.ok && url.pathname.startsWith('/icons/')) {
          const copy = res.clone();
          caches.open(CACHE).then((c) => c.put(e.request, copy)).catch(() => {});
        }
        return res;
      })
      .catch(() => caches.match(e.request))
  );
});

self.addEventListener('notificationclick', (event) => {
  event.notification.close();
  const action = event.action || '';
  let target = safeAppUrl((event.notification.data && event.notification.data.url) || './');
  if (action === 'there' || action === 'late' || action === 'open' ||
     (event.notification.data && event.notification.data.open === 'presence')) {
    target = './?tab=home&presence=1';
  }
  event.waitUntil(
    self.clients.matchAll({ type: 'window', includeUncontrolled: true }).then((list) => {
      for (const client of list) {
        if ('focus' in client) {
          client.focus();
          try { client.postMessage({ type: 'presence-open', action }); } catch (_) {}
          if (client.navigate) {
            try { client.navigate(target); } catch (_) {}
          }
          return;
        }
      }
      if (self.clients.openWindow) return self.clients.openWindow(target);
    })
  );
});

self.addEventListener('push', (event) => {
  let data = { title: 'Armonia Thassos', body: '', url: './' };
  try {
    if (event.data) data = Object.assign(data, event.data.json());
  } catch (_) {}
  event.waitUntil(
    self.registration.showNotification(data.title || 'Armonia Thassos', {
      body: data.body || '',
      icon: 'icons/icon-192.png',
      badge: 'icons/icon-192.png',
      data: { url: safeAppUrl(data.url || './') },
    })
  );
});
