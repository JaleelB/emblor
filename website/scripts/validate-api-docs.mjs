import { readFileSync } from 'node:fs';
import { resolve } from 'node:path';
import ts from 'typescript';

const repositoryRoot = resolve(process.cwd(), '..');
const sourcePath = resolve(repositoryRoot, 'packages', 'emblor', 'src', 'types', 'index.ts');
const indexPath = resolve(repositoryRoot, 'packages', 'emblor', 'src', 'index.ts');
const docsPath = resolve(process.cwd(), 'content', 'docs', 'reference', 'api.mdx');
const source = readFileSync(sourcePath, 'utf8');
const index = readFileSync(indexPath, 'utf8');
const docs = readFileSync(docsPath, 'utf8');
const failures = [];

function membersOfType(typeName) {
  const file = ts.createSourceFile(sourcePath, source, ts.ScriptTarget.Latest, true, ts.ScriptKind.TS);
  for (const statement of file.statements) {
    if (ts.isTypeAliasDeclaration(statement) && statement.name.text === typeName && ts.isTypeLiteralNode(statement.type)) {
      return statement.type.members.flatMap((member) =>
        ts.isPropertySignature(member) && member.name && ts.isIdentifier(member.name) ? [member.name.text] : [],
      );
    }
  }
  return [];
}

function namedExports(typeOnly) {
  const file = ts.createSourceFile(indexPath, index, ts.ScriptTarget.Latest, true, ts.ScriptKind.TS);
  return file.statements.flatMap((statement) => {
    if (!ts.isExportDeclaration(statement) || !statement.exportClause || !ts.isNamedExports(statement.exportClause)) {
      return [];
    }
    if (Boolean(statement.isTypeOnly) !== typeOnly) return [];
    return statement.exportClause.elements.map((element) => element.name.text);
  });
}

function compareSets(actual, expected, label) {
  const missing = expected.filter((value) => !actual.includes(value));
  const extra = actual.filter((value) => !expected.includes(value));
  if (missing.length) failures.push(`${label} is missing: ${missing.join(', ')}`);
  if (extra.length) failures.push(`${label} contains non-public entries: ${extra.join(', ')}`);
}

const componentSection = docs.slice(docs.indexOf('## Exports'), docs.indexOf('## Root props'));
const documentedComponents = [...componentSection.matchAll(/^\| `([^`]+)`/gm)].map((match) => match[1]);
compareSets(documentedComponents, namedExports(false), 'Component export table');

const rootSection = docs.slice(docs.indexOf('## Root props'), docs.indexOf('## Mutation details'));
const documentedRootProps = [...rootSection.matchAll(/^\| ([^|]+)\|/gm)].flatMap((match) =>
  [...match[1].matchAll(/`([^`]+)`/g)].map((name) => name[1]),
);
const publicRootProps = membersOfType('EmblorRootOwnProps').filter((name) => name !== 'children').concat('as');
compareSets(documentedRootProps, publicRootProps, 'Root prop table');

const publicTypesSection = docs.slice(docs.indexOf('## Public types'), docs.indexOf('## Announcements'));
const typeImport = publicTypesSection.match(/import type \{([\s\S]*?)\} from 'emblor';/);
const documentedTypes = typeImport ? typeImport[1].split(',').map((name) => name.trim()).filter(Boolean) : [];
compareSets(documentedTypes, namedExports(true), 'Public type example');

if (failures.length) {
  console.error(failures.map((failure) => `✗ ${failure}`).join('\n'));
  process.exit(1);
}

console.log(
  `✓ API documentation matches source (${documentedComponents.length} components, ${documentedRootProps.length} Root props, ${documentedTypes.length} public types)`,
);
