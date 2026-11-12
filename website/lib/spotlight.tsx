'use client';

/*
 * Pointer-tracked border rim illumination, modeled after input-otp's spotlight.ts.
 * Single passive pointermove listener, batched getBoundingClientRect reads, and
 * auto-disabled on coarse pointers or prefers-reduced-motion.
 */

import * as React from 'react';

export type SpotlightOptions = {
  /** How far the pointer can be from the box before its rim goes dark. */
  reach?: number;
  /** Radius of the light pool the pointer drags along the rim. */
  spread?: number;
  /** How much of the light this rim returns, 0–1. */
  gain?: number;
};

const DEFAULTS: Required<SpotlightOptions> = {
  reach: 320,
  spread: 260,
  gain: 1,
};

type Entry = Required<SpotlightOptions> & {
  ring: HTMLSpanElement;
  spot: number;
  mx: number;
  my: number;
};

const REGISTRY = new Map<HTMLElement, Entry>();

let pointerX = -99999;
let pointerY = -99999;
let frame = 0;
let bound = false;

const MARGIN = 240;

const supported = () =>
  typeof window !== 'undefined' &&
  window.matchMedia('(hover: hover) and (pointer: fine)').matches &&
  !window.matchMedia('(prefers-reduced-motion: reduce)').matches;

const paint = () => {
  frame = 0;
  const els = Array.from(REGISTRY.keys());
  const rects = els.map((el) => el.getBoundingClientRect());
  let lit = false;

  els.forEach((el, i) => {
    const rect = rects[i];
    const entry = REGISTRY.get(el);
    if (!entry) return;

    const offscreen = rect.width === 0 || rect.bottom < -MARGIN || rect.top > window.innerHeight + MARGIN;

    const dx = Math.max(rect.left - pointerX, 0, pointerX - rect.right);
    const dy = Math.max(rect.top - pointerY, 0, pointerY - rect.bottom);
    const near = offscreen ? 0 : Math.max(0, 1 - Math.hypot(dx, dy) / entry.reach);
    const spot = Math.round(near * near * entry.gain * 1000) / 1000;

    if (spot !== entry.spot) {
      entry.spot = spot;
      el.style.setProperty('--xp-spot', String(spot));
    }
    if (spot === 0) return;

    lit = true;
    const mx = Math.round(pointerX - rect.left);
    const my = Math.round(pointerY - rect.top);
    if (mx !== entry.mx) {
      entry.mx = mx;
      el.style.setProperty('--xp-mx', `${mx}px`);
    }
    if (my !== entry.my) {
      entry.my = my;
      el.style.setProperty('--xp-my', `${my}px`);
    }
  });

  if (lit) schedule();
};

const schedule = () => {
  if (!frame) frame = requestAnimationFrame(paint);
};

const onMove = (event: PointerEvent) => {
  pointerX = event.clientX;
  pointerY = event.clientY;
  schedule();
};

const onLeave = () => {
  pointerX = -99999;
  pointerY = -99999;
  schedule();
};

const bind = () => {
  if (bound) return;
  bound = true;
  window.addEventListener('pointermove', onMove, { passive: true });
  document.addEventListener('pointerleave', onLeave);
  window.addEventListener('scroll', schedule, { passive: true });
  window.addEventListener('resize', schedule);
};

const unbind = () => {
  if (!bound) return;
  bound = false;
  window.removeEventListener('pointermove', onMove);
  document.removeEventListener('pointerleave', onLeave);
  window.removeEventListener('scroll', schedule);
  window.removeEventListener('resize', schedule);
  if (frame) cancelAnimationFrame(frame);
  frame = 0;
};

export function registerSpotlight(el: HTMLElement, options: SpotlightOptions = {}): () => void {
  if (!supported()) return () => {};

  const ring = document.createElement('span');
  ring.className = 'xp-spot-ring';
  ring.setAttribute('aria-hidden', 'true');
  el.appendChild(ring);

  const entry: Entry = {
    ...DEFAULTS,
    ...options,
    ring,
    spot: -1,
    mx: NaN,
    my: NaN,
  };
  el.style.setProperty('--xp-spot-spread', `${entry.spread}px`);
  REGISTRY.set(el, entry);
  bind();
  schedule();

  return () => {
    ring.remove();
    el.style.removeProperty('--xp-spot');
    el.style.removeProperty('--xp-spot-spread');
    REGISTRY.delete(el);
    if (REGISTRY.size === 0) unbind();
  };
}

export function registerSpotlights(els: Iterable<HTMLElement>, options: SpotlightOptions = {}): () => void {
  const undos = Array.from(els, (el) => registerSpotlight(el, options));
  return () => undos.forEach((undo) => undo());
}

export function useSpotlight<T extends HTMLElement>(options: SpotlightOptions = {}) {
  const optionsRef = React.useRef(options);
  React.useEffect(() => {
    optionsRef.current = options;
  }, [options]);
  const undo = React.useRef<(() => void) | null>(null);

  return React.useCallback((el: T | null) => {
    undo.current?.();
    undo.current = el ? registerSpotlight(el, optionsRef.current) : null;
  }, []);
}

export function SpotlightRegistrator({ selector = '[data-spotlight]' }: { selector?: string }) {
  React.useEffect(() => {
    const nodes = document.querySelectorAll<HTMLElement>(selector);
    return registerSpotlights(nodes, { reach: 300, spread: 340 });
  }, [selector]);
  return null;
}
