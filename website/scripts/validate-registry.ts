import { existsSync, readFileSync } from 'node:fs';
import { resolve } from 'node:path';

import { registryIndex, registryItems } from '../registry/registry.ts';

type RegistryItem = {
  name: string;
  type: string;
  dependencies?: string[];
  files?: Array<{ path: string; type: string; content: string }>;
};

const registryPath = resolve(process.cwd(), 'registry.json');
const publicRoot = resolve(process.cwd(), 'public', 'r');
const previewMapSource = readFileSync(resolve(process.cwd(), 'components', 'playground-examples.tsx'), 'utf8');
const playgroundDataSource = readFileSync(resolve(process.cwd(), 'lib', 'playground-examples.ts'), 'utf8');
const registry = JSON.parse(readFileSync(registryPath, 'utf8')) as { name: string; items: RegistryItem[] };
const failures: string[] = [];

if (JSON.stringify(registry) !== JSON.stringify(registryIndex)) {
  failures.push('registry.json is stale; run pnpm run generate:registry');
}

if (registry.name !== 'emblor') failures.push('Registry name must be emblor');
if (!registry.items.length) failures.push('Registry must contain items');
if (registry.items.length !== registryItems.length) failures.push('registry.json item count is stale');

const hostedIndexPath = resolve(publicRoot, 'index.json');
if (!existsSync(hostedIndexPath)) failures.push(`Missing hosted registry index ${hostedIndexPath}`);
else if (JSON.stringify(JSON.parse(readFileSync(hostedIndexPath, 'utf8'))) !== JSON.stringify(registryIndex)) {
  failures.push('Hosted registry index drifted from registry source');
}

const hostedCatalogPath = resolve(publicRoot, 'registry.json');
if (!existsSync(hostedCatalogPath)) failures.push(`Missing canonical hosted registry catalog ${hostedCatalogPath}`);
else if (JSON.stringify(JSON.parse(readFileSync(hostedCatalogPath, 'utf8'))) !== JSON.stringify(registryIndex)) {
  failures.push('Canonical hosted registry catalog drifted from registry source');
}

const names = new Set<string>();
for (const item of registry.items) {
  if (names.has(item.name)) failures.push(`Duplicate registry item ${item.name}`);
  names.add(item.name);
  if (!previewMapSource.includes(`@/components/emblor/${item.name}`)) {
    failures.push(`${item.name} preview is not loaded from its canonical registry component`);
  }
  if (!previewMapSource.includes(`'${item.name}':`)) {
    failures.push(`${item.name} is missing from the rendered preview map`);
  }
  if (item.type !== 'registry:ui') failures.push(`${item.name} must be registry:ui`);
  if (!item.dependencies?.includes('emblor@2.0.0-alpha.1')) failures.push(`${item.name} must pin emblor@2.0.0-alpha.1`);
  if (!item.files?.length) failures.push(`${item.name} must include source files`);
  for (const file of item.files ?? []) {
    if (file.type !== 'registry:ui') failures.push(`${item.name}/${file.path} must be registry:ui`);
    if (!/from ['"]emblor['"]/.test(file.content))
      failures.push(`${item.name}/${file.path} must import the package root`);
    if (file.content.includes('packages/emblor') || /\bTagInput\b/.test(file.content)) {
      failures.push(`${item.name}/${file.path} contains forbidden core/v1 coupling`);
    }
  }

  const artifactPath = resolve(publicRoot, `${item.name}.json`);
  if (!existsSync(artifactPath)) failures.push(`Missing hosted artifact ${artifactPath}`);
  else {
    const artifact = JSON.parse(readFileSync(artifactPath, 'utf8')) as RegistryItem;
    if (artifact.name !== item.name || artifact.files?.[0]?.content !== item.files?.[0]?.content) {
      failures.push(`Hosted artifact drift for ${item.name}`);
    }
  }
}

if (!playgroundDataSource.includes('code: item.files[0].content')) {
  failures.push('Displayed and copied playground code must come from the canonical registry item content');
}

if (failures.length) {
  console.error(failures.map((failure) => `✗ ${failure}`).join('\n'));
  process.exit(1);
}

console.log(`✓ registry validated (${registry.items.length} hosted items)`);
