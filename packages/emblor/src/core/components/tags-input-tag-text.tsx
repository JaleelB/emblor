import * as React from 'react';
import type { EmblorTagTextComponent, EmblorTagTextProps } from '../../types';
import { useEmblorTagContext } from '../tags-input-context';

const EmblorTagTextImpl = React.forwardRef<HTMLElement, EmblorTagTextProps<any>>(
  function EmblorTagText(props, forwardedRef) {
    const { as, children, ...rest } = props;
    const { value } = useEmblorTagContext('EmblorTagText');
    const Component = (as ?? 'span') as React.ElementType;
    return (
      <Component {...(rest as Record<string, unknown>)} ref={forwardedRef}>
        {children !== undefined ? children : value}
      </Component>
    );
  },
);

export const EmblorTagText = EmblorTagTextImpl as EmblorTagTextComponent;
