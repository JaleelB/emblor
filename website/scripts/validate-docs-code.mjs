import { mkdtempSync, readFileSync, readdirSync, rmSync, writeFileSync } from 'node:fs';
import { resolve } from 'node:path';
import ts from 'typescript';
import { extractTypeScriptSnippets } from './docs-code-snippets.mjs';

const projectRoot = process.cwd();
const docsRoot = resolve(projectRoot, 'content', 'docs');
const temporaryRoot = mkdtempSync(resolve(projectRoot, '.docs-code-check-'));
const snippets = [];
let historicalSnippets = 0;

function collectFiles(directory) {
  return readdirSync(directory, { withFileTypes: true }).flatMap((entry) => {
    const path = resolve(directory, entry.name);
    return entry.isDirectory() ? collectFiles(path) : [path];
  });
}

try {
  let snippetIndex = 0;
  for (const file of collectFiles(docsRoot).filter((candidate) => candidate.endsWith('.mdx'))) {
    const content = readFileSync(file, 'utf8');
    for (const snippet of extractTypeScriptSnippets(content)) {
      if (snippet.metadata.split(/\s+/).includes('legacy-v1')) {
        if (
          file !== resolve(docsRoot, 'guides', 'migration.mdx') ||
          !/import \{ TagInput, type Tag \} from 'emblor'/.test(snippet.code)
        ) {
          throw new Error(`Historical v1 exclusion is only valid for the labeled migration-before example: ${file}`);
        }
        historicalSnippets += 1;
        continue;
      }
      snippetIndex += 1;
      const { extension, line } = snippet;
      const path = resolve(temporaryRoot, `snippet-${snippetIndex}.${extension}`);
      writeFileSync(path, `${snippet.code}\nexport {};\n`);
      snippets.push({ file, line, path });
    }
  }

  const globalsPath = resolve(temporaryRoot, 'globals.d.ts');
  writeFileSync(
    globalsPath,
    [
      'declare const error: string | undefined;',
      'declare const isPreview: boolean;',
      'declare const isSaving: boolean;',
    ].join('\n'),
  );

  const websiteConfig = ts.readConfigFile(resolve(projectRoot, 'tsconfig.json'), ts.sys.readFile);
  if (websiteConfig.error) throw new Error(ts.flattenDiagnosticMessageText(websiteConfig.error.messageText, '\n'));
  const compilerOptions = {
    allowSyntheticDefaultImports: true,
    baseUrl: projectRoot,
    esModuleInterop: true,
    jsx: ts.JsxEmit.ReactJSX,
    module: ts.ModuleKind.ESNext,
    moduleResolution: ts.ModuleResolutionKind.Bundler,
    noEmit: true,
    paths: websiteConfig.config.compilerOptions.paths,
    skipLibCheck: true,
    strict: true,
    target: ts.ScriptTarget.ES2022,
  };

  const diagnostics = snippets.flatMap((snippet) => {
    const program = ts.createProgram([globalsPath, snippet.path], compilerOptions);
    return ts
      .getPreEmitDiagnostics(program)
      .filter((diagnostic) => !diagnostic.file || diagnostic.file.fileName === snippet.path)
      .map((diagnostic) => ({ diagnostic, snippet }));
  });
  if (diagnostics.length) {
    const failures = diagnostics.map(({ diagnostic, snippet }) => {
      const position =
        diagnostic.file && diagnostic.start !== undefined
          ? diagnostic.file.getLineAndCharacterOfPosition(diagnostic.start)
          : undefined;
      const sourceLine = snippet && position ? snippet.line + position.line + 1 : snippet?.line;
      const location = `${snippet.file}:${sourceLine}`;
      return `${location} — TS${diagnostic.code}: ${ts.flattenDiagnosticMessageText(diagnostic.messageText, '\n')}`;
    });
    console.error(failures.map((failure) => `✗ ${failure}`).join('\n'));
    process.exitCode = 1;
  } else {
    console.log(
      `✓ documentation code typechecked (${snippets.length} active v2 TypeScript examples; ${historicalSnippets} explicitly historical v1 example excluded)`,
    );
  }
} finally {
  rmSync(temporaryRoot, { recursive: true, force: true });
}
