import * as React from 'react';
import { createRoot } from 'react-dom/client';
import { EmblorInput, EmblorRoot, EmblorTag, EmblorTagList, EmblorTagRemove, EmblorTagText } from 'emblor';

type ComponentName = 'Root' | 'Input' | 'TagList' | 'Tag';

type RenderSnapshot = {
  Root: number;
  Input: number;
  TagList: number;
  Tag: number;
  tags: Record<string, number>;
};

type RenderOperation = {
  renders: RenderSnapshot;
  selectionListeners: { added: number; removed: number };
};

type BenchmarkResult = {
  renderCounts: {
    draft: RenderOperation;
    add: RenderOperation;
    remove: RenderOperation;
    navigation: RenderOperation;
  };
  latencySamplesMs: {
    draft: number[];
    add: number[];
    remove: number[];
    navigation: number[];
  };
};

declare global {
  interface Window {
    __EMBLOR_RECORD_RENDER__?: (component: ComponentName, index?: number) => void;
    __EMBLOR_RUN_BENCHMARK__: (options: {
      warmups: number;
      samples: number;
      navigationSamples: number;
    }) => Promise<BenchmarkResult>;
    __EMBLOR_READY__?: boolean;
  }
}

const query = new URLSearchParams(window.location.search);
const controlled = query.get('controlled') === 'true';
const size = Number(query.get('size') ?? '10');
const initialValues = Array.from({ length: size }, (_, index) => `tag-${index}`);

let renders: RenderSnapshot = emptyRenders();
let selectionAdded = 0;
let selectionRemoved = 0;

function emptyRenders(): RenderSnapshot {
  return { Root: 0, Input: 0, TagList: 0, Tag: 0, tags: {} };
}

window.__EMBLOR_RECORD_RENDER__ = function recordRender(component, index) {
  renders[component] += 1;
  if (component === 'Tag' && index !== undefined) {
    renders.tags[String(index)] = (renders.tags[String(index)] ?? 0) + 1;
  }
};

const originalAddEventListener = document.addEventListener;
const originalRemoveEventListener = document.removeEventListener;
document.addEventListener = function measuredAddEventListener(
  this: Document,
  type: string,
  listener: EventListenerOrEventListenerObject,
  options?: boolean | AddEventListenerOptions,
) {
  if (type === 'selectionchange') selectionAdded += 1;
  return originalAddEventListener.call(this, type, listener, options);
} as Document['addEventListener'];
document.removeEventListener = function measuredRemoveEventListener(
  this: Document,
  type: string,
  listener: EventListenerOrEventListenerObject,
  options?: boolean | EventListenerOptions,
) {
  if (type === 'selectionchange') selectionRemoved += 1;
  return originalRemoveEventListener.call(this, type, listener, options);
} as Document['removeEventListener'];

function Tags() {
  return (
    <EmblorTagList data-testid="tag-list">
      {(tag, index) => (
        <EmblorTag key={`${tag}-${index}`} index={index} data-testid={`tag-${index}`}>
          <EmblorTagText />
          <EmblorTagRemove aria-label={`Remove ${tag}`} />
        </EmblorTag>
      )}
    </EmblorTagList>
  );
}

const benchmarkChildren = (
  <>
    <Tags />
    <EmblorInput aria-label="Tags" data-testid="input" />
  </>
);

function ControlledFixture() {
  const [values, setValues] = React.useState(initialValues);
  const [draft, setDraft] = React.useState('');
  return (
    <EmblorRoot value={values} inputValue={draft} onValueChange={setValues} onInputValueChange={setDraft}>
      {benchmarkChildren}
    </EmblorRoot>
  );
}

function UncontrolledFixture() {
  return <EmblorRoot defaultValue={initialValues}>{benchmarkChildren}</EmblorRoot>;
}

function resetMetrics() {
  renders = emptyRenders();
  selectionAdded = 0;
  selectionRemoved = 0;
}

function snapshotOperation(): RenderOperation {
  return {
    renders: structuredClone(renders),
    selectionListeners: { added: selectionAdded, removed: selectionRemoved },
  };
}

function inputNode(): HTMLInputElement {
  const node = document.querySelector('[data-testid="input"]');
  if (!(node instanceof HTMLInputElement)) throw new Error('Benchmark input is missing');
  return node;
}

function tagNodes(): HTMLElement[] {
  return Array.from(document.querySelectorAll<HTMLElement>('[data-testid^="tag-"]')).filter(
    (node) => node.dataset.testid !== 'tag-list',
  );
}

function setNativeValue(node: HTMLInputElement, value: string) {
  const setter = Object.getOwnPropertyDescriptor(HTMLInputElement.prototype, 'value')?.set;
  if (!setter) throw new Error('Native input value setter is unavailable');
  setter.call(node, value);
  node.dispatchEvent(new InputEvent('input', { bubbles: true, inputType: 'insertText', data: value.slice(-1) }));
}

function dispatchKey(node: HTMLElement, key: string) {
  node.dispatchEvent(new KeyboardEvent('keydown', { key, bubbles: true, cancelable: true }));
}

function flushRender(): Promise<void> {
  return new Promise((resolve) => requestAnimationFrame(() => resolve()));
}

function waitForTagCount(expected: number): Promise<number> {
  return new Promise((resolve, reject) => {
    const started = performance.now();
    const current = tagNodes().length;
    if (current === expected) {
      resolve(performance.now() - started);
      return;
    }
    const timeout = window.setTimeout(() => {
      observer.disconnect();
      reject(new Error(`Timed out waiting for ${expected} tags; found ${tagNodes().length}`));
    }, 2_000);
    const observer = new MutationObserver(() => {
      if (tagNodes().length === expected) {
        window.clearTimeout(timeout);
        observer.disconnect();
        resolve(performance.now() - started);
      }
    });
    observer.observe(document.querySelector('[data-testid="tag-list"]') as HTMLElement, { childList: true });
  });
}

function waitForFocusedTag(expected: HTMLElement): Promise<void> {
  return new Promise((resolve, reject) => {
    if (expected.hasAttribute('data-focused')) {
      resolve();
      return;
    }
    const timeout = window.setTimeout(() => {
      observer.disconnect();
      reject(new Error('Timed out waiting for the focused tag render'));
    }, 2_000);
    const observer = new MutationObserver(() => {
      if (expected.hasAttribute('data-focused')) {
        window.clearTimeout(timeout);
        observer.disconnect();
        resolve();
      }
    });
    observer.observe(document.querySelector('[data-testid="tag-list"]') as HTMLElement, {
      attributes: true,
      subtree: true,
      attributeFilter: ['data-focused'],
    });
  });
}

async function prepareDraft(value: string) {
  const input = inputNode();
  input.focus();
  setNativeValue(input, value);
  await flushRender();
}

async function measureDraftOnce(value: string): Promise<number> {
  const started = performance.now();
  setNativeValue(inputNode(), value);
  await Promise.resolve();
  return performance.now() - started;
}

async function addOnce(label: string): Promise<number> {
  await prepareDraft(label);
  const input = inputNode();
  const expected = tagNodes().length + 1;
  const pending = waitForTagCount(expected);
  const started = performance.now();
  dispatchKey(input, 'Enter');
  await pending;
  return performance.now() - started;
}

async function removeLastOnce(): Promise<number> {
  const tags = tagNodes();
  const target = tags.at(-1);
  if (!target) throw new Error('No tag available for removal');
  target.focus();
  await flushRender();
  const pending = waitForTagCount(tags.length - 1);
  const started = performance.now();
  dispatchKey(target, 'Delete');
  await pending;
  return performance.now() - started;
}

async function navigateOnce(forward: boolean): Promise<number> {
  const tags = tagNodes();
  if (tags.length < 2) throw new Error('Navigation benchmark needs at least two tags');
  const source = forward ? tags[0] : tags[1];
  const expected = forward ? tags[1] : tags[0];
  if (document.activeElement !== source) {
    source.focus();
    await flushRender();
  }
  const pending = waitForFocusedTag(expected);
  const started = performance.now();
  dispatchKey(source, forward ? 'ArrowRight' : 'ArrowLeft');
  await pending;
  if (document.activeElement !== expected) throw new Error('Keyboard navigation did not move to the expected tag');
  return performance.now() - started;
}

async function captureRenderCounts() {
  await prepareDraft('render-draft');
  resetMetrics();
  setNativeValue(inputNode(), 'render-draft-x');
  await flushRender();
  const draft = snapshotOperation();

  await prepareDraft('render-add');
  resetMetrics();
  const addPending = waitForTagCount(tagNodes().length + 1);
  dispatchKey(inputNode(), 'Enter');
  await addPending;
  await flushRender();
  const add = snapshotOperation();

  const removeTarget = tagNodes().at(-1) as HTMLElement;
  removeTarget.focus();
  await flushRender();
  resetMetrics();
  const removePending = waitForTagCount(tagNodes().length - 1);
  dispatchKey(removeTarget, 'Delete');
  await removePending;
  await flushRender();
  const remove = snapshotOperation();

  const first = tagNodes()[0];
  first.focus();
  await flushRender();
  resetMetrics();
  dispatchKey(first, 'ArrowRight');
  await flushRender();
  const navigation = snapshotOperation();

  return { draft, add, remove, navigation };
}

window.__EMBLOR_RUN_BENCHMARK__ = async function runBenchmark(options) {
  const renderCounts = await captureRenderCounts();
  const draft: number[] = [];
  const add: number[] = [];
  const remove: number[] = [];
  const navigation: number[] = [];

  if (options.warmups + options.samples > 0) {
    for (let index = 0; index < options.warmups + options.samples; index += 1) {
      const latency = await measureDraftOnce(`draft-sample-${index}`);
      if (index >= options.warmups) draft.push(latency);
    }
    await measureDraftOnce('');
  }

  for (let index = 0; index < options.warmups + options.samples; index += 1) {
    const addLatency = await addOnce(`sample-${index}`);
    const removeLatency = await removeLastOnce();
    if (index >= options.warmups) {
      add.push(addLatency);
      remove.push(removeLatency);
    }
  }

  for (let index = 0; index < options.warmups + options.navigationSamples; index += 1) {
    const latency = await navigateOnce(index % 2 === 0);
    if (index >= options.warmups) navigation.push(latency);
  }

  return { renderCounts, latencySamplesMs: { draft, add, remove, navigation } };
};

createRoot(document.getElementById('root') as HTMLElement).render(
  controlled ? <ControlledFixture /> : <UncontrolledFixture />,
);
void flushRender().then(() => {
  window.__EMBLOR_READY__ = true;
});
