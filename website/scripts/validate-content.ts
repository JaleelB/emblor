import { existsSync, readdirSync, readFileSync } from 'node:fs';
import { resolve } from 'node:path';

const docsRoot = resolve(process.cwd(), 'content', 'docs');
const requiredRoutes = [
  '/docs',
  '/docs/introduction',
  '/docs/installation',
  '/docs/anatomy',
  '/docs/guides',
  '/docs/guides/styling',
  '/docs/guides/state-management',
  '/docs/guides/validation',
  '/docs/guides/constraints-and-interactions',
  '/docs/guides/forms',
  '/docs/guides/accessibility',
  '/docs/guides/keyboard-and-focus',
  '/docs/guides/composition-and-polymorphism',
  '/docs/guides/integrations',
  '/docs/guides/migration',
  '/docs/reference',
  '/docs/reference/api',
  '/docs/reference/troubleshooting',
  '/docs/reference/examples',
];

const failures: string[] = [];

function pagePath(route: string) {
  const relative = route.replace('/docs', '').replace(/^\//, '');
  if (!relative) return resolve(docsRoot, 'index.mdx');

  const segments = relative.split('/');
  const last = segments.at(-1);
  if (last === 'guides' || last === 'reference') return resolve(docsRoot, ...segments, 'index.mdx');

  return resolve(docsRoot, ...segments.slice(0, -1), `${last}.mdx`);
}

function collectFiles(directory: string): string[] {
  return readdirSync(directory, { withFileTypes: true }).flatMap((entry) => {
    const path = resolve(directory, entry.name);
    return entry.isDirectory() ? collectFiles(path) : [path];
  });
}

for (const route of requiredRoutes) {
  if (!existsSync(pagePath(route))) failures.push(`Missing MDX page for ${route}`);
}

const docsFiles = collectFiles(docsRoot).filter((file) => file.endsWith('.mdx'));
const routeSet = new Set(requiredRoutes);
const localLinkPatterns = [/href=["']?(\/[^\s"')>]+)/g, /\]\((\/[^\s"')>]+)/g];

for (const file of docsFiles) {
  const content = readFileSync(file, 'utf8');
  const relative = file.slice(docsRoot.length).replaceAll('\\', '/');
  if (
    !relative.endsWith('/migration.mdx') &&
    /\b(TagInput|styleClasses|activeTagIndex|validateTag|next-contentlayer|contentlayer)\b/.test(content)
  ) {
    failures.push(`Stale v1/contentlayer symbol in active page ${relative}`);
  }

  for (const localLinkPattern of localLinkPatterns) {
    for (const match of content.matchAll(localLinkPattern)) {
      const link = match[1].split('#')[0].split('?')[0];
      if (link.startsWith('/r/') || link.startsWith('/playground/')) continue;
      if (link && !routeSet.has(link) && link !== '/playground')
        failures.push(`Unknown internal link ${link} in ${relative}`);
    }
  }
}

const activeSourceFiles = collectFiles(resolve(process.cwd(), 'components')).concat(
  collectFiles(resolve(process.cwd(), 'app')).filter((file) => !file.includes(`${resolve('app', 'docs')}`)),
);
for (const file of activeSourceFiles.filter((candidate) => /\.(ts|tsx|mdx)$/.test(candidate))) {
  const content = readFileSync(file, 'utf8');
  if (/\bTagInput\b|next-contentlayer|contentlayer/.test(content)) failures.push(`Stale active symbol in ${file}`);
}

if (failures.length) {
  console.error(failures.map((failure) => `✗ ${failure}`).join('\n'));
  process.exit(1);
}

console.log(`✓ content/routes validated (${requiredRoutes.length} routes, ${docsFiles.length} MDX pages)`);
