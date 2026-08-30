/* Armonia Thassos — Calendar & native-style notifications (PWA)
   Canonical prefs live in localStorage `paidia.notif` (app.js).
   This module mirrors them for calendar helpers and exposes PaidiaNotify. */
(function(global){
  const PREFS_KEY = 'paidia.notif';
  const LEGACY_KEY = 'paidia.notifPrefs';
  const FIRED_KEY = 'paidia.notifFired';

  const CAT_DEFAULTS = {
    shifts: true,
    handover: true,
    activities: true,
    events: true,
    shopping: true,
    stock: true,
    journal: true,
    ratings: true,
    chores: true,
    reminders: true,
  };

  const defaultPrefs = () => ({
    enabled: false,
    quietStart: '22:00',
    quietEnd: '07:00',
    leadMinutes: 30,
    sound: true,
    vibrate: true,
    kidRatingReminders: true,
    kidRatingsDue: false,
    ratingHooks: {},
    ...CAT_DEFAULTS,
  });

  function coerceBool(v, fallback){
    if(typeof v === 'boolean') return v;
    return fallback;
  }

  function loadPrefs(){
    try{
      let raw = JSON.parse(localStorage.getItem(PREFS_KEY) || 'null');
      if(!raw || typeof raw !== 'object'){
        const legacy = JSON.parse(localStorage.getItem(LEGACY_KEY) || 'null');
        raw = legacy && typeof legacy === 'object' ? legacy : {};
      }
      const base = defaultPrefs();
      const out = {...base, ...raw};
      Object.keys(CAT_DEFAULTS).forEach(k=>{
        out[k] = coerceBool(raw[k], base[k]);
      });
      out.sound = coerceBool(raw.sound, true);
      out.vibrate = coerceBool(raw.vibrate, true);
      const lead = Number(out.leadMinutes);
      out.leadMinutes = Number.isFinite(lead) && lead >= 0 ? lead : 30;
      out.quietStart = out.quietStart || '22:00';
      out.quietEnd = out.quietEnd || '07:00';
      return out;
    }catch{
      return defaultPrefs();
    }
  }

  function savePrefs(p){
    const next = {...loadPrefs(), ...p, updatedAt: Date.now()};
    try{ localStorage.setItem(PREFS_KEY, JSON.stringify(next)); }catch{}
    try{ localStorage.setItem(LEGACY_KEY, JSON.stringify(next)); }catch{}
    return next;
  }

  function minsOfDay(d){
    return d.getHours() * 60 + d.getMinutes();
  }
  function parseHm(hm){
    const [h, m] = String(hm || '00:00').split(':').map(Number);
    return (h || 0) * 60 + (m || 0);
  }

  function inQuietHours(prefs, now){
    const p = prefs || loadPrefs();
    const n = now || new Date();
    const nowM = minsOfDay(n);
    const startM = parseHm(p.quietStart);
    const endM = parseHm(p.quietEnd);
    if(startM === endM) return false;
    if(startM < endM) return nowM >= startM && nowM < endM;
    return nowM >= startM || nowM < endM;
  }

  function pad(n){ return String(n).padStart(2, '0'); }

  function fmtICS(d){
    return d.getUTCFullYear() + pad(d.getUTCMonth() + 1) + pad(d.getUTCDate()) + 'T'
      + pad(d.getUTCHours()) + pad(d.getUTCMinutes()) + pad(d.getUTCSeconds()) + 'Z';
  }

  function escICS(s){
    return String(s || '').replace(/\\/g, '\\\\').replace(/;/g, '\\;').replace(/,/g, '\\,').replace(/\n/g, '\\n');
  }

  function buildICS(items){
    const lines = [
      'BEGIN:VCALENDAR', 'VERSION:2.0', 'PRODID:-//Armonia Thassos//Paidia//DE',
      'CALSCALE:GREGORIAN', 'METHOD:PUBLISH',
    ];
    items.forEach(it=>{
      const start = it.start instanceof Date ? it.start : new Date(it.start);
      const end = it.end instanceof Date ? it.end : new Date(it.end || (start.getTime() + 3600000));
      lines.push('BEGIN:VEVENT');
      lines.push('UID:' + escICS(it.uid || ('paidia-' + it.id + '@armonia')));
      lines.push('DTSTAMP:' + fmtICS(new Date()));
      lines.push('DTSTART:' + fmtICS(start));
      lines.push('DTEND:' + fmtICS(end));
      lines.push('SUMMARY:' + escICS(it.title));
      if(it.description) lines.push('DESCRIPTION:' + escICS(it.description));
      if(it.location) lines.push('LOCATION:' + escICS(it.location));
      lines.push('END:VEVENT');
    });
    lines.push('END:VCALENDAR');
    return lines.join('\r\n');
  }

  function downloadICS(filename, content){
    const blob = new Blob([content], {type: 'text/calendar;charset=utf-8'});
    const a = document.createElement('a');
    a.href = URL.createObjectURL(blob);
    a.download = filename;
    a.click();
    setTimeout(()=>URL.revokeObjectURL(a.href), 4000);
  }

  /** Reuse gate.js registration — never race a second register. */
  async function registerServiceWorker(){
    if(!('serviceWorker' in navigator) || !global.isSecureContext) return null;
    try{
      return await navigator.serviceWorker.getRegistration() || null;
    }catch(e){
      console.warn('SW lookup failed', e);
      return null;
    }
  }

  async function requestPermission(){
    if(!('Notification' in global)) return 'unsupported';
    if(Notification.permission === 'granted'){
      savePrefs({enabled: true});
      await registerServiceWorker();
      return 'granted';
    }
    if(Notification.permission === 'denied') return 'denied';
    let result = 'default';
    try{ result = await Notification.requestPermission(); }catch{ return 'denied'; }
    if(result === 'granted'){
      savePrefs({enabled: true});
      await registerServiceWorker();
    }
    return result;
  }

  function canNotify(opts){
    const prefs = loadPrefs();
    if(!prefs.enabled) return false;
    if(!('Notification' in global) || Notification.permission !== 'granted') return false;
    if(!(opts && opts.force) && inQuietHours(prefs)) return false;
    return true;
  }

  async function showNotification(title, options){
    const opts = options || {};
    const prefs = loadPrefs();
    if(!canNotify(opts)) return false;
    const tag = opts.tag || 'paidia';
    const body = opts.body || '';
    const data = opts.data || {};
    const payload = {
      body, tag, data,
      icon: opts.icon || 'icons/icon-192.png',
      badge: opts.badge || 'icons/icon-192.png',
      requireInteraction: !!opts.requireInteraction,
      renotify: !!opts.renotify,
      silent: prefs.sound === false,
    };
    if(prefs.vibrate !== false && !payload.silent){
      payload.vibrate = Array.isArray(opts.vibrate) ? opts.vibrate : [80, 40, 80];
    }
    try{
      const reg = await registerServiceWorker();
      if(reg && reg.showNotification){
        await reg.showNotification(title, payload);
        return true;
      }
      new Notification(title, {body, tag, data, silent: payload.silent});
      return true;
    }catch(e){
      console.warn('notification failed', e);
      return false;
    }
  }

  function updateBadge(count){
    const n = Math.max(0, Number(count) || 0);
    if(navigator.setAppBadge){
      if(n) navigator.setAppBadge(n).catch(()=>{});
      else navigator.clearAppBadge?.().catch(()=>{});
    }
  }

  /** Collect upcoming reminders from app data (called from app.js) */
  function collectUpcoming(ctx, leadMinutes){
    const lead = Math.max(Number(leadMinutes) || 60, 15);
    const now = Date.now();
    const horizon = now + lead * 60000;
    const out = [];
    const seen = new Set();

    (ctx.events || []).filter(e=>e.status === 'published' && e.date).forEach(e=>{
      const [hh, mm] = String(e.from || '09:00').split(':').map(Number);
      const start = new Date(e.date + 'T' + pad(hh || 9) + ':' + pad(mm || 0) + ':00');
      const t = start.getTime();
      if(t >= now && t <= horizon){
        const key = 'ev-' + e.id;
        if(!seen.has(key)){
          seen.add(key);
          out.push({
            id: key, kind: 'event', at: t,
            title: (e.emoji || '📣') + ' ' + (e.title || e.name || 'Event'),
            body: e.date + ' · ' + (e.from || '') + (e.location ? ' · ' + e.location : ''),
            url: '#schedule/events',
          });
        }
      }
    });

    (ctx.activities || ctx.tasks || []).forEach(tk=>{
      if(tk.done) return;
      const [hh, mm] = String(tk.time || tk.from || '08:00').split(':').map(Number);
      const dateStr = tk.date || '';
      if(!dateStr) return;
      const start = new Date(dateStr + 'T' + pad(hh || 8) + ':' + pad(mm || 0) + ':00');
      const t = start.getTime();
      if(t >= now && t <= horizon){
        const key = 'act-' + (tk.id || (dateStr + '-' + t));
        if(!seen.has(key)){
          seen.add(key);
          out.push({
            id: key, kind: 'activity', at: t,
            title: (tk.emoji || '🎯') + ' ' + (tk.label || tk.title || 'Aktivität'),
            body: dateStr + ' · ' + (tk.meta || tk.time || ''),
            url: '#schedule',
          });
        }
      }
    });

    if(ctx.shoppingDue){
      out.push({
        id: 'shop-friday', kind: 'shopping', at: ctx.shoppingDue,
        title: ctx.shoppingTitle || '🛒 Einkaufsliste',
        body: ctx.shoppingBody || '',
        url: '#shop',
      });
    }

    /* Kid ratings due — populated by app.js PaidiaKidRatings / emitKidRatingHooks */
    (ctx.ratingReminders || []).forEach(r=>{
      if(!r || !r.due || !r.kidId) return;
      const key = 'rating-' + r.kidId + '-' + (r.week || '');
      if(seen.has(key)) return;
      seen.add(key);
      out.push({
        id: key, kind: 'rating', at: now,
        title: r.title || 'Bewertung offen',
        body: r.body || '',
        url: r.url || '#kids',
        kidId: r.kidId,
        missingCount: r.missingCount || 0,
        thingsDue: !!r.thingsDue,
      });
    });

    return out.sort((a, b)=>a.at - b.at);
  }

  function loadFired(){
    try{ return new Set(JSON.parse(sessionStorage.getItem(FIRED_KEY) || '[]')); }
    catch{ return new Set(); }
  }
  function markFired(id){
    const s = loadFired(); s.add(id);
    sessionStorage.setItem(FIRED_KEY, JSON.stringify([...s].slice(-80)));
  }

  async function syncFromContext(ctx){
    const prefs = loadPrefs();
    if(!prefs.enabled || !('Notification' in global) || Notification.permission !== 'granted'){
      return {shown: 0, upcoming: 0};
    }
    const items = collectUpcoming(ctx, Math.max(prefs.leadMinutes, 15));
    let shown = 0;
    const fired = loadFired();
    for(const it of items){
      if(it.kind === 'event' && !prefs.events) continue;
      if((it.kind === 'activity' || it.kind === 'task') && !prefs.activities) continue;
      if(it.kind === 'shopping' && !prefs.shopping) continue;
      if(it.kind === 'rating' && !prefs.ratings) continue;
      if(fired.has(it.id)) continue;
      if(inQuietHours(prefs)) continue;
      const ok = await showNotification(it.title, {body: it.body, tag: it.id, data: {url: it.url}});
      if(ok){ markFired(it.id); shown++; }
    }
    updateBadge(items.length);
    return {shown, upcoming: items.length};
  }

  function calendarMonthGrid(year, month, markers){
    const first = new Date(year, month, 1);
    const startDow = (first.getDay() + 6) % 7;
    const daysInMonth = new Date(year, month + 1, 0).getDate();
    const cells = [];
    for(let i = 0; i < startDow; i++) cells.push(null);
    for(let d = 1; d <= daysInMonth; d++){
      const ds = year + '-' + pad(month + 1) + '-' + pad(d);
      cells.push({d, ds, mark: markers.get(ds)});
    }
    return cells;
  }

  global.PaidiaNotify = {
    loadPrefs, savePrefs, requestPermission, canNotify,
    showNotification, syncFromContext, collectUpcoming,
    buildICS, downloadICS, updateBadge, registerServiceWorker,
    calendarMonthGrid, inQuietHours, CAT_DEFAULTS, defaultPrefs,
  };
})(window);
