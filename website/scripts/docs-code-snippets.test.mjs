import assert from 'node:assert/strict';
import test from 'node:test';
import { extractTypeScriptSnippets } from './docs-code-snippets.mjs';

test('extracts the same complete fenced snippets from LF and CRLF documents', () => {
  const document =
    '# Example\n\n```tsx title="Example"\nconst value = <input />;\n```\n\n```ts\nconst count = 1;\n```\n';
  const expected = [
    { extension: 'tsx', metadata: 'title="Example"', code: 'const value = <input />;\n', line: 3 },
    { extension: 'ts', metadata: '', code: 'const count = 1;\n', line: 7 },
  ];
  assert.deepEqual(extractTypeScriptSnippets(document), expected);
  assert.deepEqual(extractTypeScriptSnippets(document.replaceAll('\n', '\r\n')), expected);
});

test('keeps historical-v1 metadata explicit without consuming the following active example', () => {
  const document =
    '```tsx legacy-v1\nimport { TagInput } from "emblor";\n```\n\n```tsx\nimport { EmblorRoot } from "emblor";\n```\n';
  const snippets = extractTypeScriptSnippets(document);
  assert.equal(snippets.length, 2);
  assert.equal(snippets[0].metadata, 'legacy-v1');
  assert.match(snippets[1].code, /EmblorRoot/);
  assert.doesNotMatch(snippets[1].code, /TagInput/);
});
