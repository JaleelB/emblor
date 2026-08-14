import { execFileSync } from 'node:child_process';
import { createHash } from 'node:crypto';
import { strict as assert } from 'node:assert';
import { mkdirSync, mkdtempSync, readFileSync, readdirSync, rmSync, statSync, writeFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { dirname, join, relative, resolve, sep } from 'node:path';
import { fileURLToPath } from 'node:url';

const packageRoot = resolve(fileURLToPath(new URL('../..', import.meta.url)));
const repositoryRoot = resolve(packageRoot, '..', '..');
const npm = process.platform === 'win32' ? 'npm.cmd' : 'npm';
const tar = process.platform === 'win32' ? 'tar.exe' : 'tar';
const expectedFiles = [
  'LICENSE',
  'README.md',
  'dist/index.cjs',
  'dist/index.cjs.map',
  'dist/index.d.cts',
  'dist/index.d.ts',
  'dist/index.js',
  'dist/index.js.map',
  'package.json',
];
const expectedExports = [
  'EmblorClear',
  'EmblorInput',
  'EmblorLabel',
  'EmblorRoot',
  'EmblorTag',
  'EmblorTagList',
  'EmblorTagRemove',
  'EmblorTagText',
];
const baselinePath = join(packageRoot, 'tests', 'packaging', 'size-baseline.json');
const reportPath = process.env.EMBLOR_DISTRIBUTION_REPORT ? resolve(process.env.EMBLOR_DISTRIBUTION_REPORT) : null;

function childEnvironment(overrides = {}) {
  const environment = { ...process.env, ...overrides };
  for (const key of Object.keys(environment)) {
    if (key.toLowerCase() === 'npm_config_dir') delete environment[key];
  }
  return environment;
}

function run(command, args, cwd, options = {}) {
  return execFileSync(command, args, {
    cwd,
    stdio: options.capture ? 'pipe' : 'inherit',
    encoding: options.capture ? 'utf8' : undefined,
    env: childEnvironment(options.env),
    shell: options.shell ?? (process.platform === 'win32' && /\.(?:cmd|bat)$/i.test(command)),
  });
}

function readJson(path) {
  return JSON.parse(readFileSync(path, 'utf8'));
}

function writeJson(path, value) {
  mkdirSync(dirname(path), { recursive: true });
  writeFileSync(path, `${JSON.stringify(value, null, 2)}\n`);
}

function collectFiles(directory) {
  const files = [];
  for (const entry of readdirSync(directory, { withFileTypes: true })) {
    const path = join(directory, entry.name);
    if (entry.isDirectory()) {
      files.push(...collectFiles(path));
    } else if (entry.isFile()) {
      files.push(path);
    }
  }
  return files;
}

function relativeFiles(directory) {
  return collectFiles(directory)
    .map((path) => relative(directory, path).split(sep).join('/'))
    .sort();
}

function directoryBytes(directory) {
  return collectFiles(directory).reduce((total, path) => total + statSync(path).size, 0);
}

function sha256(path) {
  return createHash('sha256').update(readFileSync(path)).digest('hex');
}

function assertManifest(manifest, label) {
  assert.equal(manifest.name, 'emblor', `${label} package name drifted`);
  assert.equal(manifest.version, '1.4.8', `${label} package version drifted from the Phase 2 baseline`);
  assert.equal(manifest.private, false, `${label} package must be publishable`);
  assert.equal(manifest.type, 'module', `${label} package must use native ESM metadata`);
  assert.equal(manifest.sideEffects, false, `${label} package must remain side-effect free`);
  assert.equal(manifest.license, 'MIT', `${label} package must declare the MIT license`);
  assert.equal(manifest.main, 'dist/index.cjs', `${label} CJS main target drifted`);
  assert.equal(manifest.module, 'dist/index.js', `${label} ESM module target drifted`);
  assert.equal(manifest.types, 'dist/index.d.ts', `${label} declaration target drifted`);
  assert.deepEqual(manifest.files, ['dist', 'README.md', 'LICENSE'], `${label} files boundary drifted`);
  assert.deepEqual(Object.keys(manifest.exports).sort(), ['.', './package.json'], `${label} exports drifted`);
  assert.deepEqual(
    manifest.exports['.'],
    {
      types: './dist/index.d.ts',
      import: './dist/index.js',
      require: './dist/index.cjs',
      default: './dist/index.js',
    },
    `${label} root export conditions drifted`,
  );
  assert.equal(manifest.exports['./package.json'], './package.json', `${label} metadata export drifted`);
  assert.deepEqual(
    manifest.peerDependencies,
    { react: '>=18.0.0 <20.0.0', 'react-dom': '>=18.0.0 <20.0.0' },
    `${label} React peer range drifted`,
  );
  assert.deepEqual(manifest.dependencies ?? {}, {}, `${label} gained runtime dependencies`);
  assert.deepEqual(manifest.optionalDependencies ?? {}, {}, `${label} gained optional runtime dependencies`);
  assert.equal(manifest.engines, undefined, `${label} must not impose a published Node engine`);
  assert.equal(manifest.bundledDependencies, undefined, `${label} must not bundle runtime dependencies`);

  const rootExportTargets = [
    manifest.main,
    manifest.module,
    manifest.types,
    manifest.exports['.'].types,
    manifest.exports['.'].import,
    manifest.exports['.'].require,
    manifest.exports['.'].default,
  ];
  assert.ok(
    rootExportTargets.every((target) => typeof target === 'string'),
    `${label} export targets must be strings`,
  );
}

function assertTarballEntries(tarballPath) {
  const output = run(tar, ['-tzf', tarballPath], packageRoot, { capture: true });
  const entries = output
    .split(/\r?\n/)
    .map((entry) => entry.trim())
    .filter((entry) => entry && entry !== 'package/' && !entry.endsWith('/'))
    .map((entry) => entry.replace(/^package\//, ''))
    .sort();
  assert.deepEqual(entries, expectedFiles, 'tarball archive entries are outside the exact allowlist');
}

function extractTarball(tarballPath, directory) {
  mkdirSync(directory, { recursive: true });
  run(tar, ['-xzf', tarballPath, '-C', directory], packageRoot);
  const packedRoot = join(directory, 'package');
  assert.ok(statSync(packedRoot, { throwIfNoEntry: false })?.isDirectory(), 'tarball did not extract a package root');
  return packedRoot;
}

function assertPackedArtifact(packedRoot, sourceManifest) {
  const packedFiles = relativeFiles(packedRoot);
  assert.deepEqual(packedFiles, expectedFiles, 'extracted package files are outside the exact allowlist');

  const packedManifest = readJson(join(packedRoot, 'package.json'));
  assertManifest(packedManifest, 'packed');
  assert.deepEqual(packedManifest, sourceManifest, 'npm pack changed the inspected package manifest');

  assert.equal(
    sha256(join(packedRoot, 'README.md')),
    sha256(join(packageRoot, 'README.md')),
    'packed README does not match packages/emblor/README.md',
  );
  assert.equal(
    sha256(join(packedRoot, 'LICENSE')),
    sha256(join(packageRoot, 'LICENSE')),
    'packed license does not match packages/emblor/LICENSE',
  );
  assert.equal(
    readFileSync(join(packedRoot, 'LICENSE'), 'utf8').replace(/\r\n/g, '\n'),
    readFileSync(join(repositoryRoot, 'LICENSE.md'), 'utf8').replace(/\r\n/g, '\n'),
    'packed license must contain the repository license terms',
  );

  for (const target of [
    packedManifest.main,
    packedManifest.module,
    packedManifest.types,
    packedManifest.exports['.'].types,
    packedManifest.exports['.'].import,
    packedManifest.exports['.'].require,
    packedManifest.exports['.'].default,
  ]) {
    assert.ok(
      statSync(join(packedRoot, target), { throwIfNoEntry: false })?.isFile(),
      `manifest target is missing: ${target}`,
    );
  }

  const declaration = readFileSync(join(packedRoot, 'dist', 'index.d.ts'), 'utf8');
  for (const symbol of expectedExports) {
    assert.match(declaration, new RegExp(`declare const ${symbol}\\b`), `declaration is missing ${symbol}`);
  }
  assert.match(declaration, /type EmblorRootProps/);
  assert.match(declaration, /type EmblorInputProps/);
  assert.match(declaration, /ComponentPropsWithoutRef/);
  assert.match(declaration, /PolymorphicRef/);

  for (const sourceMap of ['dist/index.js.map', 'dist/index.cjs.map']) {
    const sourceMapJson = readJson(join(packedRoot, sourceMap));
    assert.ok(Array.isArray(sourceMapJson.sources) && sourceMapJson.sources.length > 0, `${sourceMap} has no sources`);
  }

  assert.equal(
    readFileSync(join(packageRoot, 'README.md'), 'utf8') === readFileSync(join(repositoryRoot, 'README.md'), 'utf8'),
    false,
    'package README must remain the publication README rather than the root README',
  );
}

function assertWorkflowInputs() {
  const ci = readFileSync(join(repositoryRoot, '.github', 'workflows', 'ci.yml'), 'utf8');
  assert.match(ci, /pnpm install --frozen-lockfile/, 'CI must install from the frozen lockfile');
  assert.match(ci, /node-version: \[22\.x, 24\.x\]/, 'CI must retain Node 22/24 coverage');
  assert.match(ci, /distribution:artifact/, 'CI must run the artifact distribution gate');

  const publish = readFileSync(join(repositoryRoot, '.github', 'workflows', 'publish.yml'), 'utf8');
  assert.match(publish, /branches:\s*\[main\]/, 'publish workflow must only follow CI runs from main');
  assert.match(publish, /types:\s*\[completed\]/, 'publish workflow must wait for CI completion');
  assert.match(
    publish,
    /github\.event\.workflow_run\.conclusion\s*==\s*['"]success['"]/,
    'publish workflow must require successful CI',
  );
  assert.match(
    publish,
    /github\.event\.workflow_run\.head_sha\s*==\s*github\.sha/,
    'publish workflow must prevent Changesets from resetting to a different event SHA',
  );
  assert.match(
    publish,
    /ref:\s*\$\{\{\s*github\.event\.workflow_run\.head_sha\s*\}\}/,
    'publish workflow must checkout the exact CI-verified commit',
  );
  assert.doesNotMatch(publish, /copy-readme|Copy README/i, 'publish workflow must not overwrite the inspected README');
  assert.match(publish, /release:dry-run/, 'publish workflow must run the non-publishing release validation');
  assert.match(publish, /node-version: 24\.x/, 'publish workflow must validate on Node 24');
  assert.match(
    publish,
    /run:\s*pnpm run release:dry-run\s+- name:\s*Create Release Pull Request or Publish\s+id:\s*changesets\s+uses:\s*changesets\/action@v1/,
    'publish workflow must not mutate package inputs between release validation and Changesets',
  );
}

function assertWithinBaseline(label, actual, expected, tolerancePercent) {
  assert.ok(Number.isInteger(actual) && actual > 0, `${label} must be a positive byte count`);
  assert.ok(Number.isInteger(expected) && expected > 0, `${label} baseline must be a positive byte count`);
  const maximum = Math.ceil(expected * (1 + tolerancePercent / 100));
  assert.ok(
    actual <= maximum,
    `${label} grew from ${expected} to ${actual} bytes beyond the ${tolerancePercent}% tolerance`,
  );
}

function assertSizeBaseline(measurements, consumerReports) {
  const baseline = readJson(baselinePath);
  const tolerancePercent = baseline.tolerancePercent;
  assert.equal(typeof tolerancePercent, 'number', 'package size baseline must declare a tolerance percentage');

  for (const [label, actual] of Object.entries(measurements)) {
    assertWithinBaseline(label, actual, baseline.measurements[label], tolerancePercent);
  }
  for (const consumer of consumerReports) {
    const consumerBaseline = baseline.consumers[consumer.reactVersion];
    assertWithinBaseline(
      `React ${consumer.reactVersion} production bundle`,
      consumer.bundleBytes,
      consumerBaseline.bundleBytes,
      tolerancePercent,
    );
    assert.equal(
      consumer.dependencyGraphSha256,
      consumerBaseline.dependencyGraphSha256,
      `React ${consumer.reactVersion} dependency graph drifted from the reviewed fixture snapshot`,
    );
  }
}

const packageManifest = readJson(join(packageRoot, 'package.json'));
assertManifest(packageManifest, 'source');
assertWorkflowInputs();

const workspace = mkdtempSync(join(tmpdir(), 'emblor-distribution-'));
const packDirectory = join(workspace, 'pack');
const extractionDirectory = join(workspace, 'extracted');
const compatReportPath = join(workspace, 'compat-report.json');
let tarballPath;

try {
  const distDirectory = join(packageRoot, 'dist');
  assert.ok(
    statSync(distDirectory, { throwIfNoEntry: false })?.isDirectory(),
    'build dist/ before packing the artifact',
  );

  console.log('[distribution] Packing one artifact for all package checks.');
  mkdirSync(packDirectory);
  run(npm, ['pack', '--pack-destination', packDirectory, '--ignore-scripts'], packageRoot);
  tarballPath = join(packDirectory, `emblor-${packageManifest.version}.tgz`);
  assert.ok(
    statSync(tarballPath, { throwIfNoEntry: false })?.isFile(),
    'npm pack did not produce the expected tarball',
  );

  assertTarballEntries(tarballPath);
  const packedRoot = extractTarball(tarballPath, extractionDirectory);
  assertPackedArtifact(packedRoot, packageManifest);

  console.log('[distribution] Verifying isolated React 18/19 consumers from the same tarball.');
  run(process.execPath, [join(packageRoot, 'tests', 'compat', 'verify-packed-consumers.mjs')], packageRoot, {
    env: {
      EMBLOR_TARBALL: tarballPath,
      EMBLOR_COMPAT_REPORT: compatReportPath,
    },
  });
  const compatReport = readJson(compatReportPath);
  assert.deepEqual(
    compatReport.consumers.map((consumer) => consumer.reactVersion),
    ['18.3.1', '19.1.1'],
    'packed consumer matrix did not cover React 18 and React 19',
  );

  const measurements = {
    tarballBytes: statSync(tarballPath).size,
    unpackedBytes: directoryBytes(packedRoot),
    esmBytes: statSync(join(packedRoot, 'dist', 'index.js')).size,
    cjsBytes: statSync(join(packedRoot, 'dist', 'index.cjs')).size,
    declarationsBytes:
      statSync(join(packedRoot, 'dist', 'index.d.ts')).size + statSync(join(packedRoot, 'dist', 'index.d.cts')).size,
  };
  assertSizeBaseline(measurements, compatReport.consumers);

  const report = {
    package: `${packageManifest.name}@${packageManifest.version}`,
    tarball: {
      files: expectedFiles,
      sha256: sha256(tarballPath),
      ...measurements,
    },
    consumers: compatReport.consumers,
  };
  if (reportPath) writeJson(reportPath, report);
  console.log(JSON.stringify(report, null, 2));
  console.log('[distribution] Packed artifact, module contracts, consumers, and package sanity passed.');
} finally {
  rmSync(workspace, { recursive: true, force: true });
}
