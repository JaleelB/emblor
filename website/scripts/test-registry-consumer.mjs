import { execFileSync } from 'node:child_process';
import { existsSync, mkdirSync, mkdtempSync, readFileSync, rmSync, writeFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

const websiteDirectory = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const repositoryRoot = resolve(websiteDirectory, '..');
const packageManager = process.platform === 'win32' ? 'pnpm.cmd' : 'pnpm';
const registryBaseUrl = (process.env.REGISTRY_BASE_URL ?? 'http://127.0.0.1:4500').replace(/\/$/, '');
const registryIndexUrl = `${registryBaseUrl}/r/registry.json`;

function run(command, args, options = {}) {
  try {
    return execFileSync(command, args, {
      cwd: options.cwd ?? repositoryRoot,
      encoding: 'utf8',
      stdio: ['ignore', 'pipe', 'pipe'],
      shell: process.platform === 'win32' && /\.cmd$/i.test(command),
      env: { ...process.env, ...options.env },
    });
  } catch (error) {
    const stdout = error.stdout?.toString().trim();
    const stderr = error.stderr?.toString().trim();
    if (stdout) console.error(stdout);
    if (stderr) console.error(stderr);
    throw error;
  }
}

function runShadcn(cwd, args) {
  const [command, ...commandArgs] = args;
  return run(packageManager, ['-C', websiteDirectory, 'exec', 'shadcn', command, '--cwd', cwd, ...commandArgs], {
    cwd: repositoryRoot,
  });
}

function writeJson(path, value) {
  writeFileSync(path, `${JSON.stringify(value, null, 2)}\n`);
}

async function assertRegistryIsReachable() {
  const response = await fetch(registryIndexUrl);
  if (!response.ok) {
    throw new Error(`Registry index ${registryIndexUrl} returned HTTP ${response.status}`);
  }
}

const consumerDirectory = mkdtempSync(resolve(tmpdir(), 'emblor-registry-consumer-'));

try {
  await assertRegistryIsReachable();

  writeJson(resolve(consumerDirectory, 'package.json'), {
    name: 'emblor-registry-consumer-fixture',
    private: true,
    type: 'module',
    packageManager: 'pnpm@9.15.0',
    dependencies: {
      react: '19.2.8',
      'react-dom': '19.2.8',
    },
    devDependencies: {
      '@types/react': '19.2.18',
      '@types/react-dom': '19.2.4',
      typescript: '5.9.3',
    },
  });

  writeJson(resolve(consumerDirectory, 'components.json'), {
    $schema: 'https://ui.shadcn.com/schema.json',
    style: 'new-york',
    rsc: false,
    tsx: true,
    tailwind: {
      config: '',
      css: 'app/globals.css',
      baseColor: 'neutral',
      cssVariables: true,
      prefix: '',
    },
    aliases: {
      components: '@/components',
      utils: '@/lib/utils',
      ui: '@/components/ui',
      lib: '@/lib',
      hooks: '@/hooks',
    },
    registries: {
      '@emblor': `${registryBaseUrl}/r/{name}.json`,
    },
  });

  writeFileSync(
    resolve(consumerDirectory, 'tsconfig.json'),
    `${JSON.stringify(
      {
        compilerOptions: {
          baseUrl: '.',
          target: 'ES2022',
          lib: ['DOM', 'ES2022'],
          module: 'ESNext',
          moduleResolution: 'Bundler',
          jsx: 'react-jsx',
          paths: { '@/*': ['./*'] },
          strict: true,
          skipLibCheck: true,
          noEmit: true,
        },
        include: ['components/**/*.tsx'],
      },
      null,
      2,
    )}\n`,
  );

  mkdirSync(resolve(consumerDirectory, 'app'), { recursive: true });
  mkdirSync(resolve(consumerDirectory, 'lib'), { recursive: true });
  writeFileSync(resolve(consumerDirectory, 'app', 'globals.css'), '');
  writeFileSync(
    resolve(consumerDirectory, 'lib', 'utils.ts'),
    "export function cn(...values: unknown[]) { return values.filter(Boolean).join(' '); }\n",
  );

  run(packageManager, ['install', '--ignore-scripts'], { cwd: consumerDirectory });

  const expectedItems = [
    'tag-input-basic',
    'tag-input-controlled',
    'tag-input-validation',
    'tag-input-native-form',
    'tag-input-react-hook-form',
    'tag-input-accessibility',
    'tag-input-constraints',
    'tag-input-popover',
    'tag-input-dialog',
    'tag-input-reorder',
  ];
  const listOutput = JSON.parse(runShadcn(consumerDirectory, ['list', '@emblor', '--json']));
  const listedNames = new Set(listOutput.items?.map((item) => item.name));
  for (const name of expectedItems) {
    if (!listedNames.has(name)) throw new Error(`Clean consumer list is missing ${name}`);
  }

  const viewOutput = JSON.parse(runShadcn(consumerDirectory, ['view', '@emblor/tag-input-basic']));
  if (viewOutput[0]?.name !== 'tag-input-basic' || !viewOutput[0]?.files?.[0]?.content?.includes("from 'emblor'")) {
    throw new Error('Clean consumer view did not return the basic Emblor item source');
  }

  for (const name of expectedItems) {
    runShadcn(consumerDirectory, ['add', `@emblor/${name}`, '-y']);
  }

  for (const name of expectedItems) {
    const installedFile = resolve(consumerDirectory, 'components', 'ui', `${name}.tsx`);
    if (!existsSync(installedFile)) throw new Error(`Clean consumer did not install ${name}`);
    if (!readFileSync(installedFile, 'utf8').includes("from 'emblor'")) {
      throw new Error(`Installed ${name} does not import the public package root`);
    }
  }

  const consumerPackage = JSON.parse(readFileSync(resolve(consumerDirectory, 'package.json'), 'utf8'));
  if (consumerPackage.dependencies?.emblor !== '2.0.0-alpha.1') {
    throw new Error(`Clean consumer resolved ${consumerPackage.dependencies?.emblor ?? 'no'} emblor dependency`);
  }

  run(packageManager, ['exec', 'tsc', '--noEmit'], { cwd: consumerDirectory });
  console.log(`✓ clean registry consumer passed: list/view/add/tsc (${consumerDirectory})`);
} finally {
  if (process.env.KEEP_REGISTRY_CONSUMER === '1') {
    console.log(`Registry consumer preserved at ${consumerDirectory}`);
  } else {
    rmSync(consumerDirectory, { recursive: true, force: true });
  }
}
