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
    { id: 'k11', name: 'Zoitsa', color: '#fecaca' },
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
      forgot: 'PIN vergessen?',
      resetTitle: 'PIN per E-Mail ändern',
      resetSub: 'Wir senden einen einmaligen Link an deine hinterlegte Adresse.',
      email: 'E-Mail-Adresse',
      sendLink: 'Link senden',
      linkSent: 'Wenn die E-Mail zu diesem Profil gehört, wurde ein Link gesendet. Prüfe auch Spam.',
      newPin: 'Neue PIN (4–6 Ziffern)',
      confirmPin: 'PIN bestätigen',
      changePin: 'PIN speichern',
      pinChanged: 'PIN geändert — bitte neu anmelden.',
      invalidReset: 'Link ungültig oder PINs stimmen nicht.',
      needEmail: 'Bitte E-Mail eingeben.',
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
      forgot: 'Ξέχασες το PIN;',
      resetTitle: 'Αλλαγή PIN με email',
      resetSub: 'Στέλνουμε μοναδικό σύνδεσμο στο email του προφίλ.',
      email: 'Διεύθυνση email',
      sendLink: 'Αποστολή συνδέσμου',
      linkSent: 'Αν το email ανήκει σε αυτό το προφίλ, στάλθηκε σύνδεσμος. Έλεγξε και τα ανεπιθύμητα.',
      newPin: 'Νέο PIN (4–6 ψηφία)',
      confirmPin: 'Επιβεβαίωση PIN',
      changePin: 'Αποθήκευση PIN',
      pinChanged: 'Το PIN άλλαξε — συνδέσου ξανά.',
      invalidReset: 'Άκυρος σύνδεσμος ή τα PIN δεν ταιριάζουν.',
      needEmail: 'Βάλε το email.',
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
    const loadScript = (src, dataAttr) => new Promise((resolve, reject) => {
      if (document.querySelector(`script[${dataAttr}]`)) { resolve(); return; }
      const script = document.createElement('script');
      script.src = src;
      script.defer = true;
      script.setAttribute(dataAttr, '1');
      script.onload = () => resolve();
      script.onerror = reject;
      document.body.appendChild(script);
    });
    loadScript('notifications.js?v=42', 'data-paidia-notify')
      .then(() => loadScript('app.js?v=42', 'data-paidia-app'))
      .catch(() => loadScript('app.js?v=42', 'data-paidia-app'));
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
        <button class="gate-forgot" id="gForgot" type="button">${t('forgot')}</button>
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
    body.querySelector('#gForgot').onclick = () => renderResetRequest(who, mode);
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

  function setGateStatus(el, message, kind) {
    if (!el) return;
    el.className = 'gate-status' + (kind ? ' ' + kind : '');
    el.textContent = message || '';
  }

  function renderResetRequest(who, mode) {
    body.innerHTML = `
      <div class="gate-pin gate-reset">
        <div class="gate-mail-hero" aria-hidden="true">
          <div class="gate-mail-mark">A</div>
          <div class="gate-mail-eyebrow">Armonia Thassos</div>
          <h3>${t('resetTitle')}</h3>
          <p>${t('resetSub')}</p>
        </div>
        <div class="pa" style="background:${who.color};margin:14px auto 0">${initials(who.name)}</div>
        <div class="sub" style="margin-top:8px">${esc(who.name)}</div>
        <label class="gate-field"><span>${t('email')}</span>
          <input type="email" id="resetEmail" autocomplete="email" inputmode="email" placeholder="name@example.com"></label>
        <div class="gate-status" id="resetStatus" role="status" aria-live="polite"></div>
        <button class="btn" id="resetSend" type="button">${t('sendLink')}</button>
        <button class="gate-back" type="button" id="resetBack">${t('back')}</button>
      </div>`;
    body.querySelector('#resetBack').onclick = () => renderPin(who, mode);
    body.querySelector('#resetSend').onclick = async () => {
      const email = body.querySelector('#resetEmail').value.trim();
      const status = body.querySelector('#resetStatus');
      const button = body.querySelector('#resetSend');
      if (!email) { setGateStatus(status, t('needEmail'), 'error'); return; }
      button.disabled = true;
      setGateStatus(status, lang === 'el' ? 'Αποστολή…' : 'Senden…', '');
      try {
        const response = await fetch('/api/auth/request-reset', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          credentials: 'same-origin',
          body: JSON.stringify({ profileId: who.id, email }),
        });
        if (!response.ok) throw new Error(String(response.status));
        setGateStatus(status, t('linkSent'), 'success');
      } catch (error) {
        setGateStatus(status, t('unavailable'), 'error');
      } finally {
        button.disabled = false;
      }
    };
    setTimeout(() => body.querySelector('#resetEmail')?.focus(), 40);
  }

  function renderResetForm(token) {
    body.innerHTML = `
      <div class="gate-pin gate-reset">
        <div class="gate-mail-hero" aria-hidden="true">
          <div class="gate-mail-mark">A</div>
          <div class="gate-mail-eyebrow">Armonia Thassos · PIN</div>
          <h3>${t('resetTitle')}</h3>
          <p>${lang === 'el' ? 'Ο σύνδεσμος ισχύει 30 λεπτά.' : 'Der Link gilt 30 Minuten.'}</p>
        </div>
        <label class="gate-field"><span>${t('newPin')}</span>
          <input type="password" id="newPin" inputmode="numeric" pattern="[0-9]*" maxlength="6" autocomplete="new-password"></label>
        <label class="gate-field"><span>${t('confirmPin')}</span>
          <input type="password" id="confirmPin" inputmode="numeric" pattern="[0-9]*" maxlength="6" autocomplete="new-password"></label>
        <div class="gate-status" id="changeStatus" role="status" aria-live="polite"></div>
        <button class="btn" id="changePin" type="button">${t('changePin')}</button>
        <button class="gate-back" type="button" id="resetHome">${t('back')}</button>
      </div>`;
    body.querySelector('#resetHome').onclick = () => {
      history.replaceState({}, '', location.pathname);
      renderEntrance();
    };
    body.querySelector('#changePin').onclick = async () => {
      const pin = body.querySelector('#newPin').value;
      const confirmPin = body.querySelector('#confirmPin').value;
      const status = body.querySelector('#changeStatus');
      const button = body.querySelector('#changePin');
      if (!/^\d{4,6}$/.test(pin) || pin !== confirmPin) {
        setGateStatus(status, t('invalidReset'), 'error');
        return;
      }
      button.disabled = true;
      try {
        const response = await fetch('/api/auth/reset', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          credentials: 'same-origin',
          body: JSON.stringify({ token, pin, confirmPin }),
        });
        const data = await response.json().catch(() => ({}));
        if (!response.ok) throw new Error(data.code || String(response.status));
        history.replaceState({}, '', location.pathname);
        setGateStatus(status, t('pinChanged'), 'success');
        setTimeout(() => renderEntrance(), 900);
      } catch (error) {
        setGateStatus(status, t('invalidReset'), 'error');
      } finally {
        button.disabled = false;
      }
    };
  }

  async function start() {
    document.documentElement.lang = lang;
    gate.classList.add('on');
    document.body.classList.add('auth-pending');
    const resetToken = new URLSearchParams(location.search).get('reset');
    if (resetToken) {
      renderResetForm(resetToken);
      return;
    }
    // Never hang on "Laden…" if the session probe is slow/broken.
    const bootTimer = setTimeout(() => {
      if (!body.querySelector('[data-mode]') && !body.querySelector('.gate-reset')) renderEntrance();
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

  window.PaidiaGate = { start, loadApp, renderResetForm, renderResetRequest };
  start();
})();
