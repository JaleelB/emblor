import * as React from 'react';
import {
  CoreOnlyExample,
  CoreWithAddonsExample,
  CmdkCompositionExample,
  RadixPopoverCompositionExample,
  SortableExample,
} from './examples';

export function App(): JSX.Element {
  return (
    <main data-app-root>
      <header>
        <h1>Emblor playground</h1>
        <p>Headless tag composition primitives in action.</p>
      </header>
      <CoreOnlyExample />
      <CoreWithAddonsExample />
      <CmdkCompositionExample />
      <RadixPopoverCompositionExample />
      <SortableExample />
    </main>
  );
}
