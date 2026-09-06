/**
 * Shared i18n helpers (shell-agnostic). Full dictionaries remain in app.js `T`.
 */
(function (global) {
  'use strict';
  const LANG_KEY = 'paidia.lang';
  function getLang() {
    try {
      return localStorage.getItem(LANG_KEY) === 'el' ? 'el' : 'de';
    } catch (e) {
      return 'de';
    }
  }
  function setLang(lang) {
    const l = lang === 'el' ? 'el' : 'de';
    try {
      localStorage.setItem(LANG_KEY, l);
    } catch (e) {}
    try {
      document.documentElement.lang = l;
    } catch (e) {}
    return l;
  }
  global.PaidiaI18n = { getLang, setLang, LANG_KEY };
  if (global.PaidiaCore) {
    global.PaidiaCore.getLang = getLang;
    global.PaidiaCore.setLang = setLang;
  }
})(typeof window !== 'undefined' ? window : globalThis);
