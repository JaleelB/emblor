'use client';

import * as React from 'react';
import { EmblorClear, EmblorInput, EmblorRoot, EmblorTag, EmblorTagList, EmblorTagRemove, EmblorTagText } from 'emblor';
import { X, Check, ShieldCheck, Layers, Sparkles, SlidersHorizontal, ArrowRight, Braces } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { cn } from '@/lib/utils';

/* Style cycling variants */
const STYLE_VARIANTS = [
  { id: 'modern-chips', label: 'modern chips', file: 'chips.tsx' },
  { id: 'underline-tokens', label: 'underline', file: 'underline.tsx' },
  { id: 'pill-tags', label: 'pills', file: 'pills.tsx' },
  { id: 'monochrome', label: 'monochrome', file: 'monochrome.tsx' },
] as const;

function StyleCyclerCard() {
  const [active, setActive] = React.useState(0);
  const [isPaused, setIsPaused] = React.useState(false);

  React.useEffect(() => {
    if (isPaused) return;
    const timer = setInterval(() => {
      setActive((prev) => (prev + 1) % STYLE_VARIANTS.length);
    }, 3400);
    return () => clearInterval(timer);
  }, [isPaused]);

  const currentVariant = STYLE_VARIANTS[active];

  return (
    <Card
      className="group relative flex flex-col justify-between overflow-hidden border-border/70 bg-card/60 transition-all duration-200 hover:border-border hover:shadow-lg"
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
    >
      <CardHeader className="p-6">
        <div className="flex items-center justify-between">
          <span className="font-mono text-xs text-muted-foreground">02 / STYLING</span>
          <Badge variant="outline" className="font-mono text-[10px]">
            {currentVariant.file}
          </Badge>
        </div>
        <CardTitle className="mt-2 text-lg font-semibold tracking-tight text-foreground">
          Bring your own design
        </CardTitle>
        <CardDescription className="text-xs text-muted-foreground">
          No runtime CSS or bloated theme injections. Swap classes or components seamlessly.
        </CardDescription>
      </CardHeader>

      <CardContent className="p-6 pt-0">
        {/* Style Showcase Viewport */}
        <div className="bg-dot-grid flex min-h-[130px] flex-col items-center justify-center rounded-xl border border-border/60 p-4 transition-all">
          {active === 0 && (
            <div className="flex flex-wrap items-center gap-2">
              {['react', 'nextjs', 'tailwind'].map((tag) => (
                <span
                  key={tag}
                  className="inline-flex items-center gap-1.5 rounded-lg border border-border/80 bg-secondary/80 px-2.5 py-1 text-xs font-medium text-secondary-foreground shadow-xs"
                >
                  <span>{tag}</span>
                  <X size={11} className="text-muted-foreground" />
                </span>
              ))}
            </div>
          )}

          {active === 1 && (
            <div className="flex flex-wrap items-center gap-3">
              {['react', 'nextjs', 'tailwind'].map((tag) => (
                <span
                  key={tag}
                  className="inline-flex items-center gap-1.5 border-b-2 border-primary/80 pb-0.5 text-xs font-mono font-medium text-foreground"
                >
                  <span>#{tag}</span>
                  <span className="text-[10px] text-muted-foreground">×</span>
                </span>
              ))}
            </div>
          )}

          {active === 2 && (
            <div className="flex flex-wrap items-center gap-2">
              {['react', 'nextjs', 'tailwind'].map((tag) => (
                <span
                  key={tag}
                  className="inline-flex items-center gap-1.5 rounded-full border border-primary/20 bg-primary/10 px-3 py-1 text-xs font-medium text-primary"
                >
                  <span className="size-1.5 rounded-full bg-primary" />
                  <span>{tag}</span>
                  <X size={11} className="opacity-70" />
                </span>
              ))}
            </div>
          )}

          {active === 3 && (
            <div className="flex flex-wrap items-center gap-2">
              {['react', 'nextjs', 'tailwind'].map((tag) => (
                <span
                  key={tag}
                  className="inline-flex items-center gap-1.5 rounded-md bg-foreground px-2.5 py-1 text-xs font-mono font-medium text-background"
                >
                  <span>{tag}</span>
                  <X size={11} className="opacity-60" />
                </span>
              ))}
            </div>
          )}
        </div>

        {/* Tab Controls */}
        <div className="mt-4 flex items-center justify-between gap-1 rounded-lg border border-border/60 bg-muted/40 p-1">
          {STYLE_VARIANTS.map((variant, idx) => (
            <button
              key={variant.id}
              type="button"
              onClick={() => setActive(idx)}
              className={cn(
                'flex-1 rounded py-1 text-center font-mono text-[11px] capitalize transition-all',
                active === idx
                  ? 'bg-background font-medium text-foreground shadow-xs'
                  : 'text-muted-foreground hover:text-foreground',
              )}
            >
              {variant.label}
            </button>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}

function ClipboardFormCard() {
  const [copied, setCopied] = React.useState(false);
  const sampleCsv = 'frontend, fullstack, design-systems, accessibility';

  return (
    <Card className="group relative flex flex-col justify-between overflow-hidden border-border/70 bg-card/60 transition-all duration-200 hover:border-border hover:shadow-lg">
      <CardHeader className="p-6">
        <div className="flex items-center justify-between">
          <span className="font-mono text-xs text-muted-foreground">03 / FORMS & CLIPBOARD</span>
          <Badge variant="outline" className="font-mono text-[10px]">
            Native FormData
          </Badge>
        </div>
        <CardTitle className="mt-2 text-lg font-semibold tracking-tight text-foreground">
          Paste splitting & native form submit
        </CardTitle>
        <CardDescription className="text-xs text-muted-foreground">
          Pasting comma or newline-separated tokens splits them into tags automatically.
        </CardDescription>
      </CardHeader>

      <CardContent className="p-6 pt-0 space-y-3">
        <div className="rounded-xl border border-border/70 bg-muted/30 p-3.5 font-mono text-xs">
          <div className="flex items-center justify-between text-muted-foreground pb-2 border-b border-border/40">
            <span className="text-[10px] uppercase">Clipboard Input</span>
            <button
              type="button"
              onClick={() => {
                navigator.clipboard.writeText(sampleCsv);
                setCopied(true);
                setTimeout(() => setCopied(false), 2000);
              }}
              className="text-[11px] text-primary hover:underline"
            >
              {copied ? '✓ Copied to clipboard' : 'Copy sample CSV'}
            </button>
          </div>
          <p className="mt-2 text-foreground truncate">{sampleCsv}</p>
        </div>

        <div className="rounded-xl border border-border/70 bg-muted/20 p-3 font-mono text-xs">
          <div className="text-[10px] text-muted-foreground uppercase pb-1">FormData Output</div>
          <code className="text-[11px] text-foreground">
            {'{'} tags: [&quot;frontend&quot;, &quot;fullstack&quot;, &quot;design-systems&quot;] {'}'}
          </code>
        </div>
      </CardContent>
    </Card>
  );
}

function ValidationCard() {
  return (
    <Card className="group relative flex flex-col justify-between overflow-hidden border-border/70 bg-card/60 transition-all duration-200 hover:border-border hover:shadow-lg">
      <CardHeader className="p-6">
        <div className="flex items-center justify-between">
          <span className="font-mono text-xs text-muted-foreground">04 / CONSTRAINTS</span>
          <Badge variant="outline" className="font-mono text-[10px]">
            Regex & Limits
          </Badge>
        </div>
        <CardTitle className="mt-2 text-lg font-semibold tracking-tight text-foreground">
          Pattern gates & duplicate guards
        </CardTitle>
        <CardDescription className="text-xs text-muted-foreground">
          Validate tags against RegExp patterns, reject duplicates, and enforce max tag limits.
        </CardDescription>
      </CardHeader>

      <CardContent className="p-6 pt-0">
        <div className="space-y-2.5 font-mono text-xs">
          <div className="flex items-center justify-between rounded-lg border border-border/70 bg-muted/30 p-2.5">
            <div className="flex items-center gap-2">
              <span className="flex size-4 items-center justify-center rounded-full bg-emerald-500/20 text-[10px] text-emerald-500">
                ✓
              </span>
              <span className="text-foreground">pattern: /^[a-z0-9_-]+$/</span>
            </div>
            <Badge variant="secondary" className="text-[10px]">
              Alphanumeric
            </Badge>
          </div>

          <div className="flex items-center justify-between rounded-lg border border-border/70 bg-muted/30 p-2.5">
            <div className="flex items-center gap-2">
              <span className="flex size-4 items-center justify-center rounded-full bg-destructive/20 text-[10px] text-destructive">
                ✗
              </span>
              <span className="text-muted-foreground line-through">duplicate: &quot;react&quot;</span>
            </div>
            <span className="text-[10px] text-destructive">rejected</span>
          </div>

          <div className="flex items-center justify-between rounded-lg border border-border/70 bg-muted/30 p-2.5">
            <div className="flex items-center gap-2">
              <span className="flex size-4 items-center justify-center rounded-full bg-primary/20 text-[10px] text-primary">
                #
              </span>
              <span className="text-foreground">maxTags: 10</span>
            </div>
            <span className="text-[10px] text-muted-foreground">enforced</span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

function AnatomyTreeCard() {
  return (
    <Card className="group relative flex flex-col justify-between overflow-hidden border-border/70 bg-card/60 transition-all duration-200 hover:border-border hover:shadow-lg md:col-span-2">
      <CardHeader className="p-6">
        <div className="flex items-center justify-between">
          <span className="font-mono text-xs text-muted-foreground">01 / COMPOUND API</span>
          <Badge variant="outline" className="font-mono text-[10px]">
            6 Primitives
          </Badge>
        </div>
        <CardTitle className="mt-2 text-lg font-semibold tracking-tight text-foreground">
          Composable compound architecture
        </CardTitle>
        <CardDescription className="text-xs text-muted-foreground">
          Compose the exact parts you need. No bloated monolith component with dozens of boolean props.
        </CardDescription>
      </CardHeader>

      <CardContent className="p-6 pt-0">
        <div className="grid gap-2 sm:grid-cols-3 font-mono text-xs">
          {[
            { tag: 'EmblorRoot', role: 'State & context container' },
            { tag: 'EmblorTagList', role: 'Render loop & layout wrapper' },
            { tag: 'EmblorTag', role: 'Focusable individual item' },
            { tag: 'EmblorTagText', role: 'Accessible tag text slot' },
            { tag: 'EmblorTagRemove', role: 'Remove button action' },
            { tag: 'EmblorInput', role: 'Draft text input with caret' },
          ].map((part) => (
            <div
              key={part.tag}
              className="rounded-xl border border-border/70 bg-muted/20 p-3 transition-colors hover:border-primary/40 hover:bg-muted/40"
            >
              <code className="text-xs font-semibold text-primary">&lt;{part.tag}&gt;</code>
              <p className="mt-1 font-sans text-[11px] text-muted-foreground">{part.role}</p>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}

function BundleWeightCard() {
  return (
    <Card className="group relative flex flex-col justify-between overflow-hidden border-border/70 bg-card/60 transition-all duration-200 hover:border-border hover:shadow-lg">
      <CardHeader className="p-6">
        <div className="flex items-center justify-between">
          <span className="font-mono text-xs text-muted-foreground">05 / BUNDLE</span>
          <Badge variant="outline" className="font-mono text-[10px]">
            Zero Dependencies
          </Badge>
        </div>
        <CardTitle className="mt-2 text-lg font-semibold tracking-tight text-foreground">
          Featherweight & Fast
        </CardTitle>
        <CardDescription className="text-xs text-muted-foreground">
          Small footprint, zero runtime styling overhead, and immediate responsiveness.
        </CardDescription>
      </CardHeader>

      <CardContent className="p-6 pt-0">
        <div className="flex items-baseline justify-between border-b border-border/60 pb-3">
          <span className="text-3xl font-bold tracking-tight text-foreground">~3.8</span>
          <span className="font-mono text-xs text-muted-foreground">kB gzipped ESM</span>
        </div>
        <div className="mt-3 grid grid-cols-2 gap-2 text-center text-xs">
          <div className="rounded-lg border border-border/60 bg-muted/30 p-2">
            <span className="font-mono font-semibold text-foreground">0</span>
            <p className="text-[10px] text-muted-foreground">runtime CSS</p>
          </div>
          <div className="rounded-lg border border-border/60 bg-muted/30 p-2">
            <span className="font-mono font-semibold text-foreground">18 & 19</span>
            <p className="text-[10px] text-muted-foreground">React support</p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

export function FeatureBento() {
  return (
    <section className="py-16 sm:py-24" aria-labelledby="features-title">
      <div className="mb-10 sm:mb-14">
        <div className="flex items-center gap-2 font-mono text-xs text-muted-foreground">
          <span className="text-primary font-semibold">~/</span>features
        </div>
        <h2 id="features-title" className="mt-2 text-2xl sm:text-3xl font-bold tracking-tight text-foreground">
          Small API. Unusually capable.
        </h2>
        <p className="mt-2 max-w-xl text-sm sm:text-base text-muted-foreground">
          Everything your design system needs to build world-class tag experiences without fighting complex internals.
        </p>
      </div>

      <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
        <AnatomyTreeCard />
        <BundleWeightCard />
        <StyleCyclerCard />
        <ClipboardFormCard />
        <ValidationCard />
      </div>
    </section>
  );
}
