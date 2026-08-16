import { execFileSync } from 'node:child_process';

const npm = process.platform === 'win32' ? 'npm.cmd' : 'npm';
const expectedVersion = process.env.EMBLOR_EXPECTED_VERSION ?? '2.0.0-alpha.0';
const mode = process.argv[2];

if (mode !== '--prepublish' && mode !== '--published') {
  throw new Error('Use --prepublish or --published.');
}

function npmView(args, allowNotFound = false) {
  try {
    return execFileSync(npm, ['view', ...args, '--json'], {
      encoding: 'utf8',
      stdio: ['ignore', 'pipe', 'pipe'],
      shell: process.platform === 'win32',
    }).trim();
  } catch (error) {
    const output = `${error.stdout ?? ''}\n${error.stderr ?? ''}`;
    if (allowNotFound && /(?:E404|404 Not Found|No match found for version)/i.test(output)) return null;
    throw new Error(`npm view ${args.join(' ')} failed:\n${output}`);
  }
}

function parseJson(value, label) {
  try {
    return JSON.parse(value);
  } catch {
    throw new Error(`npm returned invalid JSON for ${label}: ${value}`);
  }
}

const rawTags = parseJson(npmView(['emblor', 'dist-tags']), 'dist-tags');
const tags = Array.isArray(rawTags) ? rawTags[0] : rawTags;
if (!tags || typeof tags !== 'object') throw new Error('npm returned an invalid dist-tags object.');
const target = npmView([`emblor@${expectedVersion}`, 'version'], true);

if (mode === '--prepublish') {
  if (tags.latest !== '1.4.8') {
    throw new Error(`Refusing alpha publication because npm latest is ${tags.latest ?? '<missing>'}, not 1.4.8.`);
  }
  if (target !== null) {
    throw new Error(`Refusing alpha publication because ${expectedVersion} already exists on npm.`);
  }
  console.log(`[release] npm preflight passed: latest=${tags.latest}; ${expectedVersion} is absent.`);
} else {
  const parsedTargetVersion = parseJson(target ?? '', `emblor@${expectedVersion} version`);
  const targetVersion = Array.isArray(parsedTargetVersion) ? parsedTargetVersion[0] : parsedTargetVersion;
  const resolvedVersion = typeof targetVersion === 'string' ? targetVersion : targetVersion?.version;
  if (resolvedVersion !== expectedVersion) {
    throw new Error(`Published version resolved to ${resolvedVersion ?? '<missing>'}, expected ${expectedVersion}.`);
  }
  if (tags.next !== expectedVersion) {
    throw new Error(`npm next resolves to ${tags.next ?? '<missing>'}, not ${expectedVersion}.`);
  }
  if (tags.latest !== '1.4.8') {
    throw new Error(`npm latest moved to ${tags.latest ?? '<missing>'}; expected 1.4.8.`);
  }
  console.log(`[release] npm publication verified: next=${tags.next}; latest=${tags.latest}.`);
}
