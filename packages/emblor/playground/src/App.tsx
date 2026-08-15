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
  type EmblorRejection,
  type EmblorValueChangeDetails,
} from 'emblor';

type Scenario = 'canonical' | 'uncontrolled' | 'validation' | 'keyboard' | 'forms' | 'polymorphism';

const SCENARIOS: Array<{ id: Scenario; label: string; description: string }> = [
  {
    id: 'canonical',
    label: 'Canonical controlled',
    description: 'The approved compound API with consumer-owned occurrence keys.',
  },
  {
    id: 'uncontrolled',
    label: 'Uncontrolled + reset',
    description: 'Root owns tags and draft while a native form owns reset.',
  },
  {
    id: 'validation',
    label: 'Validation + paste',
    description: 'Transform, structured rejections, partial paste, and capacity.',
  },
  {
    id: 'keyboard',
    label: 'Keyboard + focus',
    description: 'LTR/RTL navigation, removal restoration, and visible focus state.',
  },
  {
    id: 'forms',
    label: 'Forms + accessibility',
    description: 'Repeated FormData, required state, labels, and announcements.',
  },
  {
    id: 'polymorphism',
    label: 'Polymorphism + styling',
    description: 'Alternate elements, forwarded props, and custom event handlers.',
  },
];

function TagContent() {
  return (
    <>
      <EmblorTagText />
      <EmblorTagRemove className="lab-remove" />
    </>
  );
}

function TagField(
  props: React.ComponentProps<typeof EmblorRoot> & {
    label: string;
    inputPlaceholder?: string;
    onInput?: React.FormEventHandler<HTMLInputElement>;
  },
) {
  const { label, inputPlaceholder = 'Add a tag', onInput, children, ...rootProps } = props;
  return (
    <EmblorRoot {...rootProps} className="lab-root">
      <EmblorLabel className="lab-label">{label}</EmblorLabel>
      <EmblorTagList className="lab-list">
        {(tag, index) => (
          <EmblorTag key={tag} index={index} className="lab-tag">
            <TagContent />
          </EmblorTag>
        )}
      </EmblorTagList>
      <EmblorInput className="lab-input" placeholder={inputPlaceholder} onInput={onInput} />
      <div className="lab-actions">
        <EmblorClear className="lab-button lab-button--quiet">Clear all</EmblorClear>
        {children}
      </div>
    </EmblorRoot>
  );
}

function Inspector({
  tags,
  draft,
  lastChange,
  rejection,
  submitted,
}: {
  tags: string[];
  draft?: string;
  lastChange?: EmblorValueChangeDetails;
  rejection?: EmblorRejection;
  submitted?: string;
}) {
  const focused = useFocusedElementDescription();
  return (
    <aside className="inspector" aria-label="Scenario inspector">
      <div>
        <span>tags</span>
        <code>{JSON.stringify(tags)}</code>
      </div>
      <div>
        <span>draft</span>
        <code>{JSON.stringify(draft ?? '')}</code>
      </div>
      <div>
        <span>last change</span>
        <code>{lastChange ? JSON.stringify(lastChange) : '—'}</code>
      </div>
      <div>
        <span>rejection</span>
        <code>{rejection ? JSON.stringify(rejection) : '—'}</code>
      </div>
      <div>
        <span>focused</span>
        <code>{focused}</code>
      </div>
      {submitted ? (
        <div>
          <span>FormData</span>
          <code>{submitted}</code>
        </div>
      ) : null}
    </aside>
  );
}

function useFocusedElementDescription() {
  const [description, setDescription] = React.useState('—');

  React.useEffect(function observeFocus() {
    const describe = function describe() {
      const active = document.activeElement as HTMLElement | null;
      const tag = active?.closest<HTMLElement>('[data-index]');
      if (tag) {
        setDescription(active === tag ? `tag ${tag.dataset.index}` : `tag ${tag.dataset.index} action`);
        return;
      }
      setDescription(active?.tagName.toLowerCase() ?? '—');
    };
    const settle = function settle() {
      queueMicrotask(describe);
    };
    describe();
    document.addEventListener('focusin', describe);
    document.addEventListener('focusout', settle);
    return function stopObservingFocus() {
      document.removeEventListener('focusin', describe);
      document.removeEventListener('focusout', settle);
    };
  }, []);

  return description;
}

function CanonicalScenario() {
  const [tags, setTags] = React.useState(['react', 'typescript']);
  const [lastChange, setLastChange] = React.useState<EmblorValueChangeDetails>();
  return (
    <div className="scenario-grid">
      <TagField
        label="Technologies"
        value={tags}
        onValueChange={(next, details) => {
          setTags(next);
          setLastChange(details);
        }}
        delimiters={[',']}
      />
      <Inspector tags={tags} lastChange={lastChange} />
    </div>
  );
}

function UncontrolledScenario() {
  const formRef = React.useRef<HTMLFormElement>(null);
  const [tags, setTags] = React.useState(['default']);
  const [draft, setDraft] = React.useState('');
  const [lastChange, setLastChange] = React.useState<EmblorValueChangeDetails>();
  return (
    <div className="scenario-grid">
      <form
        ref={formRef}
        className="lab-form"
        onReset={() => {
          setTags(['default']);
          setDraft('');
        }}
      >
        <TagField
          label="Uncontrolled values"
          defaultValue={['default']}
          defaultInputValue=""
          name="topics"
          onValueChange={(next, details) => {
            setTags(next);
            setLastChange(details);
          }}
          onInput={(event) => setDraft(event.currentTarget.value)}
          inputPlaceholder="Type, then reset"
        />
        <button className="lab-button" type="reset">
          Native reset
        </button>
      </form>
      <Inspector tags={tags} draft={draft} lastChange={lastChange} />
    </div>
  );
}

function ValidationScenario() {
  const [tags, setTags] = React.useState(['React']);
  const [lastRejection, setLastRejection] = React.useState<EmblorRejection>();
  const [lastChange, setLastChange] = React.useState<EmblorValueChangeDetails>();
  return (
    <div className="scenario-grid">
      <TagField
        label="Paste a comma-separated list"
        value={tags}
        onValueChange={(next, details) => {
          setTags(next);
          setLastChange(details);
        }}
        transform={(value) => value.toLowerCase()}
        validate={(value) => value !== 'blocked'}
        maxTags={4}
        maxLength={12}
        onReject={setLastRejection}
        placeholderWhenFull="Capacity reached — remove one first"
      />
      <Inspector tags={tags} lastChange={lastChange} rejection={lastRejection} />
    </div>
  );
}

function KeyboardScenario() {
  const [rtl, setRtl] = React.useState(false);
  const [tags, setTags] = React.useState(['one', 'two', 'three']);
  return (
    <div className="scenario-grid">
      <TagField
        dir={rtl ? 'rtl' : 'ltr'}
        label={`${rtl ? 'RTL' : 'LTR'} navigation`}
        value={tags}
        onValueChange={setTags}
      />
      <div className="lab-note">
        <button className="lab-button" type="button" onClick={() => setRtl((value) => !value)}>
          Toggle direction
        </button>
        <p>Use the input boundary arrows, then Home/End and Backspace on a focused tag.</p>
      </div>
    </div>
  );
}

function FormsScenario() {
  const [submitted, setSubmitted] = React.useState('');
  const [tags, setTags] = React.useState<string[]>([]);
  return (
    <div className="scenario-grid">
      <form
        className="lab-form"
        onSubmit={(event) => {
          event.preventDefault();
          const data = new FormData(event.currentTarget);
          setSubmitted(data.getAll('skills').join(' × '));
        }}
      >
        <TagField label="Required skills" name="skills" required value={tags} onValueChange={setTags} />
        <button className="lab-button" type="submit">
          Inspect FormData
        </button>
      </form>
      <Inspector tags={tags} submitted={submitted} />
    </div>
  );
}

function PolymorphismScenario() {
  const [tags, setTags] = React.useState(['custom']);
  return (
    <div className="scenario-grid">
      <EmblorRoot
        as="section"
        value={tags}
        onValueChange={setTags}
        className="lab-root lab-root--polymorphic"
        data-scenario="polymorphism"
      >
        <EmblorLabel as="div" className="lab-label">
          Polymorphic section
        </EmblorLabel>
        <EmblorTagList as="ul" className="lab-list">
          {(tag, index) => (
            <EmblorTag as="li" key={tag} index={index} className="lab-tag">
              <TagContent />
            </EmblorTag>
          )}
        </EmblorTagList>
        <EmblorInput as="textarea" rows={2} className="lab-input" placeholder="A textarea editor" />
        <EmblorClear as="span" className="lab-button lab-button--quiet">
          Clear
        </EmblorClear>
      </EmblorRoot>
      <Inspector tags={tags} />
    </div>
  );
}

export function App() {
  const [scenario, setScenario] = React.useState<Scenario>('canonical');
  const active = SCENARIOS.find((item) => item.id === scenario) ?? SCENARIOS[0];
  const content =
    scenario === 'canonical' ? (
      <CanonicalScenario />
    ) : scenario === 'uncontrolled' ? (
      <UncontrolledScenario />
    ) : scenario === 'validation' ? (
      <ValidationScenario />
    ) : scenario === 'keyboard' ? (
      <KeyboardScenario />
    ) : scenario === 'forms' ? (
      <FormsScenario />
    ) : (
      <PolymorphismScenario />
    );

  return (
    <div className="lab-shell">
      <aside className="lab-sidebar">
        <div className="lab-brand">
          <span>Emblor v2</span>
          <small>vertical slice</small>
        </div>
        <nav aria-label="Acceptance scenarios">
          {SCENARIOS.map((item) => (
            <button
              key={item.id}
              type="button"
              className={item.id === scenario ? 'lab-nav-item is-active' : 'lab-nav-item'}
              onClick={() => setScenario(item.id)}
            >
              {item.label}
            </button>
          ))}
        </nav>
        <p className="lab-sidebar__note">Temporary package-development lab. Styles live here, not in the library.</p>
      </aside>
      <main className="lab-main">
        <header className="lab-header">
          <span className="lab-eyebrow">Public root import / acceptance lab</span>
          <h1>{active.label}</h1>
          <p>{active.description}</p>
        </header>
        <section className="lab-card" aria-label={`${active.label} scenario`}>
          {content}
        </section>
      </main>
    </div>
  );
}
