import * as React from 'react';
import type { EmblorTagCountProps } from '../types';
import { useStoreSelector } from '../utils';
import { useEmblorContext } from '../core';

const defaultFormatter = (count: number, max?: number, mode: 'total' | 'remaining' = 'total'): string => {
  if (mode === 'remaining' && typeof max === 'number') {
    return `${max - count}`;
  }
  return `${count}`;
};

export function TagCount(props: EmblorTagCountProps): JSX.Element {
  const { as, mode = 'total', maxTags, formatter = defaultFormatter, ...rest } = props;
  const { store, maxTags: maxTagsFromContext } = useEmblorContext('TagCount');
  const Component = (as ?? 'span') as React.ElementType;
  const count = useStoreSelector(store, function selectCount(state) {
    return state.tags.length;
  });
  const resolvedMax = maxTags ?? maxTagsFromContext;
  const remaining = resolvedMax !== undefined ? Math.max(resolvedMax - count, 0) : undefined;
  const displayCount = mode === 'remaining' && remaining !== undefined ? remaining : count;
  const value = formatter(displayCount, resolvedMax);

  return (
    <Component
      {...rest}
      data-mode={mode}
      data-remaining={remaining !== undefined ? remaining : undefined}
      data-count={count}
    >
      {value}
    </Component>
  );
}
