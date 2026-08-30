import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import vm from 'node:vm';

const appSrc = readFileSync(new URL('../app.js', import.meta.url), 'utf8');

test('render paths are wrapped to toast instead of white-screen', () => {
  assert.match(appSrc, /function normalizeDbShape\(/);
  assert.match(appSrc, /function pageRenderFallbackHtml\(/);
  assert.match(appSrc, /function staffViewHtml\(/);
  assert.match(appSrc, /function childViewHtml\(/);
  assert.match(appSrc, /try\{\s*html = staffViewHtml\(\)/);
  assert.match(appSrc, /try\{\s*viewBody = childViewHtml\(c\)/);
  assert.match(appSrc, /toast\(t\('unexpectedError'\)/);
});

test('collection helpers tolerate missing arrays', () => {
  assert.match(appSrc, /const kid = id => \(DB\.children\|\|\[\]\)\.find/);
  assert.match(appSrc, /const emp = id => \(DB\.employees\|\|\[\]\)\.find/);
  assert.match(appSrc, /const ACTS = \(\) => \[\.\.\.\(DB\.activities\|\|\[\]\), \.\.\.\(DB\.customActivities\|\|\[\]\)\]/);
  assert.match(appSrc, /const PRODUCTS = \(\) => \[\.\.\.\(DB\.products\|\|\[\]\)\.map/);
  assert.match(appSrc, /const house = id => \(DB\.houses\|\|\[\]\)\.find/);
  assert.match(appSrc, /shopHouse\s*=\s*\(\)\s*=>/);
  assert.match(appSrc, /DB\.houses\[0\]\?\.id/);
  assert.match(appSrc, /houseShort\(hid\)/);
  assert.match(appSrc, /ROUTE_TABS = \[[^\]]*['"]kids['"]/);
});

test('view functions exist for every staff + kids surface', () => {
  for (const name of [
    'viewHome','viewGallery','viewSchedule','viewStock','viewShop','viewBook','viewTalk',
    'viewKids','viewKidProfile','viewAttendanceGrid','viewHomeworkStaff','viewSchoolTimetable',
    'renderChild','childStartView','childStundenplanView','childAufgabenView','childRewardsView',
    'childGamesView','childBewertungenView','childBonusView','childNotizenView','childEventsView',
  ]) {
    assert.match(appSrc, new RegExp(`function ${name}\\(`));
  }
});

test('normalizeDbShape coerces corrupt mutable buckets', () => {
  const start = appSrc.indexOf('function normalizeDbShape');
  assert.ok(start >= 0);
  let depth = 0, end = -1;
  for (let i = start; i < appSrc.length; i++) {
    const ch = appSrc[i];
    if (ch === '{') depth++;
    else if (ch === '}') {
      depth--;
      if (depth === 0) { end = i + 1; break; }
    }
  }
  assert.ok(end > start);
  const fn = appSrc.slice(start, end);
  const snippet = `
    const SEED = {
      houses:[{id:'h1',short:'K'}], employees:[{id:'e1',name:'A'}], children:[{id:'k1',name:'B'}],
      activities:[{id:'a1',de:'X',el:'X'}], products:[{id:'p1',de:'Y',el:'Y',unit:'Stk',cat:'c1'}],
      categories:[{id:'c1',de:'C',el:'C'}], reasons:[{id:'r1',de:'R',el:'R'}],
      chores:[{id:'ch1',de:'Z',el:'Z',xp:1}],
    };
    ${fn}
    const db = {
      events:null, listEntries:undefined, stock:[], log:false, gameStats:null,
      chores:null, customActivities:null, weeks:null,
    };
    normalizeDbShape(db);
    ({
      eventsIsArray: Array.isArray(db.events),
      listIsArray: Array.isArray(db.listEntries),
      stockIsObject: db.stock && !Array.isArray(db.stock) && typeof db.stock === 'object',
      logIsArray: Array.isArray(db.log),
      gameStatsObject: db.gameStats && typeof db.gameStats === 'object' && !Array.isArray(db.gameStats),
      choresLen: Array.isArray(db.chores) && db.chores.length > 0,
      housesLen: Array.isArray(db.houses) && db.houses.length > 0,
      childrenLen: Array.isArray(db.children) && db.children.length > 0,
    });
  `;
  const result = vm.runInNewContext(snippet, { structuredClone }, { timeout: 1000 });
  assert.equal(result.eventsIsArray, true);
  assert.equal(result.listIsArray, true);
  assert.equal(result.stockIsObject, true);
  assert.equal(result.logIsArray, true);
  assert.equal(result.gameStatsObject, true);
  assert.equal(result.choresLen, true);
  assert.equal(result.housesLen, true);
  assert.equal(result.childrenLen, true);
});

test('no remaining house(hid).short crash pattern in app.js', () => {
  assert.doesNotMatch(appSrc, /house\(hid\)\.short/);
});
