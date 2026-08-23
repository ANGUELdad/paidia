import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';

const app = readFileSync(new URL('../app.js', import.meta.url), 'utf8');

test('shift calendar lookup uses the shift row being iterated', () => {
  assert.match(app, /description:\[s\.type, s\.note\]/);
  assert.doesNotMatch(app, /description:\[shift\.type, s\.note\]/);
});

test('calendar files declare the operational timezone', () => {
  assert.match(app, /X-WR-TIMEZONE:Europe\/Athens/);
  assert.match(app, /DTSTART;TZID=Europe\/Athens:/);
  assert.match(app, /DTEND;TZID=Europe\/Athens:/);
});

test('ordinary overnight shifts are included in presence lookup', () => {
  assert.match(app, /const previousOvernight = shiftsOf\(employeeId, yDay\)/);
  assert.match(app, /shiftBounds\(s, yesterday\)\.end >= now/);
});

test('failed notification deliveries are retried instead of marked seen', () => {
  assert.match(app, /async function showAppNotification/);
  assert.match(app, /if\(delivered\) setNotifPrefs/);
  assert.doesNotMatch(app, /showAppNotification\([^;]+;\s*setNotifPrefs\(\{seen:/s);
});

test('shift end posts one recorded automatic handoff', () => {
  assert.match(app, /async function sendAutomaticShiftHandoff/);
  assert.match(app, /await talkApi\('send',\{text:message\}\)/);
  assert.match(app, /if\(shiftHandoffRecord\(employeeId,dateStr\)\) return true/);
});
