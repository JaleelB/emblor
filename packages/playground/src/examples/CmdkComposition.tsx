import * as React from 'react';
import { EmblorRoot, EmblorInput, EmblorTagList, EmblorTag, EmblorTagRemove } from '@emblor/core';

const CommandRoot = React.forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(
  function CommandRoot(props, ref) {
    const { children, ...rest } = props;
    return (
      <div {...rest} ref={ref} data-cmdk-root>
        {children}
      </div>
    );
  },
);

const CommandInput = React.forwardRef<HTMLInputElement, React.InputHTMLAttributes<HTMLInputElement>>(
  function CommandInput(props, ref) {
    return <input {...props} ref={ref} data-cmdk-input />;
  },
);

const CommandList = React.forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(
  function CommandList(props, ref) {
    const { children, ...rest } = props;
    return (
      <div {...rest} ref={ref} data-cmdk-list>
        {children}
      </div>
    );
  },
);

const CommandItem = React.forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(
  function CommandItem(props, ref) {
    const { children, ...rest } = props;
    return (
      <div {...rest} ref={ref} data-cmdk-item>
        {children}
      </div>
    );
  },
);

export function CmdkCompositionExample(): JSX.Element {
  const [tags, setTags] = React.useState<Array<string>>(['spacing', 'color']);
  const labelId = React.useId().replace(/:/g, '');

  return (
    <section>
      <header>
        <h2>cmdk composition</h2>
      </header>
      <CommandRoot>
        <EmblorRoot labelId={labelId} value={tags} onValueChange={setTags} delimiter={[',', 'Enter']}>
          <span id={labelId} data-cmdk-label>
            Command palette filters
          </span>
          <EmblorTagList as={CommandList} data-surface="selection">
            {tags.map(function renderTag(tag, index) {
              return (
                <EmblorTag key={`${tag}-${index}`} index={index} as={CommandItem} data-role="tag">
                  <span>{tag}</span>
                  <EmblorTagRemove index={index} aria-label={`Remove ${tag}`} />
                </EmblorTag>
              );
            })}
          </EmblorTagList>
          <EmblorInput as={CommandInput} placeholder="Add filter" />
          <CommandList data-surface="suggestions">
            <CommandItem data-suggestion="spacing">Spacing</CommandItem>
            <CommandItem data-suggestion="color">Color system</CommandItem>
            <CommandItem data-suggestion="animation">Motion tokens</CommandItem>
          </CommandList>
        </EmblorRoot>
      </CommandRoot>
    </section>
  );
}
