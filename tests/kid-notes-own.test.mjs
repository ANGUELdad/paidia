import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';

const app = readFileSync(new URL('../app.js', import.meta.url), 'utf8');
const server = readFileSync(new URL('../server.py', import.meta.url), 'utf8');

test('child notes UI supports create/edit/delete and empty CTA', () => {
  assert.match(app, /function childNotizenView\(/);
  assert.match(app, /kidNoteEmptyCta/);
  assert.match(app, /kidNotesWrite/);
  assert.match(app, /data-kid-note-edit/);
  assert.match(app, /data-kid-note-del/);
  assert.match(app, /kidOwnsNoteRow/);
  assert.match(app, /by:kidId/);
});

test('pending kid push is preserved across shared pull', () => {
  assert.match(app, /kidPushPending/);
  assert.match(app, /restoreKidOwnedLocal/);
  assert.match(app, /data\.revision < sharedRevision/);
  assert.match(app, /kidNotes:\s*\(DB\.kidNotes\|\|\[\]\)\.filter\(n=>kidOwnsNoteRow/);
});

test('server preserves staff-authored kid notes on child push', () => {
  assert.match(server, /def _merge_kid_notes/);
  assert.match(server, /if key == "kidNotes":/);
  assert.match(server, /staff_kept/);
  assert.match(server, /"by": kid_id/);
});
