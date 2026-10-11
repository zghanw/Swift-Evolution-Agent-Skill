#!/usr/bin/env node
// Checks every SE citation in the hand-written files against the generated references/.
// Run `node scripts/sync.mjs --check` first so references/ matches the feed.
//
// Each citation needs an annotation the script can verify:
//   SE-0504 (6.4)  or  SE-0504 (Swift 6.4)  or  [SE-0504](link) (6.4)   for a proposal in a release
//   SE-0510 (unreleased)                                               for anything not in a release
// In a table row with a single SE id, a cell holding just the version (or `unreleased`) counts too.
//
// Usage: node scripts/validate.mjs [file ...]   (defaults to the hand-written files below)

import { readFile, readdir } from 'node:fs/promises';
import { dirname, join, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

const ROOT = join(dirname(fileURLToPath(import.meta.url)), '..');
const SKILL = 'skills/swift-evolution';
const FILES = [`${SKILL}/SKILL.md`, `${SKILL}/references/toolchain-detection.md`, 'README.md', 'AGENTS.md', 'tests/scenarios/README.md'];
const VERSION = /^(?:Swift\s+)?(\d+\.\d+(?:\.\d+)?)\+?$/i;
const UNAVAILABLE = /^(unreleased|not available|not yet available|accepted|in review|previewing|next|rejected|withdrawn|returned for revision)$/i;

// SE id -> version string for released proposals, null for proposals in no release.
export async function loadKnown(refs = join(ROOT, 'skills', 'swift-evolution', 'references')) {
  const known = new Map();
  for (const f of await readdir(join(refs, 'versions'))) {
    const text = await readFile(join(refs, 'versions', f), 'utf8');
    for (const m of text.matchAll(/^### (SE-\d{4}):/gm)) known.set(m[1], f.replace(/\.md$/, ''));
  }
  const inflight = await readFile(join(refs, 'in-flight.md'), 'utf8');
  for (const m of inflight.matchAll(/^(?:### |- \[)(SE-\d{4})/gm)) known.set(m[1], null);
  const lookup = await readFile(join(refs, 'lookup.md'), 'utf8');
  for (const m of lookup.match(/^Implemented, but the feed records no version: (.*)$/m)?.[1].matchAll(/SE-\d{4}/g) ?? []) {
    known.set(m[0], 'unknown');
  }
  if (known.size < 100) throw new Error('references/ looks empty; run node scripts/sync.mjs first');
  return known;
}

// Returns [{ line, message }] for one file's text.
export function checkText(text, known) {
  const errors = [];
  text.split(/\r?\n/).forEach((line, i) => {
    const ids = [...line.matchAll(/SE-\d{4}/g)];
    const cells = line.trim().startsWith('|') ? line.split('|').slice(1, -1).map((c) => c.trim()) : null;
    for (const m of ids) {
      const id = m[0];
      const err = (message) => errors.push({ line: i + 1, message: `${id}: ${message}` });
      if (!known.has(id)) { err('not in the Swift Evolution feed'); continue; }
      const v = known.get(id);
      const after = line.slice(m.index + id.length).replace(/^\]\([^)]*\)/, '');
      let note = after.match(/^\s*\(([^)]+)\)/)?.[1].trim();
      if (!note && cells && ids.length === 1) note = cells.find((c) => VERSION.test(c) || UNAVAILABLE.test(c));
      if (!note) { err(`add an annotation: ${id} (${v ?? 'unreleased'})`); continue; }
      if (UNAVAILABLE.test(note)) {
        if (v) err(`marked "${note}" but it shipped in Swift ${v}`);
      } else if (VERSION.test(note)) {
        const claimed = note.match(VERSION)[1];
        if (v === null) err(`presented as available in Swift ${claimed}, but it is not in any release`);
        else if (claimed !== v) err(`claims Swift ${claimed}; the feed says ${v}`);
      } else {
        err(`unrecognized annotation "(${note})"; use (X.Y) or (unreleased)`);
      }
    }
  });
  return errors;
}

if (process.argv[1] && fileURLToPath(import.meta.url) === resolve(process.argv[1])) {
  const known = await loadKnown();
  const files = process.argv.length > 2 ? process.argv.slice(2) : FILES;
  let failed = 0, checked = 0;
  for (const f of files) {
    const text = await readFile(join(ROOT, f), 'utf8').catch(() => null);
    if (text === null) continue;
    checked++;
    for (const e of checkText(text, known)) {
      console.error(`${f}:${e.line}: ${e.message}`);
      failed++;
    }
  }
  console.log(`validate: ${checked} file(s) checked, ${failed} problem(s)`);
  process.exit(failed ? 1 : 0);
}
