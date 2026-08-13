import { readFileSync } from 'node:fs';
import { join } from 'node:path';
import { describe, expect, it } from 'vitest';

const packageRoot = process.cwd();

describe('Emblor package boundary', () => {
  it('exposes only the root package and package metadata', () => {
    const packageJson = JSON.parse(readFileSync(join(packageRoot, 'package.json'), 'utf8')) as {
      exports: Record<string, unknown>;
    };
    expect(Object.keys(packageJson.exports).sort()).toEqual(['.', './package.json']);
  });

  it('does not expose provisional aliases in the public source', () => {
    const source = readFileSync(join(packageRoot, 'src', 'index.ts'), 'utf8');
    expect(source).toContain('EmblorClear');
    expect(source).not.toContain('EmblorClearTrigger');
    expect(source).not.toContain('useEmblorContext');
  });

  it('keeps the accepted Node and CI-only enforcement policy exact', () => {
    const root = join(packageRoot, '..', '..');
    const rootPackage = JSON.parse(readFileSync(join(root, 'package.json'), 'utf8')) as {
      engines: { node: string };
      scripts: Record<string, string>;
      devDependencies: Record<string, string>;
    };
    const packageManifest = JSON.parse(readFileSync(join(packageRoot, 'package.json'), 'utf8')) as {
      engines?: unknown;
      scripts: Record<string, string>;
    };
    const workflow = readFileSync(join(root, '.github', 'workflows', 'ci.yml'), 'utf8');
    expect(rootPackage.engines.node).toBe('>=22 <23 || >=24 <25');
    expect(rootPackage.scripts).not.toHaveProperty('prepare');
    expect(rootPackage.devDependencies).not.toHaveProperty('husky');
    expect(rootPackage.devDependencies).not.toHaveProperty('lint-staged');
    expect(packageManifest.engines).toBeUndefined();
    expect(packageManifest.scripts).toHaveProperty('test:compat');
    expect(workflow).toContain('node-version: [22.x, 24.x]');
    expect(workflow).toContain('run test:compat');
  });
});
