export function extractTypeScriptSnippets(content) {
  const normalized = content.replace(/\r\n/g, '\n');
  const fence = /^```(tsx|ts)(?:[\t ]+([^\n]*))?\n([\s\S]*?)^```[\t ]*$/gm;
  return Array.from(normalized.matchAll(fence), (match) => ({
    extension: match[1],
    metadata: match[2] ?? '',
    code: match[3],
    line: normalized.slice(0, match.index).split('\n').length,
  }));
}
