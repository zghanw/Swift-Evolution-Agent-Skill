// node scripts/validate.test.mjs: exits non-zero if validate.mjs misjudges a citation.
import assert from 'node:assert/strict';
import { checkText, loadKnown } from './validate.mjs';

const known = await loadKnown();
assert.equal(known.get('SE-0481'), '6.3'); // weak let
assert.equal(known.get('SE-0504'), '6.4'); // task cancellation shields
assert.equal(known.get('SE-0510'), null);  // mapKeyedValues: accepted, not shipped
assert.equal(known.get('SE-0484'), null);  // implemented on main (Next)

const cases = [
  ['Use `weak let` (SE-0481 (6.3)).', 0],
  ['Shields: [SE-0504](https://example.com) (Swift 6.4)', 0],
  ['| `weak let` | SE-0481 | 6.3+ |', 0],
  ['`mapKeyedValues` is SE-0510 (unreleased).', 0],
  ['`weak let` arrived with SE-0481 (6.2).', 1],          // wrong version
  ['Use `mapKeyedValues` (SE-0510 (6.4)).', 1],           // not shipped, presented as available
  ['SE-0504 (unreleased)', 1],                            // stale: it shipped
  ['See SE-0504 for details.', 1],                        // missing annotation
  ['SE-9999 (6.4)', 1],                                   // not in the feed
  ['| SE-0481 | SE-0504 | 6.4 |', 2],                      // two ids: each needs its own annotation
  ['SE-0504 (task shields)', 1],                          // unrecognized annotation
];
for (const [text, n] of cases) {
  assert.equal(checkText(text, known).length, n, `${text} -> ${JSON.stringify(checkText(text, known))}`);
}
console.log(`validate.test: ${cases.length} cases passed`);
