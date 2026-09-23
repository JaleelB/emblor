'use client';
import { useState } from 'react';
import { TagField } from '@/components/tag-field';
import { ToggleGroup, ToggleGroupItem } from '@/components/ui/toggle-group';
export function HeroTagInput() {
  const [style, setStyle] = useState('soft');
  return (
    <div className="hero-demo" data-tag-style={style}>
      <div className="hero-demo-field">
        <TagField
          initialTags={['React', 'TypeScript', 'Design systems']}
          label="Your next project"
          placeholder="Add a skill"
          description="Type a tag and press Enter. Paste a comma-separated list to add several."
          showOutput={false}
        />
      </div>
      <div className="hero-style-picker">
        <span>Same behavior. Your style.</span>
        <ToggleGroup
          type="single"
          value={style}
          onValueChange={(value) => {
            if (value) setStyle(value);
          }}
          variant="outline"
          size="sm"
          aria-label="Tag appearance"
        >
          <ToggleGroupItem value="soft">Soft</ToggleGroupItem>
          <ToggleGroupItem value="outline">Outline</ToggleGroupItem>
          <ToggleGroupItem value="color">Color</ToggleGroupItem>
        </ToggleGroup>
      </div>
    </div>
  );
}
