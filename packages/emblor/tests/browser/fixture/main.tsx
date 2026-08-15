import * as React from 'react';
import { createPortal } from 'react-dom';
import { createRoot } from 'react-dom/client';
import {
  EmblorClear,
  EmblorInput,
  EmblorLabel,
  EmblorRoot,
  EmblorTag,
  EmblorTagList,
  EmblorTagRemove,
  EmblorTagText,
} from 'emblor';

function Tags() {
  return (
    <EmblorTagList>
      {(tag, index) => (
        <EmblorTag key={`${tag}-${index}`} index={index} data-testid={`tag-${index}`}>
          <EmblorTagText />
          <EmblorTagRemove data-testid={`remove-${index}`} />
        </EmblorTag>
      )}
    </EmblorTagList>
  );
}

function App() {
  const portalHost = document.getElementById('portal-host');
  const [controlledValues, setControlledValues] = React.useState(['controlled']);
  const [controlledDraft, setControlledDraft] = React.useState('controlled draft');

  return (
    <main>
      <form data-testid="repeated-form">
        <EmblorRoot defaultValue={['one', 'two']} name="skills[]" data-testid="repeated-root">
          <EmblorLabel>Skills</EmblorLabel>
          <Tags />
          <EmblorInput data-testid="repeated-input" />
        </EmblorRoot>
      </form>

      <form data-testid="required-form">
        <EmblorRoot required name="required" data-testid="required-root">
          <EmblorInput data-testid="required-input" aria-label="Required tags" />
          <button type="submit" data-testid="required-submit">
            Submit required
          </button>
        </EmblorRoot>
      </form>

      <form data-testid="reset-form">
        <EmblorRoot defaultValue={['initial']} defaultInputValue="initial draft" name="reset" data-testid="reset-root">
          <Tags />
          <EmblorInput data-testid="reset-input" />
          <button type="reset" data-testid="reset-button">
            Reset
          </button>
        </EmblorRoot>
      </form>

      <form data-testid="participation-form">
        <EmblorRoot disabled defaultValue={['disabled']} name="disabled">
          <EmblorInput aria-label="Disabled tags" />
        </EmblorRoot>
        <EmblorRoot readOnly defaultValue={['readonly']} name="readonly">
          <EmblorInput aria-label="Read-only tags" />
        </EmblorRoot>
      </form>

      <EmblorRoot blurBehavior="commit" defaultInputValue="portal draft" data-testid="portal-root">
        <Tags />
        <EmblorInput data-testid="portal-input" aria-label="Portal field" />
        {portalHost ? createPortal(<EmblorLabel as="button">Portal label</EmblorLabel>, portalHost) : null}
      </EmblorRoot>
      <button type="button" data-testid="portal-outside">
        Outside portal field
      </button>

      <EmblorRoot defaultValue={['duplicate']} defaultInputValue="draft" data-testid="paste-root">
        <Tags />
        <EmblorInput data-testid="paste-input" aria-label="Paste field" />
      </EmblorRoot>

      <EmblorRoot dir="ltr" defaultValue={['first', 'last']} data-testid="ltr-direction-root">
        <Tags />
        <EmblorInput data-testid="ltr-direction-input" aria-label="LTR direction field" />
      </EmblorRoot>

      <EmblorRoot dir="rtl" defaultValue={['first', 'last']} data-testid="rtl-direction-root">
        <Tags />
        <EmblorInput data-testid="rtl-direction-input" aria-label="RTL direction field" />
      </EmblorRoot>

      <EmblorRoot defaultValue={['first', 'middle', 'last']} data-testid="focus-root">
        <Tags />
        <EmblorInput data-testid="focus-input" aria-label="Focus field" />
      </EmblorRoot>

      <EmblorRoot defaultValue={['clearable']} data-testid="clear-focus-root">
        <Tags />
        <EmblorInput data-testid="clear-focus-input" aria-label="Clear focus field" />
        <EmblorClear data-testid="clear-focus-action" />
      </EmblorRoot>

      <EmblorRoot
        value={controlledValues}
        inputValue={controlledDraft}
        onValueChange={setControlledValues}
        onInputValueChange={setControlledDraft}
        data-testid="controlled-root"
      >
        <Tags />
        <EmblorInput data-testid="controlled-input" aria-label="Controlled field" />
      </EmblorRoot>

      <EmblorRoot value={['refused first', 'refused last']} onValueChange={() => undefined} data-testid="refused-root">
        <Tags />
        <EmblorInput data-testid="refused-input" aria-label="Refused field" />
      </EmblorRoot>
    </main>
  );
}

createRoot(document.getElementById('root') as HTMLElement).render(<App />);
