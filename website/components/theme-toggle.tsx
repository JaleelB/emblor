'use client';

import { Moon, Sun } from 'lucide-react';
import { useEffect, useSyncExternalStore } from 'react';
import { Button } from '@/components/ui/button';

type Theme = 'light' | 'dark';

function readTheme(): Theme {
  if (typeof window === 'undefined') return 'dark';
  const stored = window.localStorage.getItem('emblor-theme');
  if (stored === 'dark' || stored === 'light') return stored;
  return 'dark';
}

function applyTheme(theme: Theme) {
  document.documentElement.classList.toggle('dark', theme === 'dark');
  document.documentElement.classList.toggle('light', theme === 'light');
  document.documentElement.style.colorScheme = theme;
  window.localStorage.setItem('emblor-theme', theme);
  themeListeners.forEach((listener) => listener());
}

const themeListeners = new Set<() => void>();

function subscribe(listener: () => void) {
  themeListeners.add(listener);
  const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
  const handleStorage = (event: StorageEvent) => {
    if (event.key === 'emblor-theme') listener();
  };
  const handleMediaChange = () => {
    if (!window.localStorage.getItem('emblor-theme')) listener();
  };
  window.addEventListener('storage', handleStorage);
  mediaQuery.addEventListener('change', handleMediaChange);
  return () => {
    themeListeners.delete(listener);
    window.removeEventListener('storage', handleStorage);
    mediaQuery.removeEventListener('change', handleMediaChange);
  };
}

export function ThemeToggle() {
  const theme = useSyncExternalStore(subscribe, readTheme, (): Theme => 'dark');

  useEffect(() => {
    applyTheme(theme);
  }, [theme]);

  const nextTheme = theme === 'dark' ? 'light' : 'dark';

  return (
    <Button
      variant="ghost"
      size="icon"
      className="size-8 rounded-full border border-border/60 hover:bg-muted"
      type="button"
      aria-label={`Switch to ${nextTheme} theme`}
      onClick={() => {
        applyTheme(nextTheme);
      }}
    >
      {theme === 'dark' ? (
        <Sun className="size-4" aria-hidden="true" />
      ) : (
        <Moon className="size-4" aria-hidden="true" />
      )}
      <span className="sr-only">Switch to {nextTheme} theme</span>
    </Button>
  );
}
