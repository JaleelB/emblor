import { execFileSync } from 'node:child_process';
import { mkdtempSync, mkdirSync, readFileSync, rmSync, writeFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

const packageRoot = resolve(fileURLToPath(new URL('../..', import.meta.url)));
const npm = process.platform === 'win32' ? 'npm.cmd' : 'npm';
const pnpm = process.platform === 'win32' ? 'pnpm.cmd' : 'pnpm';
const workspace = mkdtempSync(join(tmpdir(), 'emblor-packed-consumers-'));
const tarballDirectory = join(workspace, 'package');
mkdirSync(tarballDirectory);

function run(command, args, cwd) {
  execFileSync(command, args, { cwd, stdio: 'inherit', shell: process.platform === 'win32' });
}

function writeConsumer(reactVersion) {
  const major = reactVersion.split('.')[0];
  const directory = join(workspace, `react-${major}`);
  mkdirSync(directory);
  writeFileSync(
    join(directory, 'package.json'),
    JSON.stringify(
      {
        private: true,
        type: 'module',
        scripts: { build: 'tsc --noEmit', verify: 'tsx ./runtime.tsx' },
        dependencies: {
          emblor: `file:${tarballPath.replaceAll('\\', '/')}`,
          react: reactVersion,
          'react-dom': reactVersion,
        },
        devDependencies: {
          '@types/react': `^${major}.0.0`,
          '@types/react-dom': `^${major}.0.0`,
          '@types/jsdom': '^21.1.0',
          jsdom: '^26.0.0',
          tsx: '^4.20.0',
          typescript: '^5.6.0',
        },
      },
      null,
      2,
    ),
  );
  writeFileSync(
    join(directory, 'tsconfig.json'),
    JSON.stringify({
      compilerOptions: {
        strict: true,
        target: 'ES2020',
        lib: ['ES2020', 'DOM'],
        jsx: 'react-jsx',
        module: 'ESNext',
        moduleResolution: 'Bundler',
      },
    }),
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
const container = document.getElementById('app') as HTMLElement;
const root = createRoot(container);
flushSync(() => root.render(
  <EmblorRoot value={controlled} onValueChange={() => undefined}>
    <EmblorTagList>{(tag, index) => <EmblorTag key={tag} index={index}><EmblorTagText /></EmblorTag>}</EmblorTagList>
    <EmblorInput onChange={(event) => void event.currentTarget.value} />
  </EmblorRoot>,
));
if (!container.innerHTML.includes('react') || !container.innerHTML.includes('role="textbox"')) throw new Error('Packed consumer render failed');
flushSync(() => root.unmount());
`,
  );
  const readme = readFileSync(join(packageRoot, 'README.md'), 'utf8');
  const readmeExamples = Array.from(readme.matchAll(/```tsx\r?\n([\s\S]*?)```/g), (match) => match[1]);
  readmeExamples.forEach((example, index) => {
    writeFileSync(join(directory, `readme-example-${index}.tsx`), example);
  });
  run(pnpm, ['install', '--no-frozen-lockfile', '--ignore-scripts'], directory);
  run(pnpm, ['run', 'build'], directory);
  run(pnpm, ['run', 'verify'], directory);
}

let tarballPath;
try {
  run(npm, ['pack', '--pack-destination', tarballDirectory], packageRoot);
  const packageManifest = JSON.parse(readFileSync(join(packageRoot, 'package.json'), 'utf8'));
  tarballPath = join(tarballDirectory, `emblor-${packageManifest.version}.tgz`);
  writeConsumer('18.3.1');
  writeConsumer('19.1.1');
} finally {
  rmSync(workspace, { recursive: true, force: true });
}
