import * as React from 'react';
import {
  EmblorClear,
  EmblorInput,
  EmblorLabel,
  EmblorRoot,
  EmblorTag,
  EmblorTagList,
  EmblorTagRemove,
  EmblorTagText,
  type EmblorValueChangeDetails,
} from '../../src';

const rootRef = React.createRef<HTMLDivElement>();
const inputRef = React.createRef<HTMLInputElement>();
const textareaRef = React.createRef<HTMLTextAreaElement>();
const tagRef = React.createRef<HTMLLIElement>();
const buttonRef = React.createRef<HTMLButtonElement>();

const CustomInput = React.forwardRef<HTMLInputElement, React.ComponentPropsWithoutRef<'input'>>(
  function CustomInput(props, ref) {
    return <input {...props} ref={ref} />;
  },
);

const CustomButton = React.forwardRef<HTMLButtonElement, React.ComponentPropsWithoutRef<'button'>>(
  function CustomButton(props, ref) {
    return <button {...props} ref={ref} />;
  },
);

export function PublicApiFixture() {
  const [values, setValues] = React.useState<string[]>([]);
  const handleChange = (next: string[], details: EmblorValueChangeDetails) => {
    void details;
    setValues(next);
  };

  return (
    <>
      <EmblorRoot ref={rootRef} value={values} onValueChange={handleChange} className="root" data-fixture="root">
        <EmblorLabel className="label">Tags</EmblorLabel>
        <EmblorTagList>
          {(tag, index) => (
            <EmblorTag ref={tagRef} as="li" key={`${tag}-${index}`} index={index}>
              <EmblorTagText as="strong" />
              <EmblorTagRemove />
            </EmblorTag>
          )}
        </EmblorTagList>
        <EmblorInput ref={inputRef} placeholder="Tag" onChange={(event) => void event.currentTarget.value} />
        <EmblorClear>Clear</EmblorClear>
      </EmblorRoot>
      <EmblorRoot defaultValue={['custom']}>
        <EmblorTagList>
          {(tag, index) => (
            <EmblorTag key={tag} index={index}>
              <EmblorTagText />
              <EmblorTagRemove as={CustomButton} ref={buttonRef} onClick={(event) => void event.currentTarget} />
            </EmblorTag>
          )}
        </EmblorTagList>
        <EmblorInput as={CustomInput} ref={inputRef} onChange={(event) => void event.currentTarget.value} />
        <EmblorClear as={CustomButton} ref={buttonRef} onKeyDown={(event) => void event.key} />
      </EmblorRoot>
      <EmblorRoot as="section" defaultValue={['one']}>
        <EmblorLabel as="div">Textarea</EmblorLabel>
        <EmblorTagList />
        <EmblorInput ref={textareaRef} as="textarea" rows={2} />
        <EmblorClear as="span" />
      </EmblorRoot>
    </>
  );
}

// @ts-expect-error v2 has no separate controlled draft API on EmblorInput.
const removedInputProp = <EmblorInput value="draft" onValueChange={() => {}} />;
void removedInputProp;

// @ts-expect-error EmblorTagRemove inherits index from its containing EmblorTag.
const removedIndexProp = <EmblorTagRemove index={0} />;
void removedIndexProp;
