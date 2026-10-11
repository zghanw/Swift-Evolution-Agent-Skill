#!/usr/bin/env node
// Writes every ```swift block in the hand-written files to <outdir>/<file>-L<line>.swift
// so CI can type-check them with the official swift Docker image.
// Put <!-- no-compile --> on the line before a block to skip it (fragments, Apple-only APIs).
//
// Usage: node scripts/snippets.mjs <outdir>

import { mkdir, readFile, writeFile } from 'node:fs/promises';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const ROOT = join(dirname(fileURLToPath(import.meta.url)), '..');
const SKILL = 'skills/swift-evolution';
const FILES = [`${SKILL}/SKILL.md`, `${SKILL}/references/toolchain-detection.md`, 'README.md'];
const out = process.argv[2];
if (!out) {
  console.error('usage: snippets.mjs <outdir>');
  process.exit(2);
}

await mkdir(out, { recursive: true });
let count = 0;
for (const f of FILES) {
  const lines = await readFile(join(ROOT, f), 'utf8').then((s) => s.split(/\r?\n/), () => null);
  if (!lines) continue;
  for (let i = 0; i < lines.length; i++) {
    if (lines[i].trim() !== '```swift') continue;
    const skip = lines[i - 1]?.trim() === '<!-- no-compile -->';
    const end = lines.findIndex((l, j) => j > i && l.trim() === '```');
    if (end < 0) throw new Error(`${f}:${i + 1}: unclosed code block`);
    if (!skip) {
      await writeFile(join(out, `${f.replace(/[/.]/g, '_')}-L${i + 1}.swift`), lines.slice(i + 1, end).join('\n') + '\n');
      count++;
    }
    i = end;
  }
}
console.log(`snippets: wrote ${count} file(s) to ${out}`);
