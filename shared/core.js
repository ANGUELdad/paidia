/**
 * Paidia shared core — shell-agnostic helpers (no layout chrome).
 * UI shells (mobile / desk) and legacy app.js consume this via window.PaidiaCore.
 */
(function (global) {
  'use strict';

  const Core = {
    version: Number(new URL(document.currentScript.src, location.href).searchParams.get('v')) || 228,
    shell() {
      if (global.__PAIDIA_SHELL__) return global.__PAIDIA_SHELL__;
      if (global.PaidiaShell) return global.PaidiaShell.detect();
      return 'm';
    },
    isDesk() {
      return this.shell() === 'desk';
    },
    isMobile() {
      return this.shell() !== 'desk';
    },
    async fetchJson(path, options) {
      const opts = Object.assign({ credentials: 'same-origin' }, options || {});
      const res = await fetch(path, opts);
      const text = await res.text();
      let data = null;
      try {
        data = text ? JSON.parse(text) : null;
      } catch (e) {
        data = { raw: text };
      }
      if (!res.ok) {
        const err = new Error((data && (data.error || data.message)) || res.statusText || 'request_failed');
        err.status = res.status;
        err.data = data;
        throw err;
      }
      return data;
    },
    async session() {
      try {
        return await this.fetchJson('/api/auth/session');
      } catch (e) {
        return null;
      }
    },
    rootAsset(rel) {
      const clean = String(rel || '').replace(/^\.\//, '');
      if (clean.startsWith('/')) return clean;
      const onShell = !!(global.PaidiaShell && global.PaidiaShell.currentShellFromPath());
      return onShell ? '../' + clean : clean;
    },
  };

  global.PaidiaCore = Core;
})(typeof window !== 'undefined' ? window : globalThis);
