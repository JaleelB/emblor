'use client';
import { PreviewTabs } from '@/components/preview-tabs';
import { TagField } from '@/components/tag-field';
const specimenCode = `'use client';

import {
  EmblorRoot, EmblorLabel, EmblorTagList, EmblorTag,
  EmblorTagText, EmblorTagRemove, EmblorInput,
} from 'emblor';
import { X } from 'lucide-react';

export function SkillsField() {
  return (
    <EmblorRoot defaultValue={['react', 'headless']} className="grid gap-2">
      <EmblorLabel className="text-sm font-medium">Skills</EmblorLabel>
      <div className="flex flex-wrap items-center gap-2 rounded-lg border p-3">
        <EmblorTagList className="flex flex-wrap gap-2">
          {(tag, index) => (
            <EmblorTag key={tag} index={index}
              className="inline-flex items-center gap-1 rounded-md bg-secondary px-2 py-1 text-sm">
              <EmblorTagText />
              <EmblorTagRemove aria-label={'Remove ' + tag}>
                <X className="size-3" />
              </EmblorTagRemove>
            </EmblorTag>
          )}
        </EmblorTagList>
        <EmblorInput placeholder="Add a skill"
          className="min-w-28 flex-1 bg-transparent outline-none" />
      </div>
    </EmblorRoot>
  );
}`;
export function MarketingSpecimen() {
  return (
    <PreviewTabs
      className="marketing-specimen"
      label="Skills field"
      filename="skills-field.tsx"
      rawCode={specimenCode}
      preview={
        <div className="example-field">
          <TagField initialTags={['react', 'headless']} label="Skills" placeholder="Add a concept" showOutput={false} />
        </div>
      }
    />
  );
}
