import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import test from 'node:test';
import { findForbiddenCandidatePaths } from './release-boundary.mjs';

const workflow = readFileSync(new URL('../.github/workflows/publish.yml', import.meta.url), 'utf8');
const releaseValidator = readFileSync(new URL('./validate-release.mjs', import.meta.url), 'utf8');

test('allows the intentional website package metadata change', () => {
  assert.deepEqual(findForbiddenCandidatePaths(['website/package.json']), []);
});

test('rejects every other website change', () => {
  assert.deepEqual(findForbiddenCandidatePaths(['website/package.json', 'website/app/page.tsx']), [
    'website/app/page.tsx',
  ]);
});

test('rejects frozen package and playground source changes', () => {
  assert.deepEqual(
    findForbiddenCandidatePaths(['packages/emblor/src/index.ts', 'packages/emblor/playground/src/App.tsx']),
    ['packages/emblor/playground/src/App.tsx', 'packages/emblor/src/index.ts'],
  );
});

test('workflow and release validator use shared boundary policy', () => {
  assert.doesNotMatch(workflow, /PHASE_2_SHA|validate-release-boundary/);
  assert.doesNotMatch(releaseValidator, /findForbiddenCandidatePaths/);
});
