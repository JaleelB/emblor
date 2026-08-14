import { execFileSync } from 'node:child_process';
import { createHash } from 'node:crypto';
import { mkdirSync, mkdtempSync, readFileSync, readdirSync, rmSync, statSync, writeFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { dirname, join, resolve, sep } from 'node:path';
import { fileURLToPath } from 'node:url';

const packageRoot = resolve(fileURLToPath(new URL('../..', import.meta.url)));
const repositoryRoot = resolve(packageRoot, '..', '..');
const npm = process.platform === 'win32' ? 'npm.cmd' : 'npm';
const pnpm = process.platform === 'win32' ? 'pnpm.cmd' : 'pnpm';
const node = process.execPath;
const workspace = mkdtempSync(join(tmpdir(), 'emblor-packed-consumers-'));
const tarballDirectory = join(workspace, 'package');
const suppliedTarballPath = process.env.EMBLOR_TARBALL ? resolve(process.env.EMBLOR_TARBALL) : null;
const reportPath = process.env.EMBLOR_COMPAT_REPORT ? resolve(process.env.EMBLOR_COMPAT_REPORT) : null;
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
const consumerReports = [];
const platformPackagePattern = /^(?:@esbuild\/(?:aix|android|darwin|freebsd|linux|netbsd|openbsd|sunos|win32)-|@rollup\/rollup-|fsevents$)/;

mkdirSync(tarballDirectory);

function childEnvironment() {
  const environment = { ...process.env };
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
    env: childEnvironment(),
    shell: options.shell ?? (process.platform === 'win32' && /\.(?:cmd|bat)$/i.test(command)),
  });
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

function directoryBytes(directory, predicate = () => true) {
  return collectFiles(directory)
    .filter(predicate)
    .reduce((total, path) => total + statSync(path).size, 0);
}

function normalizeForFingerprint(value) {
  if (Array.isArray(value)) {
    return value.filter((entry) => !(entry && typeof entry === 'object' && entry.optional === true)).map(normalizeForFingerprint);
  }
  if (value && typeof value === 'object') {
    return Object.fromEntries(
      Object.entries(value)
        .filter(
          ([key, nestedValue]) =>
            !platformPackagePattern.test(key) &&
            !(nestedValue && typeof nestedValue === 'object' && nestedValue.optional === true) &&
            !(nestedValue && typeof nestedValue === 'object' && platformPackagePattern.test(nestedValue.name ?? '')),
        )
        .sort(([left], [right]) => left.localeCompare(right))
        .map(([key, nestedValue]) => [
          key,
          key === 'emblor' ? { version: '1.4.8' } : normalizeForFingerprint(nestedValue),
        ]),
    );
  }
  if (typeof value !== 'string') return value;
  return value
    .replaceAll(workspace.replaceAll('\\', '/'), '<workspace>')
    .replaceAll(workspace.replaceAll('/', '\\'), '<workspace>');
}

function dependencyGraphSha256(directory) {
  const dependencyGraph = JSON.parse(
    run(pnpm, ['list', '--json', '--depth', 'Infinity'], directory, { capture: true }),
  );
  const normalizedGraph = normalizeForFingerprint(dependencyGraph);
  return createHash('sha256').update(JSON.stringify(normalizedGraph)).digest('hex');
}

function isInside(path, directory) {
  const normalizedPath = resolve(path).toLowerCase();
  const normalizedDirectory = `${resolve(directory).toLowerCase()}${sep}`;
  return normalizedPath.startsWith(normalizedDirectory);
}

function writeConsumer(reactVersion, tarballPath) {
  const major = reactVersion.split('.')[0];
  const directory = join(workspace, `react-${major}`);
  const sourceDirectory = join(directory, 'src');
  mkdirSync(sourceDirectory, { recursive: true });

  writeJson(join(directory, 'package.json'), {
    private: true,
    type: 'module',
    scripts: {
      typecheck: 'tsc --noEmit',
      'build:client': 'vite build --outDir dist-client',
      verify: 'tsx ./runtime.tsx',
      modules: 'node ./module-check.mjs',
    },
    dependencies: {
      emblor: `file:${tarballPath.replaceAll('\\', '/')}`,
      react: reactVersion,
      'react-dom': reactVersion,
    },
    devDependencies: {
      '@types/react': major === '18' ? '18.3.31' : '19.2.18',
      '@types/react-dom': major === '18' ? '18.3.7' : '19.2.4',
      '@types/jsdom': '21.1.7',
      jsdom: '26.1.0',
      tsx: '4.23.12',
      typescript: '5.9.3',
      vite: '5.4.21',
    },
  });

  writeJson(join(directory, 'tsconfig.json'), {
    compilerOptions: {
      strict: true,
      target: 'ES2020',
      lib: ['ES2020', 'DOM'],
      jsx: 'react-jsx',
      module: 'ESNext',
      moduleResolution: 'Bundler',
      noEmit: true,
    },
    include: ['src', '*.tsx'],
  });

  writeFileSync(
    join(directory, 'index.html'),
    `<!doctype html>
<html lang="en">
  <head><meta charset="UTF-8" /><title>Emblor packed consumer</title></head>
  <body><div id="app"></div><script type="module" src="/src/main.tsx"></script></body>
</html>
`,
  );

  writeFileSync(
    join(sourceDirectory, 'main.tsx'),
    `import * as React from 'react';
import { createRoot } from 'react-dom/client';
import {
  EmblorClear,
  EmblorInput,
  EmblorLabel,
  EmblorRoot,
  EmblorTag,
  EmblorTagList,
  EmblorTagRemove,
  EmblorTagText,
  type EmblorValueChangeDetails,
} from 'emblor';

const CustomInput = React.forwardRef<HTMLInputElement, React.ComponentPropsWithoutRef<'input'>>(
  function CustomInput(props, ref) {
    return <input {...props} ref={ref} />;
  },
);

const CustomButton = React.forwardRef<HTMLButtonElement, React.ComponentPropsWithoutRef<'button'>>(
  function CustomButton(props, ref) {
    return <button {...props} ref={ref} />;
  },
);

function PackedConsumer() {
  const [tags, setTags] = React.useState<string[]>(['react']);
  const [draft, setDraft] = React.useState('');
  const inputRef = React.useRef<HTMLInputElement>(null);
  const rootRef = React.useRef<HTMLElement>(null);
  const handleValueChange = (next: string[], details: EmblorValueChangeDetails) => {
    void details;
    setTags(next);
  };

  return (
    <>
      <EmblorRoot
        ref={rootRef}
        as="section"
        value={tags}
        onValueChange={handleValueChange}
        inputValue={draft}
        onInputValueChange={setDraft}
        name="skills[]"
        required
        className="root"
        style={{ display: 'grid' }}
        data-consumer="packed"
        aria-label="Skills"
        onFocus={() => undefined}
      >
        <EmblorLabel as="span" className="label">Skills</EmblorLabel>
        <EmblorTagList as="ul" aria-live="polite">
          {(tag, index) => (
            <EmblorTag as="li" key={tag + '-' + index} index={index} data-tag={tag}>
              <EmblorTagText as="strong" />
              <EmblorTagRemove as={CustomButton} aria-label={'Remove ' + tag} onClick={() => undefined} />
            </EmblorTag>
          )}
        </EmblorTagList>
        <EmblorInput
          as={CustomInput}
          ref={inputRef}
          aria-describedby="skills-help"
          data-input="packed"
          onChange={(event) => void event.currentTarget.value}
        />
        <EmblorClear as={CustomButton} onKeyDown={(event) => void event.key}>Clear</EmblorClear>
      </EmblorRoot>
      <EmblorRoot as="section" defaultValue={['textarea']}>
        <EmblorTagList />
        <EmblorInput as="textarea" rows={2} style={{ resize: 'none' }} />
      </EmblorRoot>
      <span id="skills-help">Packed consumer</span>
    </>
  );
}

createRoot(document.getElementById('app')!).render(<PackedConsumer />);
`,
  );

  writeFileSync(
    join(directory, 'runtime.tsx'),
    `import * as React from 'react';
import { flushSync } from 'react-dom';
import { createRoot } from 'react-dom/client';
import { JSDOM } from 'jsdom';
import { EmblorInput, EmblorRoot, EmblorTag, EmblorTagList, EmblorTagText } from 'emblor';

const dom = new JSDOM('<!doctype html><div id="app"></div>');
Object.assign(globalThis, {
  window: dom.window,
  document: dom.window.document,
  Node: dom.window.Node,
  HTMLElement: dom.window.HTMLElement,
  HTMLInputElement: dom.window.HTMLInputElement,
  HTMLTextAreaElement: dom.window.HTMLTextAreaElement,
  HTMLFormElement: dom.window.HTMLFormElement,
});
const controlled = ['react'];
const container = document.getElementById('app');
if (!container) throw new Error('Packed consumer fixture container was not created');
const root = createRoot(container);
flushSync(() => root.render(
  <EmblorRoot value={controlled} onValueChange={() => undefined}>
    <EmblorTagList>{(tag, index) => <EmblorTag key={tag + '-' + index} index={index}><EmblorTagText /></EmblorTag>}</EmblorTagList>
    <EmblorInput onChange={(event) => void event.currentTarget.value} />
  </EmblorRoot>,
));
if (!container.innerHTML.includes('react') || !container.innerHTML.includes('role="textbox"')) throw new Error('Packed consumer render failed');
flushSync(() => root.unmount());
`,
  );

  writeFileSync(
    join(directory, 'module-check.mjs'),
    `import * as esm from 'emblor';
import { createRequire } from 'node:module';

const require = createRequire(import.meta.url);
const cjs = require('emblor');
const expected = ${JSON.stringify(expectedExports)};
const esmKeys = Object.keys(esm).sort();
const cjsKeys = Object.keys(cjs).sort();
if (JSON.stringify(esmKeys) !== JSON.stringify(expected)) throw new Error('ESM export set drifted');
if (JSON.stringify(cjsKeys) !== JSON.stringify(expected)) throw new Error('CJS export set drifted');
for (const name of expected) {
  if (typeof esm[name] !== 'object' && typeof esm[name] !== 'function') throw new Error('ESM export ' + name + ' is not loadable');
  if (typeof cjs[name] !== 'object' && typeof cjs[name] !== 'function') throw new Error('CJS export ' + name + ' is not loadable');
}
if (require('emblor/package.json').name !== 'emblor') throw new Error('Package metadata export is not loadable');

for (const specifier of ['emblor/src/index', 'emblor/dist/index.js', 'emblor/addons']) {
  let resolved = false;
  try {
    await import(specifier);
    resolved = true;
  } catch {}
  if (resolved) throw new Error('Unsupported ESM subpath resolved: ' + specifier);
  try {
    require(specifier);
    throw new Error('Unsupported CJS subpath resolved: ' + specifier);
  } catch (error) {
    if (error instanceof Error && error.message.startsWith('Unsupported CJS subpath')) throw error;
  }
}
`,
  );

  const readme = readFileSync(join(packageRoot, 'README.md'), 'utf8');
  const readmeExamples = Array.from(readme.matchAll(/```tsx\r?\n([\s\S]*?)```/g), (match) => match[1]);
  readmeExamples.forEach((example, index) => {
    writeFileSync(join(directory, `readme-example-${index}.tsx`), example);
  });

  run(pnpm, ['install', '--lockfile-only', '--no-frozen-lockfile', '--ignore-scripts'], directory);
  run(pnpm, ['install', '--frozen-lockfile', '--ignore-scripts'], directory);

  const resolvedPackageJson = run(node, ['-p', "require.resolve('emblor/package.json')"], directory, { capture: true })
    .trim()
    .split(/\r?\n/)
    .at(-1);
  if (
    !resolvedPackageJson ||
    !isInside(resolvedPackageJson, directory) ||
    isInside(resolvedPackageJson, repositoryRoot)
  ) {
    throw new Error(
      `Packed consumer resolved emblor outside its isolated installation: ${resolvedPackageJson ?? '<none>'}`,
    );
  }

  run(pnpm, ['run', 'typecheck'], directory);
  run(pnpm, ['run', 'build:client'], directory);
  run(pnpm, ['run', 'verify'], directory);
  run(pnpm, ['run', 'modules'], directory);

  const bundleBytes = directoryBytes(join(directory, 'dist-client'), (path) => path.endsWith('.js'));
  if (bundleBytes <= 0) throw new Error(`React ${major} production bundle was empty`);
  consumerReports.push({ reactVersion, bundleBytes, dependencyGraphSha256: dependencyGraphSha256(directory) });
}

let tarballPath = suppliedTarballPath;
try {
  if (!tarballPath) {
    run(npm, ['pack', '--pack-destination', tarballDirectory, '--ignore-scripts'], packageRoot);
    const packageManifest = JSON.parse(readFileSync(join(packageRoot, 'package.json'), 'utf8'));
    tarballPath = join(tarballDirectory, `emblor-${packageManifest.version}.tgz`);
  }

  if (!tarballPath || !statSync(tarballPath, { throwIfNoEntry: false })) {
    throw new Error(`Packed consumer verification could not find tarball: ${tarballPath ?? '<none>'}`);
  }

  writeConsumer('18.3.1', tarballPath);
  writeConsumer('19.1.1', tarballPath);

  const report = { consumers: consumerReports };
  if (reportPath) writeJson(reportPath, report);
  else console.log(JSON.stringify(report, null, 2));
} finally {
  rmSync(workspace, { recursive: true, force: true });
}
