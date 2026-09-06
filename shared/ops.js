/**
 * Shared ops/API surface — thin wrappers over PaidiaCore.fetchJson.
 * Heavy mutators stay in app.js until further extraction.
 */
(function (global) {
  'use strict';
  const Core = global.PaidiaCore;
  if (!Core) return;

  async function getOps(since) {
    const q = since != null ? ('?since=' + encodeURIComponent(String(since))) : '';
    return Core.fetchJson('/api/ops' + q);
  }

  async function putOps(body) {
    return Core.fetchJson('/api/ops', {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body || {}),
    });
  }

  Core.ops = { get: getOps, put: putOps };
  global.PaidiaOps = Core.ops;
})(typeof window !== 'undefined' ? window : globalThis);
