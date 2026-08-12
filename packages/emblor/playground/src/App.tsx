import * as React from 'react';
import type { ReactNode } from 'react';
import {
  CoreOnlyExample,
  CoreWithAddonsExample,
  CmdkCompositionExample,
  RadixPopoverCompositionExample,
} from './examples';

type StoryDefinition = {
  id: string;
  title: string;
  description: string;
  element: ReactNode;
  notes: Array<string>;
};

const STORIES: Array<StoryDefinition> = [
  {
    id: 'core-only',
    title: 'Core primitives',
    description:
      'Start with the headless `emblor/core` building blocks to power a fully controllable tag input with minimal markup.',
    element: <CoreOnlyExample />,
    notes: [
      'Uses `EmblorRoot`, `EmblorInput`, `EmblorTagList`, `EmblorTag`, `EmblorTagRemove`, and `EmblorClearTrigger`.',
      'Demonstrates controlled state with custom delimiters (comma, Enter, Tab) and a max tag guard.',
      'Shows how to wire accessibility labels for screen readers using the `labelId` prop.',
    ],
  },
  {
    id: 'core-with-addons',
    title: 'Core + Addons',
    description:
      'Layer the `emblor/addons` helpers for richer experiences: live counts and clear-all affordances.',
    element: <CoreWithAddonsExample />,
    notes: [
      'Adds `TagCount` and `ClearButton` from `emblor/addons` to surface metrics and bulk actions.',
      'Illustrates using the store to announce tag additions and to present remaining tag capacity.',
      'Great starting point for productivity tooling where teams manage shared vocabularies.',
    ],
  },
  {
    id: 'cmdk-composition',
    title: 'cmdk composition',
    description:
      'Wire up the tags input with the real `cmdk` command palette primitives for suggestion-driven filtering.',
    element: <CmdkCompositionExample />,
    notes: [
      'Reuses the headless input while rendering `Command.Input` via the `as` prop.',
      'Command items append unique tags to the list without leaving the palette.',
      'Demonstrates mixing Emblor state with third-party composition utilities.',
    ],
  },
  {
    id: 'popover-composition',
    title: 'Radix Popover composition',
    description:
      'Embed the tag input inside `@radix-ui/react-popover` to create lightweight filter menus.',
    element: <RadixPopoverCompositionExample />,
    notes: [
      'Shows how to manage popover state externally while keeping Emblor fully controlled.',
      'Close buttons use `Popover.Close`, so focus returns to the trigger automatically.',
      'Pairs well with tables, dashboards, or any contextual filtering UI.',
    ],
  },
  {
    id: 'keyboard-navigation',
    title: 'Keyboard navigation',
    description:
      'Navigate tags entirely from the keyboard: Backspace deletes, arrows move focus between tags, and Left/Right from the input jumps into the list.',
    element: <CoreOnlyExample />,
    notes: [
      'From the input: Left arrow focuses the last tag; Right arrow focuses the first tag.',
      'Within the list: Left/Right move between tags, Home/End jump to the ends.',
      'Visual focus rings indicate the currently focused/active tag.',
    ],
  },
];

function classNames(...values: Array<string | false | null | undefined>): string {
  return values.filter(Boolean).join(' ');
}

export function App(): JSX.Element {
  const [activeStoryId, setActiveStoryId] = React.useState<string>(() => STORIES[0]?.id ?? '');
  const activeStory = React.useMemo(() => STORIES.find((story) => story.id === activeStoryId) ?? STORIES[0], [
    activeStoryId,
  ]);

  if (!activeStory) {
    return (
      <div className="story-app" data-app-root>
        <main className="story-main">
          <header className="story-main__header">
            <span className="story-main__eyebrow">Stories</span>
            <h1>No stories available</h1>
            <p>Add story definitions to the `STORIES` array to populate the playground canvas.</p>
          </header>
        </main>
      </div>
    );
  }

  return (
    <div className="story-app" data-app-root>
      <aside className="story-sidebar">
        <div className="story-sidebar__header">
          <span className="story-sidebar__title">Tag input stories</span>
          <span className="story-sidebar__subtitle">Shadcn-inspired compositions</span>
        </div>
        <nav className="story-sidebar__nav" aria-label="Tag input stories">
          {STORIES.map((story) => (
            <button
              key={story.id}
              type="button"
              className={classNames('story-sidebar__item', story.id === activeStory.id && 'is-active')}
              onClick={() => setActiveStoryId(story.id)}
            >
              {story.title}
            </button>
          ))}
        </nav>
      </aside>
      <main className="story-main">
        <header className="story-main__header">
          <span className="story-main__eyebrow">Stories / Tag input</span>
          <h1>{activeStory.title}</h1>
          <p>{activeStory.description}</p>
        </header>
        <section className="story-main__canvas" aria-label="Story canvas">
          <div className="story-card">
            <div className="story-card__header">
              <span className="story-card__title">{activeStory.title}</span>
              <span className="story-card__status">Canvas</span>
            </div>
            <div className="story-card__body">
              <div className="story-preview">{activeStory.element}</div>
            </div>
          </div>
        </section>
        {activeStory.notes.length > 0 ? (
          <section className="story-main__notes" aria-label="Implementation notes">
            <h2>Implementation notes</h2>
            <ul>
              {activeStory.notes.map((note) => (
                <li key={note}>{note}</li>
              ))}
            </ul>
          </section>
        ) : null}
      </main>
    </div>
  );
}
