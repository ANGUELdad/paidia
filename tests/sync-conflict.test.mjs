/**
 * Regression tests for the /api/ops conflict path.
 *
 * History: the client's 409 branch used to adopt the server's *revision* but
 * restore its own *data* over the top, then retry — which passed the revision
 * check and silently destroyed everything the other device had written across
 * all SHARED_KEYS, including shiftCheckins (clock-in records) and
 * shiftNotes (handover). Last-write-wins wearing an optimistic-concurrency
 * costume.
 *
 * app.js now merges per record via mergeShared(). These tests extract that
 * real function from app.js rather than re-implementing it, so they fail if
 * the shipped behaviour regresses.
 *
 * Run:  node --test tests/sync-conflict.test.mjs
 */
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';

// ── load the real mergeShared() out of app.js ───────────────────────────────
const src = readFileSync(new URL('../app.js', import.meta.url), 'utf8');
const start = src.indexOf('function mergeShared(');
assert.ok(start > -1, 'mergeShared() missing from app.js — the fix was reverted');
// walk braces to find the end of the function
let depth = 0, end = -1;
for (let i = src.indexOf('{', start); i < src.length; i++) {
  if (src[i] === '{') depth++;
  else if (src[i] === '}') { depth--; if (depth === 0) { end = i + 1; break; } }
}
const SHARED_DICT_KEYS = new Set(['stock','profilePrefs','productOverrides','weeks','shiftNotes']);
const mergeShared = new Function(
  'SHARED_DICT_KEYS',
  `${src.slice(start, end)}; return mergeShared;`
)(SHARED_DICT_KEYS);

const SHARED_KEYS = [
  'listEntries','shoppingTrips','stock','customProducts','customCategories',
  'customReasons','customListRemoveReasons','productOverrides','profilePrefs',
  'template','overrides','weeks','events','taskCompletions','aiImports','log',
  'customActivities','shiftNotes','stockChecks','shiftCheckins',
  'xpLog','gameStats','kidRatings','staffKidRatings','kidNotes','subjects',
  'subjectGrades','attendance','homework','schoolTimetable',
];

/** The server's rule, as implemented in put_ops(). */
function serverPut(server, payload) {
  if (Number(payload.revision) !== Number(server.revision)) {
    return { status: 409, body: { ...server, code: 'conflict' } };
  }
  const next = { revision: server.revision + 1 };
  for (const k of SHARED_KEYS) next[k] = payload[k] ?? server[k];
  return { status: 200, body: next };
}

/** The client's 409 branch, using the real mergeShared(). */
function clientPush(db, revision, server) {
  const payload = { revision };
  for (const k of SHARED_KEYS) payload[k] = db[k];
  let res = serverPut(server, payload);

  if (res.status === 409) {
    const mine = {};
    for (const k of SHARED_KEYS) mine[k] = db[k];
    for (const k of SHARED_KEYS) db[k] = res.body[k];          // applySharedPayload
    for (const k of SHARED_KEYS) db[k] = mergeShared(k, db[k], mine[k]);
    const retry = { revision: res.body.revision };
    for (const k of SHARED_KEYS) retry[k] = db[k];
    res = serverPut(res.body, retry);
  }
  return res;
}

const blank = (extra = {}) => {
  const s = { revision: 0 };
  for (const k of SHARED_KEYS) s[k] = SHARED_DICT_KEYS.has(k) ? {} : [];
  return { ...s, ...extra };
};

test('server rejects a stale revision', () => {
  assert.equal(serverPut(blank({ revision: 5 }), { revision: 4 }).status, 409);
});

test('a conflict preserves the other device’s shopping list', () => {
  const server = blank({ revision: 1, listEntries: [{ id: 'b1', name: 'Windeln' }] });
  const deviceA = blank({ stock: { 'h1:milk': 4 } });

  const res = clientPush(deviceA, 0, server);
  assert.equal(res.status, 200);
  assert.ok(res.body.listEntries.some(e => e.name === 'Windeln'), 'B’s item survives');
  assert.equal(res.body.stock['h1:milk'], 4, 'A’s stock still applied');
});

test('a conflict never erases a clock-in record', () => {
  const server = blank({ revision: 1, shiftCheckins: [{ id: 'ci-b', who: 'Claudio' }] });
  const deviceA = blank({ shiftCheckins: [{ id: 'ci-a', who: 'Löhri' }] });

  const ids = clientPush(deviceA, 0, server).body.shiftCheckins.map(c => c.id).sort();
  assert.deepEqual(ids, ['ci-a', 'ci-b'], 'both clock-ins survive');
});

test('handover notes from both devices survive (dict key)', () => {
  const server = blank({ revision: 1, shiftNotes: { 'd1': { text: 'B note' } } });
  const deviceA = blank({ shiftNotes: { 'd2': { text: 'A note' } } });

  const notes = clientPush(deviceA, 0, server).body.shiftNotes;
  assert.deepEqual(Object.keys(notes).sort(), ['d1', 'd2']);
});

test('the audit log is unioned, not replaced', () => {
  const server = blank({ revision: 1, log: [{ id: 'l1', text: 'B did a thing' }] });
  const deviceA = blank({ log: [{ id: 'l2', text: 'A did a thing' }] });

  const ids = clientPush(deviceA, 0, server).body.log.map(l => l.id).sort();
  assert.deepEqual(ids, ['l1', 'l2'], 'audit trail must never lose entries');
});

test('same record edited on both devices — ours wins, siblings untouched', () => {
  const server = blank({
    revision: 1,
    listEntries: [{ id: 'x', name: 'Milch', qty: 2 }, { id: 'keep', name: 'Brot' }],
  });
  const deviceA = blank({ listEntries: [{ id: 'x', name: 'Milch', qty: 5 }] });

  const out = clientPush(deviceA, 0, server).body.listEntries;
  assert.equal(out.find(e => e.id === 'x').qty, 5, 'retrying device wins the record');
  assert.ok(out.some(e => e.id === 'keep'), 'untouched sibling preserved');
});

test('arrays without ids fall back to ours rather than guessing', () => {
  const theirs = [{ name: 'no id' }];
  const mine = [{ name: 'also no id' }];
  assert.deepEqual(mergeShared('customActivities', theirs, mine), mine);
});

test('undefined on either side is handled', () => {
  assert.deepEqual(mergeShared('listEntries', undefined, [{ id: 1 }]), [{ id: 1 }]);
  assert.deepEqual(mergeShared('listEntries', [{ id: 2 }], undefined), [{ id: 2 }]);
});

test('a dict key given an array does not corrupt into an array', () => {
  const out = mergeShared('stock', ['bogus'], { 'h1:milk': 3 });
  assert.equal(Array.isArray(out), false);
  assert.equal(out['h1:milk'], 3);
});
