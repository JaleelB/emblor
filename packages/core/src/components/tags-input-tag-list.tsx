import * as React from 'react';
import type { EmblorTagListProps } from '@emblor/types';
import { mergeRefs, useStoreSelector } from '@emblor/utils';
import { useEmblorContext } from '../tags-input-context';

export const EmblorTagList = React.forwardRef<HTMLElement, EmblorTagListProps>(
  function EmblorTagList(props, forwardedRef) {
    const { as, id, children, ...rest } = props;
    const { store, listId, listRef, labelId, disabled, readOnly } = useEmblorContext('Emblor.TagList');
    const Component = (as ?? 'div') as React.ElementType;
    const tagCount = useStoreSelector(store, function selectCount(state) {
      return state.tags.length;
    });
    const mergedRef = mergeRefs(listRef, forwardedRef);

    return (
      <Component
        {...rest}
        ref={mergedRef}
        id={id ?? listId}
        role="list"
        aria-labelledby={labelId}
        data-empty={tagCount === 0 ? '' : undefined}
        data-disabled={disabled ? '' : undefined}
        data-readonly={readOnly ? '' : undefined}
      >
        {children}
      </Component>
    );
  },
);
