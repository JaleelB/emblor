import { createRequire } from 'node:module';
import { realpathSync, readFileSync } from 'node:fs';
import { dirname, resolve } from 'node:path';

const require = createRequire(import.meta.url);
const websitePackage = JSON.parse(readFileSync(resolve(process.cwd(), 'package.json'), 'utf8'));
const lockfile = readFileSync(resolve(process.cwd(), '..', 'pnpm-lock.yaml'), 'utf8');
const requested = websitePackage.dependencies?.emblor;
const expected = '2.0.0-alpha.1';
const failures = [];

if (requested !== expected) failures.push(`website/package.json must request emblor ${expected}, got ${requested}`);
if (/^(latest|workspace:|file:|link:|git\+|https?:|[~^*])/.test(String(requested))) {
  failures.push('emblor dependency must be exact registry semver');
}

const packageJsonPath = require.resolve('emblor/package.json');
const installed = JSON.parse(readFileSync(packageJsonPath, 'utf8'));
const resolvedPath = realpathSync(dirname(packageJsonPath));
const lockEntry = new RegExp(`\\n\\s+emblor@${expected.replaceAll('.', '\\.')}:\\n\\s+resolution: \\{integrity:`);

if (installed.version !== expected)
  failures.push(`installed emblor version must be ${expected}, got ${installed.version}`);
if (/packages[\\/]emblor/i.test(resolvedPath)) failures.push(`emblor resolved from workspace source: ${resolvedPath}`);
if (!lockEntry.test(lockfile)) failures.push(`pnpm lockfile must contain an integrity entry for emblor ${expected}`);
if (!installed._integrity && !installed.dist && !lockEntry.test(lockfile)) {
  console.warn('⚠ package metadata has no local integrity field; pnpm lockfile remains the integrity authority');
}

if (failures.length) {
  console.error(failures.map((failure) => `✗ ${failure}`).join('\n'));
  process.exit(1);
}

console.log(`✓ external consumer verified: emblor@${installed.version} → ${resolvedPath}`);
