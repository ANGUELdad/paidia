/* Instant login shell — runs before the heavy app so PIN entry always works. */
(function () {
  const STAFF = [
    { id: 'e1', name: 'Dora', role: 'Betreuerin', color: '#9bc4b0' },
    { id: 'e2', name: 'Karin', role: 'Betreuerin', color: '#7a9eaa' },
    { id: 'e3', name: 'Dimitris', role: 'Betreuer', color: '#c5ddd0' },
    { id: 'e4', name: 'Angelos', role: 'Betreuer', color: '#a8c5b8' },
    { id: 'e5', name: 'Claudio', role: 'Betreuer', color: '#8fb0a0' },
    { id: 'e6', name: 'Löhri', role: 'Betreuer', color: '#d4c4a0' },
    { id: 'e7', name: 'Amalia', role: 'Betreuerin', color: '#b8c9a8' },
    { id: 'e8', name: 'Zoi', role: 'Leitung', color: '#2f5a63' },
  ];
  const CHILDREN = [
    { id: 'k1', name: 'Simon', color: '#9bc4b0' },
    { id: 'k2', name: 'Kai', color: '#7a9eaa' },
    { id: 'k3', name: 'Vincent', color: '#c5ddd0' },
    { id: 'k4', name: 'Julian klein', color: '#a8c5b8' },
    { id: 'k5', name: 'Julian groß', color: '#8fb0a0' },
    { id: 'k6', name: 'Lea', color: '#d4c4a0' },
    { id: 'k7', name: 'Valeria', color: '#b8c9a8' },
    { id: 'k8', name: 'Jule', color: '#6b9a88' },
    { id: 'k9', name: 'Samantha', color: '#5a8a7a' },
    { id: 'k10', name: 'Lilly', color: '#7a9eaa' },
    { id: 'k11', name: 'Zoitsa', color: '#c48a1a' },
    { id: 'k12', name: 'Leonie', color: '#2f5a63' },
  ];

  const gate = document.getElementById('gate');
  const body = document.getElementById('gateBody');
  if (!gate || !body) return;

  let lang = localStorage.getItem('paidia.lang') || 'de';
  let bootSettled = false;
  const APP_BUILD = {
    version: 74,
    label: 'v75',
    changed: {
      de: 'Momente ein Tipp · Zo-Ai Groq-Modelle · Pooler-DB-Hinweis',
      el: 'Momente ένα κλικ · μοντέλα Zo-Ai Groq · υπόδειξη pooler DB',
    },
  };
  const copy = {
    de: {
      brand: 'Gemeinsam durch den Tag',
      title: 'Armonia Thassos',
      who: 'Wer bist du?',
      staff: 'Personal',
      staffSub: 'Team-Anmeldung',
      child: 'Kinder',
      childSub: 'Kinder-Anmeldung',
      childInstall: 'App aufs Handy: iPhone → Teilen → Zum Home-Bildschirm · Android → Menü → App installieren',
      pick: 'Profil wählen',
      pin: 'PIN eingeben',
      login: 'Anmelden',
      back: '← Zurück',
      pinFallback: 'Oder PIN',
      bioFace: 'Face ID',
      bioFinger: 'Fingerabdruck',
      bioPasskey: 'Biometrie',
      bioHint: 'Schnelle Anmeldung auf diesem Gerät',
      bioFail: 'Biometrie fehlgeschlagen — PIN nutzen',
      bioUnavailable: 'Biometrie hier nicht verfügbar (HTTPS + Face ID / Fingerabdruck nötig)',
      bioSetupNeeded: 'Zuerst mit PIN anmelden, dann unter Profil Face ID einrichten',
      wrong: 'Falsche PIN',
      locked: (m) => `Gesperrt · noch ${m} Min.`,
      attempts: (n) => `Noch ${n} Versuche`,
      unavailable: 'Anmeldung nicht möglich',
      loading: 'Anmelden…',
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
      storageFail: 'PIN konnte nicht gespeichert werden. Bitte Admin informieren.',
      resetUnavailable: 'E-Mail-Reset ist gerade nicht verfügbar. Bitte Admin fragen.',
      resetNeedProfileEmail: 'Nutze die E-Mail, die für dieses Profil gespeichert ist.',
      resetBackPin: '← Zurück zur PIN',
    },
    el: {
      brand: 'Μαζί μέσα στην ημέρα',
      title: 'Armonia Thassos',
      who: 'Ποιος/ποια είσαι;',
      staff: 'Προσωπικό',
      staffSub: 'Είσοδος ομάδας',
      child: 'Παιδιά',
      childSub: 'Είσοδος παιδιών',
      childInstall: 'App στο κινητό: iPhone → Κοινή χρήση → Στην οθόνη Αφετηρίας · Android → Μενού → Εγκατάσταση εφαρμογής',
      pick: 'Επίλεξε προφίλ',
      pin: 'Βάλε PIN',
      login: 'Είσοδος',
      back: '← Πίσω',
      pinFallback: 'Ή PIN',
      bioFace: 'Face ID',
      bioFinger: 'Δακτυλικό αποτύπωμα',
      bioPasskey: 'Βιομετρικά',
      bioHint: 'Γρήγορη είσοδος σε αυτή τη συσκευή',
      bioFail: 'Αποτυχία βιομετρικών — χρησιμοποίησε PIN',
      bioUnavailable: 'Τα βιομετρικά δεν είναι διαθέσιμα (HTTPS + Face ID / δακτυλικό)',
      bioSetupNeeded: 'Πρώτα είσοδος με PIN, μετά Face ID από το Προφίλ',
      wrong: 'Λάθος PIN',
      locked: (m) => `Κλείδωμα · ακόμη ${m} λεπτά`,
      attempts: (n) => `Ακόμη ${n} προσπάθειες`,
      unavailable: 'Η είσοδος δεν είναι διαθέσιμη',
      loading: 'Σύνδεση…',
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
      storageFail: 'Το PIN δεν αποθηκεύτηκε. Ενημέρωσε τον admin.',
      resetUnavailable: 'Η αλλαγή PIN με email δεν είναι διαθέσιμη τώρα. Ρώτα τον admin.',
      resetNeedProfileEmail: 'Χρησιμοποίησε το email που είναι αποθηκευμένο σε αυτό το προφίλ.',
      resetBackPin: '← Πίσω στο PIN',
    },
  };
  const t = (key) => copy[lang][key];
  const esc = (value) => String(value ?? '')
    .replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
  const safeColor = (value) => /^#[0-9a-fA-F]{3,8}$/.test(String(value || '')) ? String(value) : '#94a3b8';
  const initials = (name) => String(name || '?').split(/\s+/).map((p) => p[0]).join('').slice(0, 2).toUpperCase();

  function loadApp() {
    window.__paidiaAuthed = true;
    if (document.querySelector('script[data-paidia-app]')) return;
    const script = document.createElement('script');
    script.src = 'app.js?v=75';
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
    const note = (APP_BUILD.changed && (APP_BUILD.changed[lang] || APP_BUILD.changed.de)) || '';
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
          <div class="pa" style="background:#9bc4b0;margin:0;flex:0 0 auto">👥</div>
          <div><div class="pn" style="font-size:16px">${t('staff')}</div><div class="pr">${t('staffSub')}</div></div>
        </button>
        <button class="profile" type="button" data-mode="child" style="text-align:left;display:flex;gap:14px;align-items:center;padding:18px 16px">
          <div class="pa" style="background:#c5ddd0;margin:0;flex:0 0 auto">🎈</div>
          <div><div class="pn" style="font-size:16px">${t('child')}</div><div class="pr">${t('childSub')}</div></div>
        </button>
      </div>
      <div class="gate-build" role="status"><b>${esc(APP_BUILD.label)}</b><span>${esc(note)}</span></div>`;
    wireLang();
    body.querySelectorAll('[data-mode]').forEach((button) => {
      button.onclick = () => renderProfiles(button.dataset.mode);
    });
    fetch('build.json?v=' + APP_BUILD.version, { cache: 'no-store' }).then((r) => r.ok ? r.json() : null).then((data) => {
      if (!data || !data.label) return;
      Object.assign(APP_BUILD, data);
      const el = body.querySelector('.gate-build');
      if (el) {
        const n = (APP_BUILD.changed && (APP_BUILD.changed[lang] || APP_BUILD.changed.de)) || '';
        el.innerHTML = `<b>${esc(APP_BUILD.label)}</b><span>${esc(n)}</span>`;
      }
    }).catch(() => {});
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
      ${mode === 'child' ? `<p class="muted" style="font-size:12px;line-height:1.4;margin:0 0 12px">${esc(t('childInstall'))}</p>` : ''}
      <div class="profiles">
        ${people.map((person) => `
          <button class="profile" type="button" data-p="${person.id}">
            <div class="pa" style="background:${safeColor(person.color)}">${initials(person.name)}</div>
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

  function biometricLabel() {
    const ua = navigator.userAgent || '';
    if (/iPhone|iPad|iPod/i.test(ua)) return t('bioFace');
    if (/Android/i.test(ua)) return t('bioFinger');
    if (/Macintosh|Mac OS/i.test(ua)) return t('bioFace');
    if (/Windows/i.test(ua)) return 'Windows Hello';
    return t('bioPasskey');
  }

  function passkeyCapable() {
    return window.isSecureContext && !!window.PublicKeyCredential && !!navigator.credentials;
  }

  const b64ToBytes = (value) => {
    const base64 = String(value).replace(/-/g, '+').replace(/_/g, '/').padEnd(Math.ceil(String(value).length / 4) * 4, '=');
    return Uint8Array.from(atob(base64), (c) => c.charCodeAt(0));
  };
  const bytesToB64 = (value) => {
    if (value === null || value === undefined) return null;
    const bytes = new Uint8Array(value);
    let binary = '';
    bytes.forEach((b) => { binary += String.fromCharCode(b); });
    return btoa(binary).replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, '');
  };
  function decodePublicKeyOptions(options) {
    const out = structuredClone(options);
    out.challenge = b64ToBytes(out.challenge);
    if (out.user?.id) out.user.id = b64ToBytes(out.user.id);
    for (const key of ['allowCredentials', 'excludeCredentials']) {
      if (out[key]) out[key] = out[key].map((c) => ({ ...c, id: b64ToBytes(c.id) }));
    }
    return out;
  }
  function publicKeyCredentialJSON(credential) {
    const response = credential.response;
    const value = {
      id: credential.id,
      rawId: bytesToB64(credential.rawId),
      type: credential.type,
      authenticatorAttachment: credential.authenticatorAttachment || null,
      clientExtensionResults: credential.getClientExtensionResults?.() || {},
      response: { clientDataJSON: bytesToB64(response.clientDataJSON) },
    };
    if (response.attestationObject) value.response.attestationObject = bytesToB64(response.attestationObject);
    if (response.authenticatorData) value.response.authenticatorData = bytesToB64(response.authenticatorData);
    if (response.signature) value.response.signature = bytesToB64(response.signature);
    if ('userHandle' in response) value.response.userHandle = bytesToB64(response.userHandle);
    if (response.getTransports) value.response.transports = response.getTransports();
    return value;
  }

  async function passkeyApi(path, payload) {
    const response = await fetch(path, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      credentials: 'same-origin',
      body: JSON.stringify(payload),
    });
    const data = await response.json().catch(() => ({ error: 'Invalid server response' }));
    if (!response.ok) {
      const error = new Error(data.error || 'Passkey request failed');
      error.status = response.status;
      error.code = data.code;
      throw error;
    }
    return data;
  }

  function renderPin(who, mode) {
    let buf = '';
    let busy = false;
    let succeeded = false;
    body.innerHTML = `
      <div class="gate-pin">
        <div class="pa" style="background:${safeColor(who.color)}">${initials(who.name)}</div>
        <h3>${esc(who.name)}</h3>
        <div class="sub">${who.role ? esc(who.role) + ' · ' : ''}${t('pin')}</div>
        <button class="passkey-btn primary-bio" id="gPasskey" type="button" hidden>🔐 <span><b>${esc(biometricLabel())}</b><span class="pk-sub">${esc(t('bioHint'))}</span></span></button>
        <div class="pin-divider" id="gPinDivider" hidden>${t('pinFallback')}</div>
        <div class="pindots" id="gpd"></div>
        <input class="pin-field" id="gPinInput" type="password" inputmode="numeric" pattern="[0-9]*"
          maxlength="6" autocomplete="one-time-code" enterkeyhint="done" aria-label="PIN" value="">
        <div id="gpErr" style="min-height:18px;color:#f87171;font-size:12.5px" role="alert"></div>
        <div class="pinpad" id="gPinpad" role="group" aria-label="PIN">
          ${[1, 2, 3, 4, 5, 6, 7, 8, 9].map((n) => `<button type="button" data-k="${n}">${n}</button>`).join('')}
          <button type="button" data-k="del" aria-label="Backspace">⌫</button>
          <button type="button" data-k="0">0</button>
          <button type="button" data-k="clr" aria-label="Clear">C</button>
        </div>
        <div class="gate-sticky-actions">
          <button class="btn" id="gLogin" type="button">${t('login')}</button>
        </div>
        <button class="gate-forgot" id="gForgot" type="button">${t('forgot')}</button>
        <div class="muted" style="margin-top:10px;font-size:11.5px">${t('hint')}</div>
        <button class="gate-back" type="button" id="gBack">${t('back')}</button>
      </div>
      <div class="gate-build" role="status"><b>${esc(APP_BUILD.label)}</b><span>${esc((APP_BUILD.changed && (APP_BUILD.changed[lang] || APP_BUILD.changed.de)) || '')}</span></div>`;

    const input = body.querySelector('#gPinInput');
    const errorEl = body.querySelector('#gpErr');
    const loginBtn = body.querySelector('#gLogin');
    const pad = body.querySelector('#gPinpad');
    const draw = () => {
      body.querySelector('#gpd').innerHTML = [0, 1, 2, 3, 4, 5]
        .map((i) => `<i class="${i < buf.length ? 'f' : ''}${busy && i < buf.length ? ' busy' : ''}"></i>`).join('');
      if (input.value !== buf) input.value = buf;
    };
    draw();

    const setControlsEnabled = (enabled) => {
      loginBtn.disabled = !enabled;
      input.disabled = !enabled;
      pad.querySelectorAll('button').forEach((b) => { b.disabled = !enabled; });
      const pk = body.querySelector('#gPasskey');
      if (pk) pk.disabled = !enabled;
    };

    const showPasskey = () => {
      const button = body.querySelector('#gPasskey');
      const divider = body.querySelector('#gPinDivider');
      if (!button || !divider) return;
      button.hidden = false;
      button.classList.add('on');
      divider.hidden = false;
      divider.style.display = 'flex';
    };
    if (passkeyCapable()) {
      showPasskey();
      PublicKeyCredential.isUserVerifyingPlatformAuthenticatorAvailable?.().then((available) => {
        if (available) showPasskey();
      }).catch(() => {});
    }

    const finish = async () => {
      if (busy || succeeded) return;
      if (buf.length < 4) {
        errorEl.textContent = t('wrong');
        return;
      }
      busy = true;
      setControlsEnabled(false);
      loginBtn.textContent = t('loading');
      errorEl.textContent = '';
      draw();
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
          errorEl.textContent = t('unavailable');
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
        succeeded = true;
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
        if (!succeeded) {
          busy = false;
          loginBtn.textContent = t('login');
          setControlsEnabled(true);
          draw();
          try { input.focus(); } catch (error) {}
        }
      }
    };

    const finishPasskey = async () => {
      if (busy || succeeded || !passkeyCapable()) return;
      busy = true;
      setControlsEnabled(false);
      errorEl.textContent = '';
      try {
        const options = await passkeyApi('/api/auth/passkey/login/options', { mode, profileId: who.id });
        const publicKey = decodePublicKeyOptions(options.publicKey);
        const credential = await navigator.credentials.get({ publicKey });
        await passkeyApi('/api/auth/passkey/login/verify', {
          ceremonyId: options.ceremonyId,
          credential: publicKeyCredentialJSON(credential),
        });
        succeeded = true;
        window.__paidiaAuthed = true;
        try { loadApp(); } catch (error) { location.replace('/?in=' + Date.now()); }
        return;
      } catch (error) {
        if (error.name === 'NotAllowedError') errorEl.textContent = t('bioFail');
        else if (error.code === 'no_passkey') errorEl.textContent = t('bioSetupNeeded');
        else if (error.code === 'passkey_unavailable' || error.code === 'configuration') errorEl.textContent = t('bioUnavailable');
        else errorEl.textContent = t('bioFail');
      } finally {
        if (!succeeded) {
          busy = false;
          setControlsEnabled(true);
        }
      }
    };

    const push = (key) => {
      if (busy || succeeded) return;
      if (key === 'del') buf = buf.slice(0, -1);
      else if (key === 'clr') buf = '';
      else if (/^\d$/.test(key) && buf.length < 6) buf += key;
      draw();
      if (buf.length === 6) finish();
    };

    body.querySelector('#gBack').onclick = () => renderProfiles(mode);
    body.querySelector('#gForgot').onclick = () => renderResetRequest(who, mode);
    body.querySelector('#gPasskey').onclick = finishPasskey;
    pad.onclick = (event) => {
      const button = event.target.closest('button[data-k]');
      if (!button || button.disabled) return;
      event.preventDefault();
      push(button.dataset.k);
    };
    loginBtn.onclick = finish;
    input.addEventListener('input', () => {
      if (busy || succeeded) return;
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
          <p>${t('resetNeedProfileEmail')}</p>
        </div>
        <div class="pa" style="background:${safeColor(who.color)};margin:14px auto 0">${initials(who.name)}</div>
        <div class="sub" style="margin-top:8px">${esc(who.name)}</div>
        <label class="gate-field"><span>${t('email')}</span>
          <input type="email" id="resetEmail" autocomplete="email" inputmode="email" placeholder="name@example.com"></label>
        <div class="gate-status" id="resetStatus" role="status" aria-live="polite"></div>
        <button class="btn" id="resetSend" type="button">${t('sendLink')}</button>
        <button class="gate-back" type="button" id="resetBack">${t('resetBackPin')}</button>
      </div>`;
    const status = body.querySelector('#resetStatus');
    const button = body.querySelector('#resetSend');
    body.querySelector('#resetBack').onclick = () => renderPin(who, mode);
    fetch('/api/auth/health', { credentials: 'same-origin' }).then((r) => r.json()).then((health) => {
      if (health?.pinResetReady === false || health?.emailConfigured === false) {
        setGateStatus(status, t('resetUnavailable'), 'error');
        button.disabled = true;
        button.dataset.locked = '1';
      }
    }).catch(() => {});
    button.onclick = async () => {
      const email = body.querySelector('#resetEmail').value.trim();
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
        if (!button.dataset.locked) button.disabled = false;
      }
    };
    setTimeout(() => body.querySelector('#resetEmail')?.focus(), 40);
  }

  function renderResetForm(token) {
    // Strip token from URL immediately so it does not linger in history/referrers.
    try { history.replaceState({}, '', location.pathname + location.hash); } catch (error) {}
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
    body.querySelector('#resetHome').onclick = () => renderEntrance();
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
        if (!response.ok) {
          if (response.status === 507 || data.code === 'storage') {
            setGateStatus(status, t('storageFail'), 'error');
            return;
          }
          throw new Error(data.code || String(response.status));
        }
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
      bootSettled = true;
      renderResetForm(resetToken);
      return;
    }
    // Only fall back to entrance after the session probe finishes (or hard timeout).
    const bootTimer = setTimeout(() => {
      if (!bootSettled) {
        bootSettled = true;
        renderEntrance();
      }
    }, 4500);
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
        bootSettled = true;
        clearTimeout(bootTimer);
        loadApp();
        return;
      }
    } catch (error) {
      /* fall through to login */
    }
    if (!bootSettled) {
      bootSettled = true;
      clearTimeout(bootTimer);
      renderEntrance();
    }
  }

  window.PaidiaGate = { start, loadApp, renderResetForm, renderResetRequest };
  start();
})();
