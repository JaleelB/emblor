import { readFileSync } from 'node:fs';
import { resolve } from 'node:path';

const repositoryRoot = resolve(process.cwd(), '..');
const evidence = [
  ['validation order', 'tests/core/evaluator.test.ts', 'trims, transforms, counts code points, and validates the canonical value'],
  ['IME suppression', 'tests/core/constraints-and-interactions.test.tsx', 'does not interpret commands while composing'],
  ['paste delimiters', 'tests/core/constraints-and-interactions.test.tsx', 'splits paste with deduplicated literal delimiters and supports whole-draft mode'],
  ['controlled refusal', 'tests/core/verification-hardening.test.tsx', 'keeps controlled refusal focused and cancels pending restoration on divergence'],
  ['native reset', 'tests/core/verification-hardening.test.tsx', 'preserves disabled/read-only form participation and resets only uncontrolled state'],
  ['repeated values', 'tests/browser/tag-input.spec.ts', 'submits repeated values and routes native required invalid focus to Input'],
  ['RTL navigation', 'tests/browser/tag-input.spec.ts', 'navigates physical arrows in both LTR and RTL'],
  ['removal focus', 'tests/browser/tag-input.spec.ts', 'restores focus after pointer and keyboard removal'],
  ['announcements', 'tests/core/verification-hardening.test.tsx', 'supports default, custom, suppressed, repeated, and guarded announcements'],
  ['structure', 'tests/core/verification-hardening.test.tsx', 'throws for missing/duplicate structure, incompatible custom Input, and duplicate Tag indexes'],
];

const failures = evidence.flatMap(([claim, relativePath, testTitle]) => {
  const path = resolve(repositoryRoot, 'packages', 'emblor', relativePath);
  return readFileSync(path, 'utf8').includes(testTitle) ? [] : [`${claim}: missing test “${testTitle}” in ${relativePath}`];
});

if (failures.length) {
  console.error(failures.map((failure) => `✗ ${failure}`).join('\n'));
  process.exit(1);
}

console.log(`✓ documented behavior is anchored to ${evidence.length} core/browser tests`);
