/* Instant login shell — runs before the heavy app so PIN entry always works. */
(function () {
  const STAFF = [
    { id: 'e1', name: 'Dora', role: 'Betreuerin', color: '#a7f3d0' },
    { id: 'e2', name: 'Karin', role: 'Betreuerin', color: '#bfdbfe' },
    { id: 'e3', name: 'Dimitris', role: 'Betreuer', color: '#fde68a' },
    { id: 'e4', name: 'Angelos', role: 'Betreuer', color: '#fbcfe8' },
    { id: 'e5', name: 'Claudio', role: 'Betreuer', color: '#c7d2fe' },
    { id: 'e6', name: 'Löhri', role: 'Betreuer', color: '#fed7aa' },
    { id: 'e7', name: 'Amalia', role: 'Betreuerin', color: '#d9f99d' },
    { id: 'e8', name: 'Zoi', role: 'Leitung', color: '#f5d0fe' },
  ];
  const CHILDREN = [
    { id: 'k1', name: 'Simon', color: '#bfdbfe' },
    { id: 'k2', name: 'Kai', color: '#a7f3d0' },
    { id: 'k3', name: 'Vincent', color: '#fde68a' },
    { id: 'k4', name: 'Julian klein', color: '#fbcfe8' },
    { id: 'k5', name: 'Julian groß', color: '#c7d2fe' },
    { id: 'k6', name: 'Lea', color: '#fed7aa' },
    { id: 'k7', name: 'Valeria', color: '#d9f99d' },
    { id: 'k8', name: 'Jule', color: '#f5d0fe' },
    { id: 'k9', name: 'Samantha', color: '#99f6e4' },
    { id: 'k10', name: 'Lilly', color: '#99f6e4' },
    { id: 'k11', name: 'Daniel', color: '#fecaca' },
    { id: 'k12', name: 'Leonie', color: '#e9d5ff' },
  ];

  const gate = document.getElementById('gate');
  const body = document.getElementById('gateBody');
  if (!gate || !body) return;

  let lang = localStorage.getItem('paidia.lang') || 'de';
  const copy = {
    de: {
      brand: 'Gemeinsam durch den Tag',
      title: 'Armonia Thassos',
      who: 'Wer bist du?',
      staff: 'Personal',
      staffSub: 'Team-Anmeldung',
      child: 'Kinder',
      childSub: 'Kinder-Anmeldung',
      pick: 'Profil wählen',
      pin: 'PIN eingeben',
      login: 'Anmelden',
      back: '← Zurück',
      wrong: 'Falsche PIN',
      locked: (m) => `Gesperrt · noch ${m} Min.`,
      attempts: (n) => `Noch ${n} Versuche`,
      unavailable: 'Anmeldung nicht möglich',
      hint: 'PIN tippen oder die 6 Ziffern antippen.',
    },
    el: {
      brand: 'Μαζί μέσα στην ημέρα',
      title: 'Armonia Thassos',
      who: 'Ποιος/ποια είσαι;',
      staff: 'Προσωπικό',
      staffSub: 'Είσοδος ομάδας',
      child: 'Παιδιά',
      childSub: 'Είσοδος παιδιών',
      pick: 'Επίλεξε προφίλ',
      pin: 'Βάλε PIN',
      login: 'Είσοδος',
      back: '← Πίσω',
      wrong: 'Λάθος PIN',
      locked: (m) => `Κλείδωμα · ακόμη ${m} λεπτά`,
      attempts: (n) => `Ακόμη ${n} προσπάθειες`,
      unavailable: 'Η είσοδος δεν είναι διαθέσιμη',
      hint: 'Πληκτρολόγησε ή πάτα τα 6 ψηφία.',
    },
  };
  const t = (key) => copy[lang][key];
  const esc = (value) => String(value ?? '')
    .replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
  const initials = (name) => String(name || '?').split(/\s+/).map((p) => p[0]).join('').slice(0, 2).toUpperCase();

  function loadApp() {
    window.__paidiaAuthed = true;
    if (document.querySelector('script[data-paidia-app]')) return;
    const script = document.createElement('script');
    script.src = 'app.js?v=16';
    script.defer = true;
    script.dataset.paidiaApp = '1';
    document.body.appendChild(script);
  }

  function langSwitch() {
    return `<div class="gate-lang">
      <button type="button" class="${lang === 'de' ? 'on' : ''}" data-l="de">Deutsch</button>
      <button type="button" class="${lang === 'el' ? 'on' : ''}" data-l="el">Ελληνικά</button>
    </div>`;
  }

  function wireLang() {
    body.querySelectorAll('.gate-lang button').forEach((button) => {
      button.onclick = () => {
        lang = button.dataset.l;
        localStorage.setItem('paidia.lang', lang);
        document.documentElement.lang = lang;
        renderEntrance();
      };
    });
  }

  function renderEntrance() {
    body.innerHTML = `
      ${langSwitch()}
      <div class="gate-head">
        <div class="mark" aria-hidden="true">A</div>
        <div class="brand-kicker">${t('brand')}</div>
        <h2>${t('title')}</h2>
        <p>${t('who')}</p>
      </div>
      <div class="profiles" style="grid-template-columns:1fr">
        <button class="profile" type="button" data-mode="staff" style="text-align:left;display:flex;gap:14px;align-items:center;padding:18px 16px">
          <div class="pa" style="background:#bfdbfe;margin:0;flex:0 0 auto">👥</div>
          <div><div class="pn" style="font-size:16px">${t('staff')}</div><div class="pr">${t('staffSub')}</div></div>
        </button>
        <button class="profile" type="button" data-mode="child" style="text-align:left;display:flex;gap:14px;align-items:center;padding:18px 16px">
          <div class="pa" style="background:#fde68a;margin:0;flex:0 0 auto">🎈</div>
          <div><div class="pn" style="font-size:16px">${t('child')}</div><div class="pr">${t('childSub')}</div></div>
        </button>
      </div>`;
    wireLang();
    body.querySelectorAll('[data-mode]').forEach((button) => {
      button.onclick = () => renderProfiles(button.dataset.mode);
    });
  }

  function renderProfiles(mode) {
    const people = mode === 'child' ? CHILDREN : STAFF;
    body.innerHTML = `
      ${langSwitch()}
      <div class="gate-head">
        <div class="mark">${mode === 'child' ? '🎈' : '👥'}</div>
        <div class="brand-kicker">Armonia Thassos</div>
        <h2>${mode === 'child' ? t('child') : t('staff')}</h2>
        <p>${t('pick')}</p>
      </div>
      <div class="profiles">
        ${people.map((person) => `
          <button class="profile" type="button" data-p="${person.id}">
            <div class="pa" style="background:${person.color}">${initials(person.name)}</div>
            <div class="pn">${esc(person.name)}</div>
            <div class="pr">${esc(person.role || '')}</div>
          </button>`).join('')}
      </div>
      <button class="gate-back" type="button" id="gHome">${t('back')}</button>`;
    wireLang();
    body.querySelector('#gHome').onclick = renderEntrance;
    body.querySelectorAll('[data-p]').forEach((button) => {
      const person = people.find((item) => item.id === button.dataset.p);
      button.onclick = () => renderPin(person, mode);
    });
  }

  function renderPin(who, mode) {
    let buf = '';
    let busy = false;
    body.innerHTML = `
      <div class="gate-pin">
        <div class="pa" style="background:${who.color}">${initials(who.name)}</div>
        <h3>${esc(who.name)}</h3>
        <div class="sub">${who.role ? esc(who.role) + ' · ' : ''}${t('pin')}</div>
        <div class="pindots" id="gpd"></div>
        <input class="pin-field" id="gPinInput" type="tel" inputmode="numeric" pattern="[0-9]*"
          maxlength="6" autocomplete="one-time-code" enterkeyhint="done" aria-label="PIN" value="">
        <div id="gpErr" style="min-height:18px;color:#f87171;font-size:12.5px" role="alert"></div>
        <div class="pinpad" id="gPinpad" role="group" aria-label="PIN">
          ${[1, 2, 3, 4, 5, 6, 7, 8, 9].map((n) => `<button type="button" data-k="${n}">${n}</button>`).join('')}
          <button type="button" data-k="del" aria-label="Backspace">⌫</button>
          <button type="button" data-k="0">0</button>
          <button type="button" data-k="clr" aria-label="Clear">C</button>
        </div>
        <button class="btn" id="gLogin" type="button" style="margin-top:12px">${t('login')}</button>
        <div class="muted" style="margin-top:10px;font-size:11.5px">${t('hint')}</div>
        <button class="gate-back" type="button" id="gBack">${t('back')}</button>
      </div>`;

    const input = body.querySelector('#gPinInput');
    const errorEl = body.querySelector('#gpErr');
    const loginBtn = body.querySelector('#gLogin');
    const draw = () => {
      body.querySelector('#gpd').innerHTML = [0, 1, 2, 3, 4, 5]
        .map((i) => `<i class="${i < buf.length ? 'f' : ''}"></i>`).join('');
      if (input.value !== buf) input.value = buf;
    };
    draw();

    const finish = async () => {
      if (busy) return;
      if (buf.length < 4) {
        errorEl.textContent = t('wrong');
        return;
      }
      busy = true;
      loginBtn.disabled = true;
      input.disabled = true;
      errorEl.textContent = '';
      try {
        const response = await fetch('/api/auth/login', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          credentials: 'same-origin',
          body: JSON.stringify({ mode, profileId: who.id, pin: buf }),
        });
        const raw = await response.text();
        let data = {};
        try { data = JSON.parse(raw); } catch (error) {
          errorEl.textContent = lang === 'el'
            ? 'Ο server δεν απαντά. Άνοιξε μέσω python3 server.py ή Vercel API.'
            : 'Server antwortet nicht. Starte python3 server.py oder Vercel-API.';
          buf = '';
          return;
        }
        if (!response.ok) {
          if (response.status === 429) {
            const minutes = Math.max(1, Math.ceil((Number(data.retryAfter) || 900) / 60));
            errorEl.textContent = t('locked')(minutes);
          } else if (response.status === 401 && Number.isInteger(data.attemptsRemaining)) {
            errorEl.textContent = t('attempts')(data.attemptsRemaining);
          } else {
            errorEl.textContent = response.status === 401 ? t('wrong') : t('unavailable');
          }
          buf = '';
          return;
        }
        // Cookie is set — hydrate app; fall back to hard reload if script load fails.
        window.__paidiaAuthed = true;
        try {
          loadApp();
        } catch (error) {
          location.replace('/?in=' + Date.now());
        }
        return;
      } catch (error) {
        errorEl.textContent = t('unavailable');
        buf = '';
      } finally {
        busy = false;
        loginBtn.disabled = false;
        input.disabled = false;
        draw();
        try { input.focus(); } catch (error) {}
      }
    };

    const push = (key) => {
      if (busy) return;
      if (key === 'del') buf = buf.slice(0, -1);
      else if (key === 'clr') buf = '';
      else if (/^\d$/.test(key) && buf.length < 6) buf += key;
      draw();
      if (buf.length === 6) finish();
    };

    body.querySelector('#gBack').onclick = () => renderProfiles(mode);
    body.querySelector('#gPinpad').onclick = (event) => {
      const button = event.target.closest('button[data-k]');
      if (!button) return;
      event.preventDefault();
      push(button.dataset.k);
    };
    loginBtn.onclick = finish;
    input.addEventListener('input', () => {
      if (busy) return;
      buf = String(input.value || '').replace(/\D/g, '').slice(0, 6);
      draw();
      if (buf.length === 6) finish();
    });
    input.addEventListener('keydown', (event) => {
      if (event.key === 'Enter' && buf.length >= 4) {
        event.preventDefault();
        finish();
      }
    });
    setTimeout(() => input.focus(), 30);
  }

  async function start() {
    document.documentElement.lang = lang;
    gate.classList.add('on');
    document.body.classList.add('auth-pending');
    // Never hang on "Laden…" if the session probe is slow/broken.
    const bootTimer = setTimeout(() => {
      if (!body.querySelector('[data-mode]')) renderEntrance();
    }, 2500);
    try {
      const controller = new AbortController();
      const kill = setTimeout(() => controller.abort(), 4000);
      const response = await fetch('/api/auth/session', {
        credentials: 'same-origin',
        signal: controller.signal,
        headers: { Accept: 'application/json' },
      });
      clearTimeout(kill);
      const raw = await response.text();
      let data = {};
      try { data = JSON.parse(raw); } catch (error) { data = {}; }
      if (response.ok && data.authenticated) {
        clearTimeout(bootTimer);
        loadApp();
        return;
      }
    } catch (error) {
      /* fall through to login */
    }
    clearTimeout(bootTimer);
    renderEntrance();
  }

  window.PaidiaGate = { start, loadApp };
  start();
})();
