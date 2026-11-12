import Link from 'next/link';
import { ArrowRight, Delete, GripVertical, Keyboard, Paintbrush, Puzzle, X } from 'lucide-react';
import { HeroTagInput } from '@/components/hero-tag-input';
import { HomeComposition } from '@/components/home-composition';
import { InstallCommand } from '@/components/install-command';
import { SiteHeader } from '@/components/site-header';
import { Button } from '@/components/ui/button';
import { siteConfig } from '@/config/site-config';
import { SpotlightRegistrator } from '@/lib/spotlight';
import './home.css';

/* Decorative illustrations. Every visual is aria-hidden; the copy beside it carries the meaning. */

function KeyboardVisual() {
  return (
    <div className="home-visual home-visual-keys" aria-hidden="true">
      <div className="mini-field">
        <span className="mini-tag">react</span>
        <span className="mini-tag is-focused">typescript</span>
        <span className="mini-caret" />
      </div>
      <div className="mini-keys">
        <span className="home-key">←</span>
        <span className="home-key">→</span>
        <span className="home-key">
          <Delete />
        </span>
        <span className="home-key home-key-wide">Enter ↵</span>
      </div>
    </div>
  );
}

function StyleVisual() {
  return (
    <div className="home-visual home-visual-styles" aria-hidden="true">
      {[
        ['', '.soft'],
        ['is-outline', '.outline'],
        ['is-color', '.color'],
      ].map(([variant, token], idx) => (
        <div className="mini-style-row" key={token} data-row={idx}>
          <span className={'mini-tag ' + variant}>
            design <X />
          </span>
          <code>{token}</code>
        </div>
      ))}
    </div>
  );
}

function ComposeVisual() {
  return (
    <div className="home-visual home-visual-compose" aria-hidden="true">
      <div className="mini-node-row">
        <span className="mini-node">&lt;form&gt;</span>
        <span className="mini-node">Dialog</span>
      </div>
      <span className="mini-node mini-node-core">emblor</span>
      <div className="mini-node-row">
        <span className="mini-node">Command</span>
        <span className="mini-node">Sortable</span>
      </div>
    </div>
  );
}

function SuggestionsVisual() {
  return (
    <div className="home-visual example-visual-suggest" aria-hidden="true">
      <div className="mini-field">
        <span className="mini-tag">react</span>
        <span className="mini-typed">
          ty
          <span className="mini-caret" />
        </span>
      </div>
      <div className="mini-popover">
        <span className="is-active">typescript</span>
        <span>type-safety</span>
        <span>typography</span>
      </div>
    </div>
  );
}

function DialogVisual() {
  return (
    <div className="home-visual example-visual-dialog" aria-hidden="true">
      <div className="mini-dialog">
        <div className="mini-dialog-head">
          <span className="mini-line" />
          <X />
        </div>
        <div className="mini-field">
          <span className="mini-tag">launch</span>
          <span className="mini-tag">q3</span>
          <span className="mini-caret" />
        </div>
        <div className="mini-dialog-foot">
          <span className="mini-button" />
          <span className="mini-button is-primary" />
        </div>
      </div>
    </div>
  );
}

function ReorderVisual() {
  return (
    <div className="home-visual example-visual-reorder" aria-hidden="true">
      <span className="mini-tag">
        <GripVertical /> react
      </span>
      <span className="mini-tag is-lifted">
        <GripVertical /> typescript
      </span>
      <span className="mini-slot" />
      <span className="mini-tag">
        <GripVertical /> css
      </span>
    </div>
  );
}

const features = [
  {
    index: '01',
    Icon: Keyboard,
    title: 'Feels like an input.',
    text: 'Type, paste, remove, and move between tags with familiar keyboard interactions.',
    href: '/docs/guides/keyboard-and-focus',
    Visual: KeyboardVisual,
  },
  {
    index: '02',
    Icon: Paintbrush,
    title: 'Looks like your product.',
    text: 'Style every part with CSS or Tailwind. Your tokens, your components, your design.',
    href: '/docs/guides/styling',
    Visual: StyleVisual,
  },
  {
    index: '03',
    Icon: Puzzle,
    title: 'Fits what you’re building.',
    text: 'Compose with native forms, shadcn Dialog, Command suggestions, and sortable lists.',
    href: '/docs/guides/integrations',
    Visual: ComposeVisual,
  },
];

const examples = [
  {
    index: '01',
    title: 'Suggestions',
    description: 'Pair a tag field with Command and Popover.',
    slug: 'tag-input-popover',
    Visual: SuggestionsVisual,
  },
  {
    index: '02',
    title: 'Inside a dialog',
    description: 'Edit tags without leaving the page.',
    slug: 'tag-input-dialog',
    Visual: DialogVisual,
  },
  {
    index: '03',
    title: 'Drag to reorder',
    description: 'Give each tag a place in the list.',
    slug: 'tag-input-reorder',
    Visual: ReorderVisual,
  },
];

export default function HomePage() {
  return (
    <div className="marketing-page">
      <SpotlightRegistrator />
      <SiteHeader />
      <main id="main-content" className="main">
        <section className="home-hero container" aria-labelledby="hero-title">
          <div className="home-hero-ambient" aria-hidden="true" />
          <div className="home-hero-inner">
            <Link href="/docs/guides/migration" className="release-link" data-spotlight>
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
              <Button asChild size="lg" className="xp-btn" data-spotlight>
                <Link href="/docs/introduction">
                  Get started
                  <ArrowRight data-icon="inline-end" />
                </Link>
              </Button>
              <div data-spotlight className="hero-install-wrap">
                <InstallCommand className="hero-install" />
              </div>
            </div>
            <p className="hero-footnote">
              React 18 &amp; 19 <span aria-hidden="true">·</span> TypeScript <span aria-hidden="true">·</span> No
              runtime CSS <span aria-hidden="true">·</span> Open source
            </p>
          </div>
        </section>

        <section className="home-features-section container" aria-label="Why Emblor">
          <div className="home-features">
            {features.map(({ index, Icon, title, text, href, Visual }) => (
              <Link key={title} href={href} className="home-feature" data-spotlight>
                <div className="home-card-header">
                  <span className="home-card-index">{index}</span>
                  <Icon aria-hidden="true" />
                </div>
                <Visual />
                <div className="home-feature-body">
                  <h2>{title}</h2>
                  <p>{text}</p>
                  <span className="home-link-cue">
                    Read the guide <ArrowRight aria-hidden="true" />
                  </span>
                </div>
              </Link>
            ))}
          </div>
        </section>

        <HomeComposition />

        <section className="home-examples container" aria-labelledby="examples-title">
          <div className="section-intro home-examples-intro">
            <div>
              <p className="section-eyebrow">Built to work together</p>
              <h2 id="examples-title">Less setup. More building.</h2>
            </div>
            <p>Explore working examples, inspect the complete source, and install the one you need.</p>
          </div>
          <div className="home-example-links">
            {examples.map(({ index, title, description, slug, Visual }) => (
              <Link href={'/playground/' + slug} key={slug} className="home-example" data-spotlight>
                <Visual />
                <div className="home-example-body">
                  <div className="home-example-head">
                    <span className="home-card-index">{index}</span>
                    <h3>
                      {title}
                      <ArrowRight aria-hidden="true" />
                    </h3>
                  </div>
                  <p>{description}</p>
                </div>
              </Link>
            ))}
          </div>
        </section>

        <section className="home-closing container" aria-labelledby="closing-title">
          <div className="home-closing-ambient" aria-hidden="true" />
          <div className="home-closing-wordmark" aria-hidden="true">
            emblor
          </div>
          <div className="home-closing-inner">
            <h2 id="closing-title">Your next tag input starts here.</h2>
            <div className="hero-actions">
              <Button asChild size="lg" className="xp-btn" data-spotlight>
                <Link href="/docs/installation">
                  Read the docs
                  <ArrowRight data-icon="inline-end" />
                </Link>
              </Button>
              <Button asChild size="lg" variant="outline" className="xp-btn-secondary" data-spotlight>
                <Link href="/playground">Explore examples</Link>
              </Button>
            </div>
          </div>
        </section>

        <footer className="site-footer container">
          <p>
            Emblor <span>by {siteConfig.author}</span>
          </p>
          <nav aria-label="Footer navigation">
            <Link href="/docs/guides/migration">Migration</Link>
            <a href={siteConfig.links.npm}>npm</a>
            <a href={siteConfig.links.github}>GitHub</a>
          </nav>
        </footer>
      </main>
    </div>
  );
}
