/**
 * Paidia shell router — mobile (/m/) vs desktop (/desk/).
 * Override: localStorage paidia.shell = 'm' | 'desk'
 */
(function (global) {
  'use strict';

  const KEY = 'paidia.shell';
  const BOOT_KEY = 'paidia.bootSession';

  function override() {
    try {
      const v = String(localStorage.getItem(KEY) || '').toLowerCase();
      if (v === 'm' || v === 'mobile') return 'm';
      if (v === 'desk' || v === 'desktop' || v === 'pc') return 'desk';
    } catch (e) {}
    return null;
  }

  function setOverride(shell) {
    try {
      if (shell === 'm' || shell === 'desk') localStorage.setItem(KEY, shell);
      else localStorage.removeItem(KEY);
    } catch (e) {}
  }

  function detect() {
    const forced = override();
    if (forced) return forced;
    try {
      const wide = window.matchMedia('(min-width:1024px)').matches;
      const fine = window.matchMedia('(pointer:fine)').matches;
      const aspectOk = window.matchMedia('(min-aspect-ratio: 4/3)').matches;
      if (wide && (fine || aspectOk)) return 'desk';
    } catch (e) {}
    return 'm';
  }

  function pathFor(shell) {
    return shell === 'desk' ? '/desk/' : '/m/';
  }

  function currentShellFromPath() {
    const p = String(location.pathname || '');
    if (p === '/desk' || p.indexOf('/desk/') === 0) return 'desk';
    if (p === '/m' || p.indexOf('/m/') === 0) return 'm';
    return null;
  }

  function lock(shell) {
    const s = shell === 'desk' ? 'desk' : 'm';
    global.__PAIDIA_SHELL__ = s;
    try {
      document.documentElement.dataset.shell = s;
      document.body && document.body.setAttribute('data-shell', s);
      document.body && document.body.classList.add('shell-' + s, 'paidia-shell');
    } catch (e) {}
    return s;
  }

  function stashBootSession(data) {
    try {
      sessionStorage.setItem(BOOT_KEY, JSON.stringify(data == null ? null : data));
    } catch (e) {}
  }

  function takeBootSession() {
    try {
      const raw = sessionStorage.getItem(BOOT_KEY);
      sessionStorage.removeItem(BOOT_KEY);
      if (!raw || raw === 'null') return null;
      return JSON.parse(raw);
    } catch (e) {
      return null;
    }
  }

  function go(shell, { replace } = { replace: true }) {
    const s = shell === 'desk' ? 'desk' : 'm';
    const target = pathFor(s) + (location.search || '') + (location.hash || '');
    const here = currentShellFromPath();
    if (here === s) {
      lock(s);
      return false;
    }
    if (replace) location.replace(target);
    else location.assign(target);
    return true;
  }

  function routeAfterAuth(bootData) {
    if (bootData) stashBootSession(bootData);
    const s = detect();
    lock(s);
    return go(s, { replace: true });
  }

  function ensureOnShellPage() {
    const here = currentShellFromPath();
    if (here) {
      lock(here);
      return here;
    }
    return null;
  }

  global.PaidiaShell = {
    KEY,
    detect,
    override,
    setOverride,
    pathFor,
    currentShellFromPath,
    lock,
    go,
    routeAfterAuth,
    stashBootSession,
    takeBootSession,
    ensureOnShellPage,
  };
})(typeof window !== 'undefined' ? window : globalThis);
