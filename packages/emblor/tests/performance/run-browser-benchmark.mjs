import { execFileSync } from 'node:child_process';
import { mkdirSync, mkdtempSync, readFileSync, rmSync, statSync, writeFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { dirname, join, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import { chromium } from '@playwright/test';
import { build, preview } from 'vite';

process.setMaxListeners(0);

const packageRoot = resolve(fileURLToPath(new URL('../..', import.meta.url)));
const fixtureRoot = join(packageRoot, 'tests', 'performance', 'fixture');
const repositoryRoot = resolve(packageRoot, '..', '..');
const pnpm = process.platform === 'win32' ? 'pnpm.cmd' : 'pnpm';
const npm = process.platform === 'win32' ? 'npm.cmd' : 'npm';
const tar = process.platform === 'win32' ? 'tar.exe' : 'tar';
const outputArgument = process.argv.indexOf('--output');
const outputPath = resolve(
  outputArgument >= 0 ? process.argv[outputArgument + 1] : join(repositoryRoot, 'performance-results.json'),
);
const sourceOnly = process.argv.includes('--source-only');
const workspace = mkdtempSync(join(tmpdir(), 'emblor-browser-performance-'));
const chromePath =
  process.env.PLAYWRIGHT_EXECUTABLE_PATH || 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe';

function run(command, args, cwd, capture = false) {
  return execFileSync(command, args, {
    cwd,
    stdio: capture ? 'pipe' : 'inherit',
    encoding: capture ? 'utf8' : undefined,
    shell: process.platform === 'win32' && /\.(?:cmd|bat)$/i.test(command),
  });
}

function instrumentEmblor(targetRoot) {
  const targetEntry = join(targetRoot, 'dist', 'index.js').replaceAll('\\', '/');
  return {
    name: 'instrument-emblor-renders',
    enforce: 'pre',
    transform(code, id) {
      if (id.replaceAll('\\', '/').split('?')[0] !== targetEntry) return null;
      const replacements = [
        ['function EmblorRoot(props, forwardedRef) {', 'Root', ''],
        ['function EmblorInput(props, forwardedRef) {', 'Input', ''],
        ['function EmblorTagList(props, forwardedRef) {', 'TagList', ''],
        ['function EmblorTag(props, forwardedRef) {', 'Tag', ', props.index'],
      ];
      let transformed = code;
      for (const [needle, component, extra] of replacements) {
        if (!transformed.includes(needle)) throw new Error(`Could not instrument ${component} render`);
        transformed = transformed.replace(
          needle,
          `${needle}\n  globalThis.__EMBLOR_RECORD_RENDER__?.('${component}'${extra});`,
        );
      }
      return { code: transformed, map: null };
    },
  };
}

function installReact(major) {
  const directory = join(workspace, `react-${major}`);
  mkdirSync(directory);
  const version = major === 18 ? '18.3.1' : '19.1.1';
  writeFileSync(
    join(directory, 'package.json'),
    `${JSON.stringify({ private: true, dependencies: { react: version, 'react-dom': version } }, null, 2)}\n`,
  );
  run(pnpm, ['install', '--ignore-scripts', '--no-frozen-lockfile'], directory);
  return { directory, version };
}

function publishedPackage() {
  const directory = join(workspace, 'published');
  mkdirSync(directory);
  run(npm, ['pack', 'emblor@2.0.0-alpha.0', '--pack-destination', directory, '--ignore-scripts'], repositoryRoot);
  const tarball = join(directory, 'emblor-2.0.0-alpha.0.tgz');
  const extraction = join(directory, 'extracted');
  mkdirSync(extraction);
  run(tar, ['-xzf', tarball, '-C', extraction], repositoryRoot);
  return {
    label: 'npm-alpha.0',
    root: join(extraction, 'package'),
    tarballBytes: statSync(tarball).size,
  };
}

function localPackage() {
  run(pnpm, ['run', 'build'], packageRoot);
  return { label: 'origin-main', root: packageRoot };
}

async function buildFixture(target, react, instrumented) {
  const outDir = join(
    workspace,
    'builds',
    `${target.label}-react-${react.version}-${instrumented ? 'renders' : 'latency'}`,
  );
  const reactModules = join(react.directory, 'node_modules');
  await build({
    root: fixtureRoot,
    logLevel: 'warn',
    plugins: instrumented ? [instrumentEmblor(target.root)] : [],
    resolve: {
      alias: [
        { find: 'react-dom/client', replacement: join(reactModules, 'react-dom', 'client.js') },
        { find: 'react-dom', replacement: join(reactModules, 'react-dom', 'index.js') },
        { find: 'react/jsx-runtime', replacement: join(reactModules, 'react', 'jsx-runtime.js') },
        { find: 'react', replacement: join(reactModules, 'react', 'index.js') },
        { find: 'emblor', replacement: join(target.root, 'dist', 'index.js') },
      ],
      dedupe: ['react', 'react-dom'],
    },
    optimizeDeps: { noDiscovery: true, include: [] },
    build: { outDir, emptyOutDir: true, minify: false },
  });
  return outDir;
}

async function withServer(outDir, port, callback) {
  const server = await preview({
    root: fixtureRoot,
    logLevel: 'error',
    build: { outDir },
    preview: { host: '127.0.0.1', port, strictPort: true },
  });
  try {
    return await callback(`http://127.0.0.1:${port}`);
  } finally {
    await new Promise((resolveClose, rejectClose) =>
      server.httpServer.close((error) => (error ? rejectClose(error) : resolveClose())),
    );
  }
}

function summarize(samples) {
  const sorted = [...samples].sort((a, b) => a - b);
  const percentile = (value) => sorted[Math.min(sorted.length - 1, Math.ceil(sorted.length * value) - 1)];
  return {
    samples: sorted.length,
    medianMs: percentile(0.5),
    p95Ms: percentile(0.95),
    minMs: sorted[0],
    maxMs: sorted.at(-1),
  };
}

const report = {
  generatedAt: new Date().toISOString(),
  browser: { executable: chromePath },
  method: { warmups: 5, samples: 25, navigationSamples: 250, sizes: [10, 200] },
  targets: [],
};

let browser;
try {
  const targets = sourceOnly ? [localPackage()] : [publishedPackage(), localPackage()];
  const reacts = [installReact(18), installReact(19)];
  browser = await chromium.launch({ executablePath: chromePath, headless: true });
  let port = 4310;
  for (const target of targets) {
    for (const react of reacts) {
      const renderBuild = await buildFixture(target, react, true);
      const latencyBuild = await buildFixture(target, react, false);
      for (const controlled of [false, true]) {
        for (const size of report.method.sizes) {
          const scenario = { target: target.label, react: react.version, controlled, size };
          const context = await browser.newContext();
          try {
            const renderData = await withServer(renderBuild, port++, async (baseURL) => {
              const page = await context.newPage();
              await page.goto(`${baseURL}/?controlled=${controlled}&size=${size}`);
              await page.waitForFunction(() => window.__EMBLOR_READY__ === true);
              return page.evaluate(() =>
                window.__EMBLOR_RUN_BENCHMARK__({ warmups: 0, samples: 0, navigationSamples: 0 }),
              );
            });
            const latencyData = await withServer(latencyBuild, port++, async (baseURL) => {
              const page = await context.newPage();
              await page.goto(`${baseURL}/?controlled=${controlled}&size=${size}`);
              await page.waitForFunction(() => window.__EMBLOR_READY__ === true);
              return page.evaluate(() =>
                window.__EMBLOR_RUN_BENCHMARK__({
                  warmups: 5,
                  samples: 25,
                  navigationSamples: 250,
                }),
              );
            });
            report.targets.push({
              ...scenario,
              renderCounts: renderData.renderCounts,
              latency: {
                draft: summarize(latencyData.latencySamplesMs.draft),
                add: summarize(latencyData.latencySamplesMs.add),
                remove: summarize(latencyData.latencySamplesMs.remove),
                navigation: summarize(latencyData.latencySamplesMs.navigation),
              },
            });
          } finally {
            await context.close();
          }
        }
      }
    }
  }
  mkdirSync(dirname(outputPath), { recursive: true });
  writeFileSync(outputPath, `${JSON.stringify(report, null, 2)}\n`);
  console.log(`Performance report written to ${outputPath}`);
} finally {
  await browser?.close();
  rmSync(workspace, { recursive: true, force: true });
}
