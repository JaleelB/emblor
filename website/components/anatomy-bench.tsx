'use client';

import { useState } from 'react';
import { TagField, type FieldEvent } from '@/components/tag-field';
import { Button } from '@/components/ui/button';

const PARTS = [
  ['Root', 'Owns the values, draft, and shared context.'],
  ['Label', 'Gives the input its accessible name.'],
  ['TagList', 'Renders the committed values.'],
  ['Tag', 'Makes each tag focusable.'],
  ['TagText', 'Displays the tag’s value.'],
  ['Input', 'Accepts the draft text.'],
  ['TagRemove', 'Removes one tag.'],
  ['Clear', 'Removes all tags.'],
] as const;

export function AnatomyBench() {
  const [activePart, setActivePart] = useState('Input');
  const [values, setValues] = useState(['react', 'headless']);
  const [draft, setDraft] = useState('');
  function handleEvent(event: FieldEvent) {
    if (event.kind === 'value') setValues(event.value);
    if (event.kind === 'draft') setDraft(event.value);
    if (event.kind === 'focus') setActivePart(event.part);
  }
  return (
    <div className="anatomy-demo not-prose">
      <div className="anatomy-field">
        <p className="section-eyebrow">Explore the parts</p>
        <TagField initialTags={['react', 'headless']} showOutput={false} onEvent={handleEvent} />
        <dl className="anatomy-state">
          <div>
            <dt>Values</dt>
            <dd>{JSON.stringify(values)}</dd>
          </div>
          <div>
            <dt>Draft</dt>
            <dd>{draft || '—'}</dd>
          </div>
        </dl>
      </div>
      <div className="anatomy-parts" aria-label="Public parts">
        {PARTS.map(([part, description]) => (
          <Button
            key={part}
            variant="ghost"
            className="anatomy-part"
            aria-pressed={activePart === part}
            onClick={() => setActivePart(part)}
          >
            <code>{part}</code>
            <span>{description}</span>
          </Button>
        ))}
      </div>
    </div>
  );
}
