'use client';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { BrandMark } from '@/components/brand-mark';
import { DocsSearchDialog } from '@/components/docs-search-dialog';
import { GitHubIcon, NpmIcon, XIcon } from '@/components/social-icons';
import { ThemeToggle } from '@/components/theme-toggle';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { siteConfig } from '@/config/site-config';
export function SiteHeader({ as = 'header' }: { as?: 'header' | 'div' }) {
  const pathname = usePathname();
  const Header = as;
  return (
    <Header className="site-header" {...(as === 'div' ? { role: 'region', 'aria-label': 'Site header' } : {})}>
      <div className="site-header-inner">
        <Link className="site-brand" href="/" aria-label="Emblor home">
          <BrandMark />
          <span>emblor</span>
        </Link>
        <nav className="site-navigation" aria-label="Primary navigation">
          {[
            ['/docs/introduction', 'Docs'],
            ['/playground', 'Playground'],
          ].map(([href, label]) => (
            <Link
              key={href}
              href={href}
              aria-current={
                href.startsWith('/docs')
                  ? pathname.startsWith('/docs')
                    ? 'page'
                    : undefined
                  : pathname.startsWith(href)
                    ? 'page'
                    : undefined
              }
            >
              {label}
            </Link>
          ))}
          <Badge variant="outline">v2.x alpha</Badge>
        </nav>
        <div className="site-header-actions">
          <DocsSearchDialog />
          <nav className="social-navigation" aria-label="Package and social links">
            <Button asChild variant="ghost" size="icon-sm">
              <a href={siteConfig.links.npm} aria-label="Emblor on npm" target="_blank" rel="noreferrer">
                <NpmIcon />
              </a>
            </Button>
            <Button asChild variant="ghost" size="icon-sm">
              <a href={siteConfig.links.twitter} aria-label="Jaleel Bennett on X" target="_blank" rel="noreferrer">
                <XIcon />
              </a>
            </Button>
            <Button asChild variant="ghost" size="icon-sm">
              <a href={siteConfig.links.github} aria-label="Emblor on GitHub" target="_blank" rel="noreferrer">
                <GitHubIcon />
              </a>
            </Button>
          </nav>
          <ThemeToggle />
        </div>
      </div>
    </Header>
  );
}
