import Link from 'next/link';
import { ArrowRight, Keyboard, Paintbrush, Puzzle } from 'lucide-react';
import { HeroTagInput } from '@/components/hero-tag-input';
import { InstallCommand } from '@/components/install-command';
import { MarketingSpecimen } from '@/components/marketing-specimen';
import { SiteHeader } from '@/components/site-header';
import { Button } from '@/components/ui/button';
import { siteConfig } from '@/config/site-config';

export default function HomePage() {
  return (
    <div className="marketing-page">
      <SiteHeader />
      <main id="main-content">
        <section className="home-hero" aria-labelledby="hero-title">
          <Link href="/docs/guides/migration" className="release-link">
            <span>v2 alpha</span> A fresh start for tag inputs <ArrowRight aria-hidden="true" />
          </Link>
          <h1 id="hero-title">
            A small input.
            <br />
            <span>Room for every idea.</span>
          </h1>
          <p className="hero-description">
            The headless tag input for React. All the keyboard, validation, and form behavior you need. Every pixel
            yours.
          </p>
          <HeroTagInput />
          <div className="hero-actions">
            <Button asChild size="lg">
              <Link href="/docs/introduction">
                Get started
                <ArrowRight data-icon="inline-end" />
              </Link>
            </Button>
            <InstallCommand />
          </div>
          <p className="hero-footnote">
            React 18 & 19 <span>·</span> TypeScript <span>·</span> No runtime CSS <span>·</span> Open source
          </p>
        </section>
        <div className="home-content">
          <section className="home-features" aria-label="Why Emblor">
            {[
              {
                Icon: Keyboard,
                title: 'Feels like an input.',
                text: 'Type, paste, remove, and move between tags with familiar keyboard interactions.',
                href: '/docs/guides/keyboard-and-focus',
              },
              {
                Icon: Paintbrush,
                title: 'Looks like your product.',
                text: 'Style every part with CSS or Tailwind. Your tokens, your components, your design.',
                href: '/docs/guides/styling',
              },
              {
                Icon: Puzzle,
                title: 'Fits what you’re building.',
                text: 'Compose with native forms, shadcn Dialog, Command suggestions, and sortable lists.',
                href: '/docs/guides/integrations',
              },
            ].map(({ Icon, title, text, href }) => (
              <Link key={title} href={href} className="home-feature">
                <Icon aria-hidden="true" />
                <h2>{title}</h2>
                <p>{text}</p>
                <span>
                  Read the guide <ArrowRight aria-hidden="true" />
                </span>
              </Link>
            ))}
          </section>
          <section className="home-composition" aria-labelledby="composition-title">
            <div className="section-intro">
              <p className="section-eyebrow">Compose your field</p>
              <h2 id="composition-title">
                The behavior is handled.
                <br />
                The design is up to you.
              </h2>
              <p>
                Start with a few small components. Add your classes, connect your state, and make it feel at home in
                your app.
              </p>
              <Button asChild variant="outline">
                <Link href="/docs/anatomy">
                  Explore the API
                  <ArrowRight data-icon="inline-end" />
                </Link>
              </Button>
            </div>
            <MarketingSpecimen />
          </section>
          <section className="home-examples" aria-labelledby="examples-title">
            <div className="section-intro">
              <p className="section-eyebrow">Built to work together</p>
              <h2 id="examples-title">Less setup. More building.</h2>
              <p>Explore working examples, inspect the complete source, and install the one you need.</p>
            </div>
            <div className="home-example-links">
              {[
                ['Suggestions', 'Pair a tag field with Command and Popover.', 'tag-input-popover'],
                ['Inside a dialog', 'Edit tags without leaving the page.', 'tag-input-dialog'],
                ['Drag to reorder', 'Give each tag a place in the list.', 'tag-input-reorder'],
              ].map(([title, description, slug]) => (
                <Link href={'/playground/' + slug} key={slug}>
                  <span className="home-mini-tags" aria-hidden="true">
                    <span>react</span>
                    <span>typescript</span>
                    <span>+</span>
                  </span>
                  <h3>
                    {title}
                    <ArrowRight aria-hidden="true" />
                  </h3>
                  <p>{description}</p>
                </Link>
              ))}
            </div>
          </section>
          <section className="home-closing">
            <h2>Your next tag input starts here.</h2>
            <div className="hero-actions">
              <Button asChild>
                <Link href="/docs/installation">
                  Read the docs
                  <ArrowRight data-icon="inline-end" />
                </Link>
              </Button>
              <Button asChild variant="outline">
                <Link href="/playground">Explore examples</Link>
              </Button>
            </div>
          </section>
          <footer className="site-footer">
            <p>
              Emblor <span>by {siteConfig.author}</span>
            </p>
            <nav aria-label="Footer navigation">
              <Link href="/docs/guides/migration">Migration</Link>
              <a href={siteConfig.links.npm}>npm</a>
              <a href={siteConfig.links.github}>GitHub</a>
            </nav>
          </footer>
        </div>
      </main>
    </div>
  );
}
