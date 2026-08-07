/**
 * Design-scale conformance for index.html.
 *
 * Why this exists: the scales were normalised once already and drifted back —
 * 25 font sizes and 12 radii by the time it was measured again. Concurrent
 * edits reintroduce ad-hoc values (12.5px, 11px radius, 13px gaps) faster than
 * anyone notices. A guard that fails loudly is the only thing that holds a
 * design system in a codebase with more than one author.
 *
 * If you genuinely need a new step, add it to the scale here on purpose —
 * that is the point. What this prevents is adding one by accident.
 *
 * Run:  node --test tests/design-scale.test.mjs
 */
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';

const html = readFileSync(new URL('../index.html', import.meta.url), 'utf8');
const css = html.slice(
  html.indexOf('<style>') + '<style>'.length,
  html.indexOf('</style>'),
);

/** Body ramp + a separate display ramp for hero type. */
const TYPE = new Set([11, 12, 13, 14, 16, 18, 21, 26, 32, 48, 64, 80, 96]);
/** Four steps plus the pill. */
const RADIUS = new Set([6, 10, 14, 20, 999]);
/** 4px-based grid. */
const SPACE = new Set([2, 4, 8, 12, 16, 20, 24, 32]);

const uniq = (re, group = 1) => {
  const out = new Set();
  for (const m of css.matchAll(re)) out.add(parseFloat(m[group]));
  return [...out].sort((a, b) => a - b);
};

test('the stylesheet parses and is balanced', () => {
  assert.ok(css.length > 1000, 'stylesheet found');
  assert.equal(
    (css.match(/{/g) || []).length,
    (css.match(/}/g) || []).length,
    'unbalanced braces — a rule was left open',
  );
});

test('every font-size is on the type scale', () => {
  const sizes = uniq(/font-size:\s*([\d.]+)px/g);
  const off = sizes.filter(v => !TYPE.has(v));
  assert.deepEqual(off, [], `off-scale font sizes: ${off.join(', ')}`);
  assert.ok(sizes.length <= TYPE.size, `${sizes.length} distinct sizes in use`);
});

test('no text smaller than 11px', () => {
  const tiny = uniq(/font-size:\s*([\d.]+)px/g).filter(v => v < 11);
  assert.deepEqual(tiny, [], `unreadable on a phone: ${tiny.join(', ')}px`);
});

test('every border-radius component is on the radius scale', () => {
  const vals = new Set();
  for (const m of css.matchAll(/border-radius:\s*([^;}]+)/g)) {
    for (const n of m[1].matchAll(/([\d.]+)px/g)) vals.add(parseFloat(n[1]));
  }
  const off = [...vals].filter(v => !RADIUS.has(v)).sort((a, b) => a - b);
  assert.deepEqual(off, [], `off-scale radii: ${off.join(', ')}`);
});

test('gap and padding sit on the 4px grid', () => {
  const vals = uniq(/\b(?:gap|padding|margin-top|margin-bottom):\s*([\d.]+)px(?=[;}\s])/g);
  const off = vals.filter(v => !SPACE.has(v));
  assert.deepEqual(off, [], `off-grid spacing: ${off.join(', ')}`);
});

test('the design system stays small enough to be a system', () => {
  const fonts = uniq(/font-size:\s*([\d.]+)px/g).length;
  const radii = new Set();
  for (const m of css.matchAll(/border-radius:\s*([^;}]+)/g))
    for (const n of m[1].matchAll(/([\d.]+)px/g)) radii.add(parseFloat(n[1]));
  const space = uniq(/\b(?:gap|padding|margin-top|margin-bottom):\s*([\d.]+)px(?=[;}\s])/g).length;

  assert.ok(fonts <= 13, `${fonts} font sizes — a scale, not a palette`);
  assert.ok(radii.size <= 6, `${radii.size} radii`);
  assert.ok(space <= 9, `${space} spacing values`);
});

test('!important has not grown unchecked', () => {
  // 53 at the time this guard was written. Not a target — a ratchet.
  const n = (css.match(/!important/g) || []).length;
  assert.ok(n <= 60, `${n} !important declarations — specificity is being fought`);
});
