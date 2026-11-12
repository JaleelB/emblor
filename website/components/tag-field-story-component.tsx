'use client';

import { TagField } from './tag-field';

export type TagFieldStoryProps = {
  initialTags?: string[];
  label?: string;
  description?: string;
  placeholder?: string;
  invalid?: boolean;
  showOutput?: boolean;
};

export function TagFieldStory(props: TagFieldStoryProps) {
  return <TagField {...props} />;
}
