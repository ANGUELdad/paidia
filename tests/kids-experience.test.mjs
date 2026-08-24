import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';

const app = readFileSync(new URL('../app.js', import.meta.url), 'utf8');
const html = readFileSync(new URL('../index.html', import.meta.url), 'utf8');

test('staff and child views use one school progress summary', () => {
  assert.match(app, /function childProgressSummary\(kidId\)/);
  assert.match(app, /gradeAverage,gradedCount/);
  assert.match(app, /attendancePct,attendanceRecorded/);
  assert.match(app, /homeworkDone,homeworkOpen/);
  assert.match(app, /function viewKidProfile[\s\S]*childProgressSummary\(k\.id\)/);
  assert.match(app, /function childSchoolSnapshotHtml[\s\S]*childProgressSummary\(kidId\)/);
});

test('staff child cards surface school and game signals', () => {
  assert.match(app, /kid-dir-metrics/);
  assert.match(app, /summary\.gradeAverage/);
  assert.match(app, /summary\.attendancePct/);
  assert.match(app, /summary\.homeworkOpen/);
  assert.match(app, /summary\.game\.wins/);
});

test('game bests and launches are synchronized per child', () => {
  assert.match(app, /stats\.bests=\{\.\.\.\(stats\.bests\|\|\{\}\),\[id\]:score\}/);
  assert.match(app, /stats\.plays=\{\.\.\.\(stats\.plays\|\|\{\}\),\[id\]:Number\(stats\.plays\?\.\[id\]\|\|0\)\+1\}/);
  assert.match(app, /writeGameBest\('react',ms,\{lower:true\}\)/);
});

test('child home exposes school and personalized game challenge', () => {
  assert.match(app, /childSchoolSnapshotHtml\(c\.id\)/);
  assert.match(app, /childGameChallengeHtml\(c\.id\)/);
  assert.match(app, /data-game-challenge/);
  assert.match(app, /state\.childView='games'/);
});

test('responsive kids dashboard styles exist', () => {
  assert.match(html, /\.kids-overview\{/);
  assert.match(html, /\.kid-profile-kpis\{/);
  assert.match(html, /\.child-school-card\{/);
  assert.match(html, /\.child-game-challenge\{/);
});
