import { mkdirSync, writeFileSync } from 'node:fs';
import { resolve } from 'node:path';

import { registryIndex, registryItems } from '../registry/registry.ts';

const publicRegistryRoot = resolve(process.cwd(), 'public', 'r');
mkdirSync(publicRegistryRoot, { recursive: true });

writeFileSync(resolve(process.cwd(), 'registry.json'), `${JSON.stringify(registryIndex, null, 2)}\n`);
writeFileSync(resolve(publicRegistryRoot, 'registry.json'), `${JSON.stringify(registryIndex, null, 2)}\n`);
writeFileSync(resolve(publicRegistryRoot, 'index.json'), `${JSON.stringify(registryIndex, null, 2)}\n`);

for (const item of registryItems) {
  writeFileSync(resolve(publicRegistryRoot, `${item.name}.json`), `${JSON.stringify(item, null, 2)}\n`);
}
