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

test('profile calendar primary action downloads without another sheet', () => {
  assert.match(app, /function saveProfileCalendar/);
  assert.match(app, /querySelector\('#openMyCalendar'\)\.onclick=\(\)=>\{[\s\S]*?saveProfileCalendar\(who\.id,mode\)/);
});

test('required journal resumes the interrupted shift-end workflow', () => {
  assert.match(app, /state\._resumeShiftEnd=true/);
  assert.match(app, /if\(state\._resumeShiftEnd\)[\s\S]*?setTimeout\(\(\)=>sheetShiftEnd\(\),160\)/);
});

test('handoff resolves and names the next scheduled shift', () => {
  assert.match(app, /function nextShiftCoverage/);
  assert.match(app, /next\.people\.map\(person=>person\.name\)/);
  assert.match(app, /nextLine/);
});

test('late check-ins persist an administrator alert with the reason', () => {
  assert.match(app, /DB\.profilePrefs\._lateAlerts\[checkin\.id\]/);
  assert.match(app, /reason:checkin\.reason/);
  assert.match(app, /function sheetLateAlert/);
});

test('notification enablement fails when the test cannot be delivered', () => {
  assert.match(app, /const delivered=await showAppNotification\(t\('notifTest'\)/);
  assert.match(app, /if\(!delivered\) return false/);
});
