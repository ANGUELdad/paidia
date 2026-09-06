/**
 * Bridge: lock layout to the active shell and boot app.js on /m or /desk pages.
 */
(function (global) {
  'use strict';

  function shellId() {
    return (global.PaidiaShell && global.PaidiaShell.ensureOnShellPage()) ||
      global.__PAIDIA_SHELL__ ||
      (global.PaidiaShell && global.PaidiaShell.detect()) ||
      'm';
  }

  function applyLayoutLock() {
    const s = shellId();
    const desk = s === 'desk';
    document.documentElement.dataset.shell = s;
    document.body.classList.add('paidia-shell', desk ? 'shell-desk' : 'shell-m');
    document.body.classList.toggle('layout-desktop', desk);
    document.body.classList.toggle('layout-mobile', !desk);
    document.body.setAttribute('data-shell', s);
  }

  function patchSyncLayoutMode() {
    const prev = global.syncLayoutMode;
    global.syncLayoutMode = function paidiaShellSyncLayoutMode() {
      const s = shellId();
      const desk = s === 'desk';
      document.body.classList.toggle('layout-desktop', desk);
      document.body.classList.toggle('layout-mobile', !desk);
      if (typeof prev === 'function') {
        try {
          /* Keep rail width / measure from original when desktop shell */
          if (desk) prev();
          else {
            document.documentElement.style.setProperty('--rail-w', '0px');
            if (typeof global.scheduleMeasureChrome === 'function') global.scheduleMeasureChrome();
          }
        } catch (e) {
          document.documentElement.style.setProperty('--rail-w', desk ? '220px' : '0px');
        }
      }
      applyLayoutLock();
    };
  }

  function loadScript(src) {
    return new Promise((resolve, reject) => {
      if (document.querySelector('script[data-paidia-app]')) {
        resolve();
        return;
      }
      const script = document.createElement('script');
      script.src = src;
      script.defer = true;
      script.dataset.paidiaApp = '1';
      script.onload = () => resolve();
      script.onerror = () => reject(new Error('app_load_failed'));
      document.body.appendChild(script);
    });
  }

  async function bootShellApp() {
    applyLayoutLock();
    /* Auto-pick the site for this device — no confirm dialog */
    try {
      if (global.PaidiaShell && global.PaidiaShell.autoCorrectToDevice()) return;
    } catch (e) {}
    const boot = global.PaidiaShell && global.PaidiaShell.takeBootSession();
    if (boot) global.__paidiaBootSession = boot;
    global.__paidiaAuthed = true;

    let session = boot;
    if (!session || !session.authenticated) {
      try {
        session = global.PaidiaCore ? await global.PaidiaCore.session() : null;
      } catch (e) {
        session = null;
      }
    }
    if (!(session && session.authenticated) && !boot) {
      try{sessionStorage.setItem('paidia.intendedDestination',location.pathname+location.search+location.hash);}catch{}
      location.replace('/?needLogin=1');
      return;
    }
    if (session && session.authenticated) global.__paidiaBootSession = session;

    const gate = document.getElementById('gate');
    const app = document.getElementById('app');
    if (gate) gate.classList.remove('on');
    document.body.classList.remove('auth-pending');
    if (app) app.hidden = false;

    const ver = (global.PaidiaCore && global.PaidiaCore.version) || 219;
    const appSrc = (global.PaidiaCore && global.PaidiaCore.rootAsset('app.js?v=' + ver)) || ('../app.js?v=' + ver);

    await loadScript(appSrc);
    patchSyncLayoutMode();
    applyLayoutLock();
    if (typeof global.syncLayoutMode === 'function') global.syncLayoutMode();
  }

  function start() {
    if (!global.PaidiaShell || !global.PaidiaShell.currentShellFromPath()) return;
    applyLayoutLock();
    if (document.readyState === 'loading') {
      document.addEventListener('DOMContentLoaded', () => {
        bootShellApp().catch((err) => {
          console.error(err);
          location.replace('/?boot=fail');
        });
      });
    } else {
      bootShellApp().catch((err) => {
        console.error(err);
        location.replace('/?boot=fail');
      });
    }
  }

  global.PaidiaBridge = { applyLayoutLock, patchSyncLayoutMode, bootShellApp, start };
  start();
})(typeof window !== 'undefined' ? window : globalThis);
