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
      location.replace('/?needLogin=1');
      return;
    }
    if (session && session.authenticated) global.__paidiaBootSession = session;

    const gate = document.getElementById('gate');
    const app = document.getElementById('app');
    if (gate) gate.classList.remove('on');
    document.body.classList.remove('auth-pending');
    if (app) app.hidden = false;

    const ver = (global.PaidiaCore && global.PaidiaCore.version) || 218;
    const appSrc = (global.PaidiaCore && global.PaidiaCore.rootAsset('app.js?v=' + ver)) || ('../app.js?v=' + ver);

    await loadScript(appSrc);
    patchSyncLayoutMode();
    applyLayoutLock();
    if (typeof global.syncLayoutMode === 'function') global.syncLayoutMode();

    /* Soft prompt when viewport crosses shells (once per session) */
    try {
      if (!sessionStorage.getItem('paidia.shellPrompted')) {
        const mq = window.matchMedia('(min-width:1024px)');
        const onChange = () => {
          const want = global.PaidiaShell.detect();
          const here = global.PaidiaShell.currentShellFromPath();
          if (want !== here && !global.PaidiaShell.override()) {
            sessionStorage.setItem('paidia.shellPrompted', '1');
            const msg =
              (document.documentElement.lang || '').indexOf('el') === 0
                ? 'Άλλη διάταξη ταιριάζει καλύτερα. Αλλαγή;'
                : 'Eine andere Ansicht passt besser. Wechseln?';
            if (window.confirm(msg)) {
              global.PaidiaShell.setOverride(want);
              global.PaidiaShell.go(want);
            }
          }
        };
        if (mq.addEventListener) mq.addEventListener('change', onChange);
        else if (mq.addListener) mq.addListener(onChange);
      }
    } catch (e) {}
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
