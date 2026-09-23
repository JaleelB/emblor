import { defineStory } from '@/lib/story';
import { TagFieldStory } from './tag-field-story-component';

export const story = defineStory({
  Component: TagFieldStory,
  args: {
    initial: {
      initialTags: ['react', 'headless'],
      label: 'Topics',
      description: 'Press Enter to commit. Backspace focuses the previous tag.',
      placeholder: 'Add a topic',
      showOutput: true,
    },
  },
});
