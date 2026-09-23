import { readFileSync } from 'node:fs';
import { resolve } from 'node:path';

// Keep the authored files at the same consumer-facing paths listed in the
// source registry. This lets the official shadcn validator verify the source
// registry instead of relying only on the generated `content` field.
const registryRoot = resolve(process.cwd(), 'components', 'emblor');

type RegistryItem = {
  $schema: string;
  name: string;
  type: 'registry:ui';
  title: string;
  description: string;
  dependencies: string[];
  registryDependencies: string[];
  files: Array<{ path: string; type: 'registry:ui'; content: string }>;
};

const definitions = [
  [
    'tag-input-basic',
    'Basic compound field',
    'An accessible uncontrolled field with tags, removal, input, and clear actions.',
    ['emblor@2.0.0-alpha.1'],
    [],
  ],
  [
    'tag-input-controlled',
    'Controlled state',
    'A complete field with controlled committed values and draft text.',
    ['emblor@2.0.0-alpha.1'],
    [],
  ],
  [
    'tag-input-validation',
    'Validation and rejection',
    'A hashtag field that transforms input and explains rejected values.',
    ['emblor@2.0.0-alpha.1'],
    [],
  ],
  [
    'tag-input-native-form',
    'Native form field',
    'A working form with repeated values, required validation, submit, and reset.',
    ['emblor@2.0.0-alpha.1'],
    [],
  ],
  [
    'tag-input-react-hook-form',
    'React Hook Form + Zod',
    'Validate and submit an Emblor field with React Hook Form, Zod, and shadcn Field.',
    ['emblor@2.0.0-alpha.1', 'react-hook-form@7.87.0', '@hookform/resolvers@5.9.1', 'zod@4.4.3'],
    ['button', 'field'],
  ],
  [
    'tag-input-accessibility',
    'Accessible error field',
    'A labeled field with associated help, errors, and built-in announcements.',
    ['emblor@2.0.0-alpha.1'],
    [],
  ],
  [
    'tag-input-constraints',
    'Limits and bulk entry',
    'Try minimum and maximum tags, duplicate rejection, delimiters, paste, and blur commit.',
    ['emblor@2.0.0-alpha.1'],
    [],
  ],
  [
    'tag-input-popover',
    'cmdk + Popover suggestions',
    'Search and select suggestions with shadcn Command and Popover.',
    ['emblor@2.0.0-alpha.1', 'lucide-react@1.32.0'],
    ['command', 'popover'],
  ],
  [
    'tag-input-dialog',
    'Dialog composition',
    'Edit a complete Emblor field inside a shadcn Dialog.',
    ['emblor@2.0.0-alpha.1', 'class-variance-authority@0.7.1', 'lucide-react@1.32.0'],
    ['button', 'dialog'],
  ],
  [
    'tag-input-reorder',
    'Drag to reorder',
    'Drag tags or use keyboard controls while preserving stable item IDs.',
    ['emblor@2.0.0-alpha.1', 'react-easy-sort@1.8.0'],
    [],
  ],
] as const;

export const registryItems: RegistryItem[] = definitions.map(
  ([name, title, description, dependencies, registryDependencies]) => ({
    $schema: 'https://ui.shadcn.com/schema/registry-item.json',
    name,
    type: 'registry:ui',
    title,
    description,
    dependencies: [...dependencies],
    registryDependencies: [...registryDependencies],
    files: [
      {
        path: `components/emblor/${name}.tsx`,
        type: 'registry:ui',
        content: readFileSync(resolve(registryRoot, `${name}.tsx`), 'utf8'),
      },
    ],
  }),
);

export const registryIndex = {
  $schema: 'https://ui.shadcn.com/schema/registry.json',
  name: 'emblor',
  homepage: 'https://emblor.jaleelbennett.com',
  items: registryItems,
};
