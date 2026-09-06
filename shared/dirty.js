/**
 * Shared unsaved-change flags for shells (mirrors app.js semantics for leave prompts).
 * app.js remains source of truth when loaded; this helps shell chrome before app boots.
 */
(function (global) {
  'use strict';
  const flags = {
    stockDraft: false,
    listPending: false,
    pocketCompose: false,
    accountDirty: false,
  };
  function any() {
    return !!(flags.stockDraft || flags.listPending || flags.pocketCompose || flags.accountDirty);
  }
  function set(key, on) {
    if (Object.prototype.hasOwnProperty.call(flags, key)) flags[key] = !!on;
  }
  global.PaidiaDirty = { flags, any, set };
  if (global.PaidiaCore) global.PaidiaCore.dirty = global.PaidiaDirty;
})(typeof window !== 'undefined' ? window : globalThis);
