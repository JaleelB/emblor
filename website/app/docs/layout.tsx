import Link from 'next/link';
import type * as PageTree from 'fumadocs-core/page-tree';
import { DocsLayout } from 'fumadocs-ui/layouts/docs';
import { BrandMark } from '@/components/brand-mark';
import { DocsSubnav } from '@/components/docs-subnav';
import { SiteHeader } from '@/components/site-header';
import { source } from '@/lib/source';

const routingOnlyPages = new Set(['/docs', '/docs/guides', '/docs/reference']);

function cleanNavigation(nodes: PageTree.Node[]): PageTree.Node[] {
  const cleaned: PageTree.Node[] = [];

  for (const node of nodes) {
    if (node.type === 'page') {
      if (!routingOnlyPages.has(node.url)) cleaned.push(node);
    } else if (node.type === 'separator') {
      cleaned.push(node);
    } else {
      cleaned.push({
        ...node,
        index: undefined,
        children: cleanNavigation(node.children),
      });
    }
  }

  return cleaned;
}

export default function DocsRootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  const sourceTree = source.getPageTree();
  const navigationTree: PageTree.Root = {
    ...sourceTree,
    children: cleanNavigation(sourceTree.children),
  };

  return (
    <div className="docs-site">
      <div className="docs-desktop-header">
        <SiteHeader as="div" />
      </div>
      <DocsLayout
        tree={navigationTree}
        nav={{
          title: (
            <span className="site-brand">
              <BrandMark />
              emblor
            </span>
          ),
          url: '/',
          children: (
            <Link key="playground" className="docs-playground-link" href="/playground">
              Playground
            </Link>
          ),
        }}
        themeSwitch={{ enabled: false }}
        searchToggle={{ enabled: true }}
        sidebar={{
          collapsible: false,
        }}
        slots={{ header: DocsSubnav }}
      >
        {children}
      </DocsLayout>
    </div>
  );
}
