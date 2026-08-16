import { execFileSync } from 'node:child_process';

const npm = process.platform === 'win32' ? 'npm.cmd' : 'npm';
const expectedVersion = process.env.EMBLOR_EXPECTED_VERSION ?? '2.0.0-alpha.0';
const mode = process.argv[2];

if (mode !== '--prepublish' && mode !== '--published') {
  throw new Error('Use --prepublish or --published.');
}

function npmView(args, allowNotFound = false) {
  try {
    const value = execFileSync(npm, ['view', ...args, '--json'], {
      encoding: 'utf8',
      stdio: ['ignore', 'pipe', 'pipe'],
      shell: process.platform === 'win32',
    }).trim();
    if (allowNotFound && value === '') return null;
    return value;
  } catch (error) {
    const output = `${error.stdout ?? ''}\n${error.stderr ?? ''}`;
    if (allowNotFound && (output.trim() === '' || /(?:E404|404 Not Found|No match found for version)/i.test(output)))
      return null;
    throw new Error(`npm view ${args.join(' ')} failed:\n${output}`);
  }
}

function parseJson(value, label) {
  if (value === null || value === '') {
    throw new Error(`npm returned no JSON for ${label}.`);
  }
  try {
    return JSON.parse(value);
  } catch {
    throw new Error(`npm returned invalid JSON for ${label}: ${value}`);
  }
}

function readRegistryState() {
  const rawTags = parseJson(npmView(['emblor', 'dist-tags']), 'dist-tags');
  const tags = Array.isArray(rawTags) ? rawTags[0] : rawTags;
  if (!tags || typeof tags !== 'object') throw new Error('npm returned an invalid dist-tags object.');
  const target = npmView([`emblor@${expectedVersion}`, 'version'], true);
  return { tags, target };
}

if (mode === '--prepublish') {
  const { tags, target } = readRegistryState();
  if (tags.latest !== '1.4.8') {
    throw new Error(`Refusing alpha publication because npm latest is ${tags.latest ?? '<missing>'}, not 1.4.8.`);
  }
  if (target !== null) {
    throw new Error(`Refusing alpha publication because ${expectedVersion} already exists on npm.`);
  }
  console.log(`[release] npm preflight passed: latest=${tags.latest}; ${expectedVersion} is absent.`);
} else {
  const attempts = 12;
  const delayMs = 5000;
  let lastError;
  let verified = false;

  for (let attempt = 1; attempt <= attempts; attempt += 1) {
    try {
      const { tags, target } = readRegistryState();
      const rawTargetVersion = parseJson(target ?? '', `emblor@${expectedVersion} version`);
      const targetVersion = Array.isArray(rawTargetVersion) ? rawTargetVersion[0] : rawTargetVersion;
      const resolvedVersion = typeof targetVersion === 'string' ? targetVersion : targetVersion?.version;
      if (resolvedVersion !== expectedVersion) {
        throw new Error(
          `Published version resolved to ${resolvedVersion ?? '<missing>'}, expected ${expectedVersion}.`,
        );
      }
      if (tags.next !== expectedVersion) {
        throw new Error(`npm next resolves to ${tags.next ?? '<missing>'}, not ${expectedVersion}.`);
      }
      if (tags.latest !== '1.4.8') {
        throw new Error(`npm latest moved to ${tags.latest ?? '<missing>'}; expected 1.4.8.`);
      }
      console.log(`[release] npm publication verified: next=${tags.next}; latest=${tags.latest}.`);
      verified = true;
      break;
    } catch (error) {
      lastError = error;
      if (attempt === attempts) break;
      console.warn(
        `[release] npm publication not visible yet (attempt ${attempt}/${attempts}); retrying in ${delayMs / 1000}s.`,
      );
      execFileSync(
        process.platform === 'win32' ? 'powershell.exe' : 'sleep',
        process.platform === 'win32'
          ? ['-NoProfile', '-Command', `Start-Sleep -Seconds ${delayMs / 1000}`]
          : [String(delayMs / 1000)],
        { stdio: 'ignore' },
      );
    }
  }

  if (!verified)
    throw new Error(
      `npm publication was not verifiable after ${attempts} attempts: ${lastError?.message ?? 'unknown registry error'}`,
    );
}
