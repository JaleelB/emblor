import { execFileSync } from 'node:child_process';
import { createHash } from 'node:crypto';
import { mkdtempSync, readFileSync, rmSync, statSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

const repositoryRoot = resolve(fileURLToPath(new URL('..', import.meta.url)));
const packageRoot = join(repositoryRoot, 'packages', 'emblor');
const packageManager = process.platform === 'win32' ? 'pnpm.cmd' : 'pnpm';
const npm = process.platform === 'win32' ? 'npm.cmd' : 'npm';

function childEnvironment() {
  const environment = { ...process.env };
  for (const key of Object.keys(environment)) {
    if (key.toLowerCase() === 'npm_config_dir') delete environment[key];
  }
  return environment;
}

function run(command, args, cwd) {
  execFileSync(command, args, {
    cwd,
    stdio: 'inherit',
    env: childEnvironment(),
    shell: process.platform === 'win32' && /\.(?:cmd|bat)$/i.test(command),
  });
}

function runPublishDryRun(tarballPath) {
  try {
    const output = execFileSync(npm, ['publish', tarballPath, '--dry-run', '--ignore-scripts', '--access', 'public'], {
      cwd: packageRoot,
      encoding: 'utf8',
      env: childEnvironment(),
      shell: process.platform === 'win32' && /\.(?:cmd|bat)$/i.test(npm),
    });
    process.stdout.write(output);
  } catch (error) {
    const output = `${error.stdout ?? ''}\n${error.stderr ?? ''}`;
    const expectedExistingVersion = new RegExp(
      `cannot publish over the previously published versions:\\s*${packageManifest.version}`,
      'i',
    );
    if (!expectedExistingVersion.test(output)) {
      throw error;
    }
    console.log(
      `[release] npm dry-run reached the registry and refused the already-published baseline ${packageManifest.version}; no publication occurred.`,
    );
  }
}

function digest(path) {
  return createHash('sha256').update(readFileSync(path)).digest('hex');
}

const packageManifest = JSON.parse(readFileSync(join(packageRoot, 'package.json'), 'utf8'));
const readmePath = join(packageRoot, 'README.md');
const manifestPath = join(packageRoot, 'package.json');
const readmeDigest = digest(readmePath);
const manifestDigest = digest(manifestPath);
const workspace = mkdtempSync(join(tmpdir(), 'emblor-release-dry-run-'));

try {
  if (packageManifest.version !== '1.4.8') {
    throw new Error(`Phase 2 release validation requires package version 1.4.8, found ${packageManifest.version}`);
  }

  if (statSync(join(repositoryRoot, '.changeset', 'pre.json'), { throwIfNoEntry: false })) {
    throw new Error('Phase 2 release validation must not enter Changesets prerelease mode.');
  }

  console.log('[release] Re-run the packed artifact gate before publication validation.');
  run(packageManager, ['-C', 'packages/emblor', 'run', 'test:distribution'], repositoryRoot);

  console.log('[release] Pack the publication input without changing package files.');
  run(npm, ['pack', '--pack-destination', workspace, '--ignore-scripts'], packageRoot);
  const tarballPath = join(workspace, `emblor-${packageManifest.version}.tgz`);

  console.log('[release] Run npm publish in explicit dry-run mode.');
  runPublishDryRun(tarballPath);

  if (digest(readmePath) !== readmeDigest) {
    throw new Error('Publication validation mutated packages/emblor/README.md.');
  }
  if (digest(manifestPath) !== manifestDigest) {
    throw new Error('Publication validation mutated packages/emblor/package.json.');
  }

  const finalManifest = JSON.parse(readFileSync(join(packageRoot, 'package.json'), 'utf8'));
  if (finalManifest.version !== '1.4.8') {
    throw new Error('Publication validation changed the package version.');
  }

  console.log('[release] Non-publishing release validation passed; no credentials or publication were used.');
} finally {
  rmSync(workspace, { recursive: true, force: true });
}
