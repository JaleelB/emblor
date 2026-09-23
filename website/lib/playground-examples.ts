import 'server-only';

import type { PlaygroundExample } from '@/components/playground-examples';
import { registryItems } from '@/registry/registry';

const presentation: Record<string, Pick<PlaygroundExample, 'category' | 'tags'>> = {
  'tag-input-basic': { category: 'essentials', tags: ['uncontrolled', 'compound'] },
  'tag-input-controlled': { category: 'essentials', tags: ['controlled', 'draft'] },
  'tag-input-validation': { category: 'behavior', tags: ['transform', 'validate', 'onReject'] },
  'tag-input-native-form': { category: 'forms', tags: ['FormData', 'required', 'reset'] },
  'tag-input-react-hook-form': { category: 'forms', tags: ['React Hook Form', 'Zod', 'shadcn'] },
  'tag-input-accessibility': { category: 'behavior', tags: ['labels', 'errors', 'announcements'] },
  'tag-input-constraints': { category: 'behavior', tags: ['limits', 'paste', 'blur'] },
  'tag-input-popover': { category: 'integrations', tags: ['cmdk', 'popover', 'shadcn'] },
  'tag-input-dialog': { category: 'integrations', tags: ['dialog', 'shadcn', 'focus'] },
  'tag-input-reorder': { category: 'integrations', tags: ['react-easy-sort', 'identity', 'string[]'] },
};

const exampleOrder = [
  'tag-input-basic',
  'tag-input-controlled',
  'tag-input-validation',
  'tag-input-constraints',
  'tag-input-accessibility',
  'tag-input-native-form',
  'tag-input-react-hook-form',
  'tag-input-popover',
  'tag-input-dialog',
  'tag-input-reorder',
];

export const playgroundExamples: PlaygroundExample[] = registryItems
  .map((item) => ({
    slug: item.name,
    title: item.title,
    description: item.description,
    dependencies: item.dependencies,
    registryDependencies: item.registryDependencies,
    code: item.files[0].content,
    ...presentation[item.name],
  }))
  .sort((left, right) => exampleOrder.indexOf(left.slug) - exampleOrder.indexOf(right.slug));

export function getPlaygroundExample(slug: string) {
  return playgroundExamples.find((example) => example.slug === slug);
}
