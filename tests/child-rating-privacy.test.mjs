import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';

const app = readFileSync(new URL('../app.js', import.meta.url), 'utf8');
const server = readFileSync(new URL('../server.py', import.meta.url), 'utf8');
const vercel = readFileSync(new URL('../api/index.py', import.meta.url), 'utf8');

test('staff ratings are persisted as staff-owned ops data', () => {
  assert.match(server, /OPS_KEYS = \([\s\S]*"staffKidRatings"/);
  assert.match(server, /"staffKidRatings": 12000/);
});

test('child ops responses remove raw evaluator records', () => {
  assert.match(server, /def get_ops_for_session\([\s\S]*payload\.pop\("staffKidRatings", None\)/);
  assert.match(server, /payload\["staffKidRatingSummaries"\] = staff_rating_summaries_for_kid/);
  assert.match(server, /self\.json_response\(200, get_ops_for_session\(since, session\)\)/);
  assert.match(vercel, /paidia\.get_ops_for_session\(since, session\)/);
});

test('child client uses anonymous summaries and purges old raw cache', () => {
  assert.match(app, /if\(state\.mode==='child'\)[\s\S]*DB\.staffKidRatings=\[\]/);
  assert.match(app, /DB\.staffKidRatingSummaries=Array\.isArray\(data\.staffKidRatingSummaries\)/);
  assert.match(app, /function staffKidWeeklySummary[\s\S]*DB\.staffKidRatingSummaries/);
  assert.match(app, /function renderChild\(\)[\s\S]*DB\.staffKidRatings=\[\]/);
});
