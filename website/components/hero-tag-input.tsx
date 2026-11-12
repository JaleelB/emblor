'use client';

import * as React from 'react';
import { Delete } from 'lucide-react';
import { TagField } from '@/components/tag-field';
import { ToggleGroup, ToggleGroupItem } from '@/components/ui/toggle-group';

const STYLE_CYCLE = ['soft', 'outline', 'color'] as const;

type KeyToken = 'enter' | 'backspace' | 'left' | 'right' | 'paste';

function useHeroKeyPresses(containerRef: React.RefObject<HTMLElement | null>) {
  const [down, setDown] = React.useState<KeyToken[]>([]);
  const [pulse, setPulse] = React.useState<Partial<Record<KeyToken, number>>>({});
  const heldRef = React.useRef<Set<KeyToken>>(new Set());
  const timers = React.useRef<Partial<Record<KeyToken, ReturnType<typeof setTimeout>>>>({});

  const trigger = React.useCallback((token: KeyToken, duration = 260) => {
    if (timers.current[token]) clearTimeout(timers.current[token]);
    heldRef.current.add(token);
    setDown(Array.from(heldRef.current));
    setPulse((prev) => ({ ...prev, [token]: (prev[token] ?? 0) + 1 }));
    timers.current[token] = setTimeout(() => {
      heldRef.current.delete(token);
      setDown(Array.from(heldRef.current));
    }, duration);
  }, []);

  React.useEffect(() => {
    const el = containerRef.current;
    if (!el) return;

    const mapKey = (key: string): KeyToken | null => {
      if (key === 'Enter' || key === ',') return 'enter';
      if (key === 'Backspace' || key === 'Delete') return 'backspace';
      if (key === 'ArrowLeft') return 'left';
      if (key === 'ArrowRight') return 'right';
      return null;
    };

    const onKeyDown = (e: KeyboardEvent) => {
      const token = mapKey(e.key);
      if (token) trigger(token, 260);
    };

    const onPaste = () => {
      trigger('paste', 360);
    };

    el.addEventListener('keydown', onKeyDown, true);
    el.addEventListener('paste', onPaste, true);
    return () => {
      el.removeEventListener('keydown', onKeyDown, true);
      el.removeEventListener('paste', onPaste, true);
    };
  }, [containerRef, trigger]);

  return { down, pulse, trigger };
}

function LiveKbd({
  token,
  down,
  pulse,
  wide = false,
  children,
}: {
  token: KeyToken;
  down: KeyToken[];
  pulse: Partial<Record<KeyToken, number>>;
  wide?: boolean;
  children: React.ReactNode;
}) {
  const isDown = down.includes(token);
  const nonce = pulse[token];
  return (
    <span className="xp-kbd-wrap" aria-hidden="true">
      {nonce ? <span key={nonce} className="xp-kbd-pulse" /> : null}
      <kbd className={`xp-kbd ${wide ? 'xp-kbd--wide' : ''} ${isDown ? 'xp-kbd--down' : ''}`}>{children}</kbd>
    </span>
  );
}

export function HeroTagInput() {
  const [style, setStyle] = React.useState<string>('soft');
  const [paused, setPaused] = React.useState(false);
  const demoRef = React.useRef<HTMLDivElement>(null);
  const stageRef = React.useRef<HTMLDivElement>(null);
  const { down, pulse } = useHeroKeyPresses(demoRef);

  // Auto-cycle styles gently until the user interacts with or hovers the hero card
  React.useEffect(() => {
    if (paused) return;
    if (typeof window !== 'undefined' && window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

    const id = window.setInterval(() => {
      setStyle((current) => {
        const idx = STYLE_CYCLE.indexOf(current as (typeof STYLE_CYCLE)[number]);
        return STYLE_CYCLE[(idx + 1) % STYLE_CYCLE.length];
      });
    }, 3600);

    return () => window.clearInterval(id);
  }, [paused]);

  // Measure active tag relative to stageRef (its actual offsetParent) to drive a single gliding focus ring
  const [ring, setRing] = React.useState<{
    x: number;
    y: number;
    w: number;
    h: number;
    visible: boolean;
    snap: boolean;
  }>({ x: 0, y: 0, w: 0, h: 0, visible: false, snap: true });

  React.useEffect(() => {
    const container = demoRef.current;
    const stage = stageRef.current;
    if (!container || !stage) return;

    const updateRing = () => {
      const activeEl = document.activeElement as HTMLElement | null;
      const chip = activeEl?.closest('.tag-chip') as HTMLElement | null;
      if (chip && stage.contains(chip)) {
        const a = chip.getBoundingClientRect();
        const b = stage.getBoundingClientRect();
        setRing((prev) => ({
          x: a.left - b.left,
          y: a.top - b.top,
          w: a.width,
          h: a.height,
          visible: true,
          snap: !prev.visible,
        }));
      } else {
        setRing((prev) => (prev.visible ? { ...prev, visible: false } : prev));
      }
    };

    const scheduleUpdate = () => {
      window.requestAnimationFrame(updateRing);
    };

    const mutationObserver = new MutationObserver(scheduleUpdate);
    mutationObserver.observe(stage, { childList: true, subtree: true });

    const resizeObserver = new ResizeObserver(scheduleUpdate);
    resizeObserver.observe(stage);

    container.addEventListener('focusin', updateRing);
    container.addEventListener('focusout', scheduleUpdate);
    window.addEventListener('resize', updateRing);
    return () => {
      mutationObserver.disconnect();
      resizeObserver.disconnect();
      container.removeEventListener('focusin', updateRing);
      container.removeEventListener('focusout', scheduleUpdate);
      window.removeEventListener('resize', updateRing);
    };
  }, []);

  return (
    <div
      ref={demoRef}
      className="hero-demo"
      data-tag-style={style}
      data-running={!paused}
      data-spotlight
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
      onFocusCapture={() => setPaused(true)}
      onBlurCapture={(e) => {
        if (!e.currentTarget.contains(e.relatedTarget as Node | null)) {
          setPaused(false);
        }
      }}
    >
      <div className="hero-demo-field">
        <div ref={stageRef} className="hero-field-stage">
          <TagField
            initialTags={['React', 'TypeScript', 'Design systems']}
            label="Your next project"
            placeholder="Add a skill"
            description="Type a tag and press Enter. Paste a comma-separated list to add several."
            showOutput={false}
          />
          <div
            aria-hidden="true"
            className="hero-gliding-ring"
            style={{
              width: ring.w,
              height: ring.h,
              transform: `translate(${ring.x}px, ${ring.y}px)`,
              opacity: ring.visible ? 1 : 0,
              transition: ring.snap
                ? 'opacity 0.18s ease'
                : 'transform 0.14s cubic-bezier(0.22, 1, 0.36, 1), width 0.14s ease, height 0.14s ease, opacity 0.14s ease',
            }}
          />
        </div>

        <div className="hero-key-strip" aria-hidden="true">
          <span className="hero-key-item">
            <LiveKbd token="enter" down={down} pulse={pulse} wide>
              Enter ↵
            </LiveKbd>
            <span>commit</span>
          </span>
          <span className="hero-key-sep">·</span>
          <span className="hero-key-item">
            <LiveKbd token="left" down={down} pulse={pulse}>
              ←
            </LiveKbd>
            <LiveKbd token="right" down={down} pulse={pulse}>
              →
            </LiveKbd>
            <span>navigate</span>
          </span>
          <span className="hero-key-sep">·</span>
          <span className="hero-key-item">
            <LiveKbd token="backspace" down={down} pulse={pulse}>
              <Delete className="size-3" />
            </LiveKbd>
            <span>remove</span>
          </span>
          <span className="hero-key-sep">·</span>
          <span className="hero-key-item">
            <LiveKbd token="paste" down={down} pulse={pulse} wide>
              a, b, c
            </LiveKbd>
            <span>paste list</span>
          </span>
        </div>
      </div>

      <div className="hero-style-picker">
        <span>Same behavior. Your style.</span>
        <ToggleGroup
          type="single"
          value={style}
          onValueChange={(value) => {
            if (value) {
              setPaused(true);
              setStyle(value);
            }
          }}
          variant="outline"
          size="sm"
          aria-label="Tag appearance"
        >
          <ToggleGroupItem value="soft" className="hero-style-tab">
            <span>Soft</span>
            <i className="hero-style-bar" aria-hidden="true" />
          </ToggleGroupItem>
          <ToggleGroupItem value="outline" className="hero-style-tab">
            <span>Outline</span>
            <i className="hero-style-bar" aria-hidden="true" />
          </ToggleGroupItem>
          <ToggleGroupItem value="color" className="hero-style-tab">
            <span>Color</span>
            <i className="hero-style-bar" aria-hidden="true" />
          </ToggleGroupItem>
        </ToggleGroup>
      </div>
    </div>
  );
}
