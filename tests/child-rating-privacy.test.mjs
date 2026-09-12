import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import vm from 'node:vm';

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
  const start=app.indexOf('function applySharedPayload(data){');
  const end=app.indexOf('\nasync function pullShared(',start);
  const DB={staffKidRatings:[{raterId:'private-staff',value:5}],staffKidRatingSummaries:[]};
  const context={DB,state:{mode:'child',child:{id:'k1'}},sharedRevision:0,kidPushPending:false,
    SHARED_KEYS:['staffKidRatings','staffKidRatingSummaries'],SHARED_DICT_KEYS:new Set(),
    sharedValueFingerprint:JSON.stringify,normalizeDbShape:()=>{},saveLocal:()=>{},localStorage:{setItem:()=>{}}};
  vm.runInNewContext(app.slice(start,end),context);
  context.applySharedPayload({revision:1,staffKidRatingSummaries:[{kidId:'k1',average:4}]});
  assert.equal(DB.staffKidRatings.length,0);
  assert.equal(DB.staffKidRatingSummaries[0].average,4);
  assert.equal(JSON.stringify(DB).includes('private-staff'),false);
});
