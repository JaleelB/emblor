import { execFileSync } from 'node:child_process';
import { findForbiddenCandidatePaths } from './release-boundary.mjs';

const [baseSha, candidateSha] = process.argv.slice(2);

if (!baseSha || !candidateSha) {
  throw new Error('Usage: node scripts/validate-release-boundary.mjs <base-sha> <candidate-sha>.');
}

const changedFiles = execFileSync('git', ['diff', '--name-only', baseSha, candidateSha, '--'], {
  encoding: 'utf8',
})
  .split(/\r?\n/)
  .filter(Boolean);

const forbiddenChanges = findForbiddenCandidatePaths(changedFiles);
if (forbiddenChanges.length > 0) {
  throw new Error(`Candidate crosses the frozen boundary: ${forbiddenChanges.join(', ')}`);
}

console.log('[release] Frozen candidate boundary passed.');
