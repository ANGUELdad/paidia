/* Armonia Thassos — Calendar & native-style notifications (PWA) */
(function(global){
  const PREFS_KEY = 'paidia.notifPrefs';
const SW_URL = './sw.js?v=127';

  const defaultPrefs = () => ({
    enabled: false,
    events: true,
    tasks: true,
    shopping: true,
    leadMinutes: 60,
    quietStart: 22,
    quietEnd: 7,
  });

  function loadPrefs(){
    try{
      const raw = localStorage.getItem(PREFS_KEY);
      return raw ? {...defaultPrefs(), ...JSON.parse(raw)} : defaultPrefs();
    }catch{ return defaultPrefs(); }
  }

  function savePrefs(p){
    localStorage.setItem(PREFS_KEY, JSON.stringify({...loadPrefs(), ...p}));
  }

  function inQuietHours(prefs){
    const h = new Date().getHours();
    const {quietStart: s, quietEnd: e} = prefs;
    if(s === e) return false;
    return s < e ? (h >= s && h < e) : (h >= s || h < e);
  }

  function pad(n){ return String(n).padStart(2,'0'); }

  function fmtICS(d){
    return d.getUTCFullYear()+pad(d.getUTCMonth()+1)+pad(d.getUTCDate())+'T'
      +pad(d.getUTCHours())+pad(d.getUTCMinutes())+pad(d.getUTCSeconds())+'Z';
  }

  function escICS(s){
    return String(s||'').replace(/\\/g,'\\\\').replace(/;/g,'\\;').replace(/,/g,'\\,').replace(/\n/g,'\\n');
  }

  function buildICS(items){
    const lines = [
      'BEGIN:VCALENDAR','VERSION:2.0','PRODID:-//Armonia Thassos//Paidia//DE',
      'CALSCALE:GREGORIAN','METHOD:PUBLISH',
    ];
    items.forEach(it=>{
      const start = it.start instanceof Date ? it.start : new Date(it.start);
      const end = it.end instanceof Date ? it.end : new Date(it.end || (start.getTime()+3600000));
      lines.push('BEGIN:VEVENT');
      lines.push('UID:'+escICS(it.uid || ('paidia-'+it.id+'@armonia')));
      lines.push('DTSTAMP:'+fmtICS(new Date()));
      lines.push('DTSTART:'+fmtICS(start));
      lines.push('DTEND:'+fmtICS(end));
      lines.push('SUMMARY:'+escICS(it.title));
      if(it.description) lines.push('DESCRIPTION:'+escICS(it.description));
      if(it.location) lines.push('LOCATION:'+escICS(it.location));
      lines.push('END:VEVENT');
    });
    lines.push('END:VCALENDAR');
    return lines.join('\r\n');
  }

  function downloadICS(filename, content){
    const blob = new Blob([content], {type:'text/calendar;charset=utf-8'});
    const a = document.createElement('a');
    a.href = URL.createObjectURL(blob);
    a.download = filename;
    a.click();
    setTimeout(()=>URL.revokeObjectURL(a.href), 4000);
  }

  async function registerServiceWorker(){
    if(!('serviceWorker' in navigator)) return null;
    try{
      const reg = await navigator.serviceWorker.getRegistration()
        || await navigator.serviceWorker.register(SW_URL, {scope:'./'});
      return reg;
    }catch(e){
      console.warn('SW register failed', e);
      return null;
    }
  }

  async function requestPermission(){
    if(!('Notification' in global)) return 'unsupported';
    if(Notification.permission === 'granted'){
      savePrefs({enabled:true});
      await registerServiceWorker();
      return 'granted';
    }
    if(Notification.permission === 'denied') return 'denied';
    const result = await Notification.requestPermission();
    if(result === 'granted'){
      savePrefs({enabled:true});
      await registerServiceWorker();
    }
    return result;
  }

  function canNotify(){
    const prefs = loadPrefs();
    return prefs.enabled && 'Notification' in global && Notification.permission === 'granted' && !inQuietHours(prefs);
  }

  async function showNotification(title, options={}){
    const tag = options.tag || 'paidia';
    const body = options.body || '';
    const data = options.data || {};
    if(!canNotify()) return false;
    try{
      const reg = await navigator.serviceWorker.ready.catch(()=>null);
      if(reg && reg.showNotification){
        await reg.showNotification(title, {
          body, tag, data, icon: options.icon,
          badge: options.badge, vibrate: [80, 40, 80],
          requireInteraction: !!options.requireInteraction,
        });
        return true;
      }
      new Notification(title, {body, tag, data});
      return true;
    }catch(e){
      console.warn('notification failed', e);
      return false;
    }
  }

  function updateBadge(count){
    const n = Math.max(0, Number(count)||0);
    if(navigator.setAppBadge){
      if(n) navigator.setAppBadge(n).catch(()=>{});
      else navigator.clearAppBadge?.().catch(()=>{});
    }
  }

  /** Collect upcoming reminders from app data (called from app.js) */
  function collectUpcoming(ctx, leadMinutes=60){
    const now = Date.now();
    const horizon = now + leadMinutes * 60000;
    const out = [];
    const seen = new Set();

    (ctx.events||[]).filter(e=>e.status==='published' && e.date).forEach(e=>{
      const [hh,mm] = String(e.from||'09:00').split(':').map(Number);
      const start = new Date(e.date+'T'+pad(hh||9)+':'+pad(mm||0)+':00');
      const t = start.getTime();
      if(t >= now && t <= horizon){
        const key = 'ev-'+e.id;
        if(!seen.has(key)){
          seen.add(key);
          out.push({
            id: key, kind:'event', at:t,
            title: (e.emoji||'📣')+' '+(e.title||e.name||'Event'),
            body: e.date+' · '+(e.from||'')+(e.location?' · '+e.location:''),
            url: '#schedule/events',
          });
        }
      }
    });

    (ctx.tasks||[]).forEach(tk=>{
      if(tk.done) return;
      const [hh,mm] = String(tk.time||'08:00').split(':').map(Number);
      const start = new Date(tk.date+'T'+pad(hh||8)+':'+pad(mm||0)+':00');
      const t = start.getTime();
      if(t >= now && t <= horizon){
        const key = 'tk-'+tk.id;
        if(!seen.has(key)){
          seen.add(key);
          out.push({
            id:key, kind:'task', at:t,
            title: '✅ '+tk.label,
            body: tk.date+' · '+tk.meta,
            url: '#home',
          });
        }
      }
    });

    if(ctx.shoppingDue){
      out.push({
        id:'shop-friday', kind:'shopping', at: ctx.shoppingDue,
        title: ctx.shoppingTitle || '🛒 Einkaufsliste',
        body: ctx.shoppingBody || '',
        url: '#shop',
      });
    }

    return out.sort((a,b)=>a.at-b.at);
  }

  const firedKey = 'paidia.notifFired';
  function loadFired(){
    try{ return new Set(JSON.parse(sessionStorage.getItem(firedKey)||'[]')); }
    catch{ return new Set(); }
  }
  function markFired(id){
    const s = loadFired(); s.add(id);
    sessionStorage.setItem(firedKey, JSON.stringify([...s].slice(-80)));
  }

  async function syncFromContext(ctx){
    const prefs = loadPrefs();
    if(!prefs.enabled || Notification.permission !== 'granted') return {shown:0, upcoming:0};
    const items = collectUpcoming(ctx, Math.max(prefs.leadMinutes, 15));
    let shown = 0;
    const fired = loadFired();
    for(const it of items){
      if((it.kind==='event' && !prefs.events) || (it.kind==='task' && !prefs.tasks) || (it.kind==='shopping' && !prefs.shopping)) continue;
      if(fired.has(it.id)) continue;
      if(inQuietHours(prefs)) continue;
      const ok = await showNotification(it.title, {body:it.body, tag:it.id, data:{url:it.url}});
      if(ok){ markFired(it.id); shown++; }
    }
    updateBadge(items.length);
    return {shown, upcoming: items.length};
  }

  function calendarMonthGrid(year, month, markers){
    /* markers: Map dateStr -> {events, tasks, shopping} counts */
    const first = new Date(year, month, 1);
    const startDow = (first.getDay()+6)%7; /* Mon=0 */
    const daysInMonth = new Date(year, month+1, 0).getDate();
    const cells = [];
    for(let i=0;i<startDow;i++) cells.push(null);
    for(let d=1;d<=daysInMonth;d++){
      const ds = year+'-'+pad(month+1)+'-'+pad(d);
      cells.push({d, ds, mark: markers.get(ds)});
    }
    return cells;
  }

  global.PaidiaNotify = {
    loadPrefs, savePrefs, requestPermission, canNotify,
    showNotification, syncFromContext, collectUpcoming,
    buildICS, downloadICS, updateBadge, registerServiceWorker,
    calendarMonthGrid, inQuietHours,
  };
})(window);
