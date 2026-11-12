'use client';

import dynamic from 'next/dynamic';
import type { ComponentType } from 'react';

export type PlaygroundPreviewState = 'default' | 'disabled' | 'readonly' | 'invalid' | 'capacity';

export type PlaygroundPreviewProps = {
  previewState?: PlaygroundPreviewState;
};

const EmblorBasicField = dynamic(() =>
  import('@/components/emblor/tag-input-basic').then((module) => module.EmblorBasicField),
);
const EmblorControlledField = dynamic(() =>
  import('@/components/emblor/tag-input-controlled').then((module) => module.EmblorControlledField),
);
const EmblorValidationField = dynamic(() =>
  import('@/components/emblor/tag-input-validation').then((module) => module.EmblorValidationField),
);
const EmblorConstraintsField = dynamic(() =>
  import('@/components/emblor/tag-input-constraints').then((module) => module.EmblorConstraintsField),
);
const EmblorAccessibleField = dynamic(() =>
  import('@/components/emblor/tag-input-accessibility').then((module) => module.EmblorAccessibleField),
);
const EmblorNativeFormField = dynamic(() =>
  import('@/components/emblor/tag-input-native-form').then((module) => module.EmblorNativeFormField),
);
const EmblorReactHookFormField = dynamic(() =>
  import('@/components/emblor/tag-input-react-hook-form').then((module) => module.EmblorReactHookFormField),
);
const EmblorSuggestionField = dynamic(() =>
  import('@/components/emblor/tag-input-popover').then((module) => module.EmblorSuggestionField),
);
const EmblorDialogField = dynamic(() =>
  import('@/components/emblor/tag-input-dialog').then((module) => module.EmblorDialogField),
);
const EmblorReorderField = dynamic(() =>
  import('@/components/emblor/tag-input-reorder').then((module) => module.EmblorReorderField),
);

export type PlaygroundExample = {
  slug: string;
  title: string;
  description: string;
  category: string;
  tags: string[];
  code: string;
  dependencies: string[];
  registryDependencies: string[];
};

export const playgroundPreviews: Record<string, ComponentType<PlaygroundPreviewProps>> = {
  'tag-input-basic': EmblorBasicField,
  'tag-input-controlled': EmblorControlledField,
  'tag-input-validation': EmblorValidationField,
  'tag-input-native-form': EmblorNativeFormField,
  'tag-input-react-hook-form': EmblorReactHookFormField,
  'tag-input-accessibility': EmblorAccessibleField,
  'tag-input-constraints': EmblorConstraintsField,
  'tag-input-popover': EmblorSuggestionField,
  'tag-input-dialog': EmblorDialogField,
  'tag-input-reorder': EmblorReorderField,
};
