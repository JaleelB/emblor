import { execFileSync } from 'node:child_process';
import { fileURLToPath } from 'node:url';
import { resolve } from 'node:path';

const repositoryRoot = resolve(fileURLToPath(new URL('..', import.meta.url)));
const packageManager = process.platform === 'win32' ? 'pnpm.cmd' : 'pnpm';
const skipInstall = process.argv.includes('--skip-install');

function runStep(name, args) {
  console.log(`\n[distribution] ${name}`);
  execFileSync(packageManager, args, {
    cwd: repositoryRoot,
    stdio: 'inherit',
    shell: process.platform === 'win32' && /\.(?:cmd|bat)$/i.test(packageManager),
  });
}

if (!skipInstall) {
  runStep('Install dependencies with the committed lockfile', ['install', '--frozen-lockfile']);
}

runStep('Check formatting', ['run', 'distribution:format']);
runStep('Build package artifacts', ['run', 'distribution:build']);
runStep('Lint package', ['run', 'distribution:lint']);
runStep('Typecheck package', ['run', 'distribution:typecheck']);
runStep('Run package tests', ['run', 'distribution:test']);
runStep('Test release boundary policy', ['run', 'distribution:release-boundary']);
runStep('Verify the packed distribution artifact', ['run', 'distribution:artifact']);

console.log('\n[distribution] Distribution gate passed.');
