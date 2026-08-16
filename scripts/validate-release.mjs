import { execFileSync } from 'node:child_process';
import { readFileSync, readdirSync, statSync } from 'node:fs';
import { join, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import { findForbiddenCandidatePaths } from './release-boundary.mjs';

const repositoryRoot = resolve(fileURLToPath(new URL('..', import.meta.url)));
const packageRoot = join(repositoryRoot, 'packages', 'emblor');
const expectedVersion = process.env.EMBLOR_EXPECTED_VERSION ?? '2.0.0-alpha.0';
const phase2Sha = '3980c5d0cda5123b5c61c4df10cbf5220610a4a3';
const node = process.execPath;

function readJson(path) {
  return JSON.parse(readFileSync(path, 'utf8'));
}

function assert(condition, message) {
  if (!condition) throw new Error(message);
}

function run(command, args) {
  return execFileSync(command, args, {
    cwd: repositoryRoot,
    encoding: 'utf8',
    stdio: ['ignore', 'pipe', 'pipe'],
    shell: process.platform === 'win32' && /.(?:cmd|bat)$/i.test(command),
  });
}

const manifest = readJson(join(packageRoot, 'package.json'));
const changesetConfig = readJson(join(repositoryRoot, '.changeset', 'config.json'));
const prereleasePath = join(repositoryRoot, '.changeset', 'pre.json');
const prerelease = readJson(prereleasePath);
const packageReadme = readFileSync(join(packageRoot, 'README.md'), 'utf8');
const migration = readFileSync(join(packageRoot, 'MIGRATION.md'), 'utf8');
const changelog = readFileSync(join(packageRoot, 'CHANGELOG.md'), 'utf8');
const releaseNotes = readFileSync(join(repositoryRoot, '.github', 'releases', `${expectedVersion}.md`), 'utf8');
const publishWorkflow = readFileSync(join(repositoryRoot, '.github', 'workflows', 'publish.yml'), 'utf8').replace(
  /\r\n/g,
  '\n',
);

assert(manifest.name === 'emblor', 'Candidate package name must be emblor.');
assert(manifest.version === expectedVersion, `Candidate version must be ${expectedVersion}.`);
assert(manifest.private === false, 'Candidate package must be publishable.');
assert(manifest.description, 'Candidate package must have a description.');
assert(manifest.repository?.url === 'git+https://github.com/JaleelB/emblor.git', 'Repository metadata is incorrect.');
assert(manifest.homepage === 'https://github.com/JaleelB/emblor#readme', 'Homepage metadata is incorrect.');
assert(manifest.bugs?.url === 'https://github.com/JaleelB/emblor/issues', 'Bugs metadata is incorrect.');
assert(manifest.publishConfig?.access === 'public', 'Candidate must declare public npm access.');
assert(
  JSON.stringify(manifest.files) === JSON.stringify(['dist', 'README.md', 'MIGRATION.md', 'CHANGELOG.md', 'LICENSE']),
  'Package file boundary is incorrect.',
);
assert(manifest.engines === undefined, 'The published package must not impose a Node engine.');
assert(JSON.stringify(changesetConfig.access) === JSON.stringify('public'), 'Changesets access must be public.');
assert(
  JSON.stringify(changesetConfig.ignore) === JSON.stringify(['@emblor/playground', 'website']),
  'Changesets must ignore the frozen playground and v1 website workspaces.',
);
assert(prerelease.mode === 'pre', 'Changesets prerelease mode must be active.');
assert(prerelease.tag === 'alpha', 'Changesets prerelease tag must be alpha.');
assert(prerelease.initialVersions?.emblor === '1.4.8', 'Alpha must derive from the 1.4.8 baseline.');
assert(changelog.includes(`# ${expectedVersion}`), 'Generated changelog is missing the exact alpha heading.');
assert(releaseNotes.includes(expectedVersion), 'Release notes are for the wrong version.');
assert(packageReadme.includes('npm install emblor@next'), 'README must document npm next installation.');
assert(packageReadme.includes('pnpm add emblor@next'), 'README must document pnpm next installation.');
assert(packageReadme.includes('latest` remains the v1 line'), 'README must state that latest remains v1.');
assert(migration.includes('string[]'), 'Migration guide must explain the string-array value model.');
assert(migration.includes('native form'), 'Migration guide must explain native forms.');
assert(migration.includes('EmblorClear'), 'Migration guide must explain the final clear primitive.');
assert(publishWorkflow.includes('workflow_dispatch:'), 'Alpha publication must be manually dispatched.');
assert(
  publishWorkflow.includes('environment:\n      name: npm'),
  'Alpha publication must use the protected npm environment.',
);
assert(
  publishWorkflow.includes('id-token: write'),
  'Alpha publication must request OIDC identity only in the publish job.',
);
assert(publishWorkflow.includes('--tag next'), 'Alpha publication must target the next dist-tag.');
assert(publishWorkflow.includes('--provenance'), 'Alpha publication must request npm provenance.');
assert(!publishWorkflow.includes('NPM_TOKEN'), 'The alpha workflow must not use the long-lived npm token.');
assert(
  !publishWorkflow.includes('changesets/action'),
  'The alpha workflow must not invoke token-oriented Changesets publication.',
);
const packStepStart = publishWorkflow.indexOf('      - name: Pack the verified candidate once');
const uploadStepStart = publishWorkflow.indexOf('      - name: Upload the exact candidate tarball');
assert(packStepStart >= 0 && uploadStepStart > packStepStart, 'Alpha workflow pack step is missing.');
const packStep = publishWorkflow.slice(packStepStart, uploadStepStart);
assert(packStep.includes('npm pack . --pack-destination'), 'Alpha workflow must pack from packages/emblor.');
assert(packStep.includes('working-directory: packages/emblor'), 'Alpha workflow pack directory is incorrect.');
const publishJobStart = publishWorkflow.indexOf('\n  publish:');
assert(publishJobStart >= 0, 'Alpha workflow publish job is missing.');
const publishJob = publishWorkflow.slice(publishJobStart);
assert(publishJob.includes('uses: actions/setup-node@v4'), 'Alpha workflow publish job must set up Node 24.');
assert(publishJob.includes('node-version: 24.x'), 'Alpha workflow publish job must run on Node 24.');

const candidateChangesets = readdirSync(join(repositoryRoot, '.changeset')).filter(
  (entry) => entry.endsWith('.md') && entry !== 'README.md',
);
assert(
  candidateChangesets.length === 1 && candidateChangesets[0] === 'quiet-pandas-release.md',
  `The alpha prerelease must retain only the generated v2 changeset: ${candidateChangesets.join(', ')}`,
);
assert(
  Array.isArray(prerelease.changesets) &&
    prerelease.changesets.length === 1 &&
    prerelease.changesets[0] === 'quiet-pandas-release',
  'Changesets prerelease state must retain the exact generated v2 changeset.',
);

let changedFiles = new Set();
try {
  const trackedChanges = [
    run('git', ['diff', '--name-only', phase2Sha, '--']),
    run('git', ['diff', '--cached', '--name-only', phase2Sha, '--']),
  ];
  const untrackedChanges = run('git', ['ls-files', '--others', '--exclude-standard']);
  changedFiles = new Set(
    [...trackedChanges, untrackedChanges]
      .flatMap((output) => output.split(/\r?\n/))
      .map((path) => path.trim())
      .filter(Boolean),
  );
} catch (error) {
  throw new Error(`Unable to inspect candidate boundary: ${error.message}`);
}
const forbiddenChange = findForbiddenCandidatePaths(changedFiles);
assert(forbiddenChange.length === 0, `Candidate crosses the frozen boundary: ${forbiddenChange.join(', ')}`);

console.log(`[release] Validating ${manifest.name}@${manifest.version} without publishing.`);
run(node, [join(repositoryRoot, 'scripts', 'validate-alpha-registry.mjs'), '--prepublish']);
console.log('[release] Alpha metadata, frozen boundary, and npm preflight passed; no publication occurred.');
