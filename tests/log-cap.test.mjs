/**
 * Tests for the client-side audit log cap.
 *
 * `DB.log` lives inside the shared `ops` blob (286 KB measured in production),
 * so unbounded growth means every save rewrites a steadily larger payload.
 * mergeShared() unions log entries on conflict rather than discarding them,
 * so without a cap the array only grows.
 *
 * These read LOG_KEEP and the trim line out of app.js so they fail if the cap
 * is removed, rather than testing a copy.
 *
 * Run:  node --test tests/log-cap.test.mjs
 */
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';

const src = readFileSync(new URL('../app.js', import.meta.url), 'utf8');

test('LOG_KEEP is defined in app.js', () => {
  const m = src.match(/const LOG_KEEP\s*=\s*(\d+)/);
  assert.ok(m, 'LOG_KEEP missing — the cap was removed');
  const n = Number(m[1]);
  assert.ok(n > 0, 'cap must be positive');
  assert.ok(n <= 2500, `client cap ${n} must not exceed the server cap of 2500`);
});

test('logEntry() trims after pushing', () => {
  const fn = src.slice(src.indexOf('function logEntry('));
  const body = fn.slice(0, fn.indexOf('\n}\n') + 3);
  assert.match(body, /DB\.log\.push\(/, 'still appends');
  assert.match(body, /DB\.log\.length > LOG_KEEP/, 'trims when over the cap');
  assert.ok(
    body.indexOf('DB.log.push(') < body.indexOf('LOG_KEEP'),
    'must push first, then trim — trimming first would drop the new entry',
  );
});

// Behavioural check against the same logic the app runs.
function makeLogger(keep) {
  const DB = { log: [] };
  return {
    DB,
    logEntry(text) {
      DB.log.push({ id: 'l' + DB.log.length, ts: Date.now(), text });
      if (DB.log.length > keep) DB.log = DB.log.slice(-keep);
    },
  };
}

test('log stays bounded under sustained writing', () => {
  const keep = Number(src.match(/const LOG_KEEP\s*=\s*(\d+)/)[1]);
  const { DB, logEntry } = makeLogger(keep);
  for (let i = 0; i < keep * 3; i++) logEntry('entry ' + i);
  assert.equal(DB.log.length, keep, 'never exceeds the cap');
});

test('the newest entries are the ones kept', () => {
  const keep = Number(src.match(/const LOG_KEEP\s*=\s*(\d+)/)[1]);
  const { DB, logEntry } = makeLogger(keep);
  for (let i = 0; i < keep + 10; i++) logEntry('entry ' + i);
  assert.equal(DB.log.at(-1).text, `entry ${keep + 9}`, 'newest retained');
  assert.equal(DB.log[0].text, 'entry 10', 'oldest 10 dropped, not the newest');
});

test('under the cap nothing is dropped', () => {
  const keep = Number(src.match(/const LOG_KEEP\s*=\s*(\d+)/)[1]);
  const { DB, logEntry } = makeLogger(keep);
  for (let i = 0; i < 5; i++) logEntry('entry ' + i);
  assert.equal(DB.log.length, 5);
});

test('a shift’s worth of activity fits comfortably', () => {
  // ~20 entries per shift, 3 shifts/day → the cap holds roughly a week.
  const keep = Number(src.match(/const LOG_KEEP\s*=\s*(\d+)/)[1]);
  const perDay = 20 * 3;
  assert.ok(keep / perDay >= 7, `cap holds ${(keep / perDay).toFixed(1)} days — want ≥7`);
});
