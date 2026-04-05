import { useCallback, useEffect, useState } from 'react';

export type Theme = 'light' | 'dark';
export const LIGHT: Theme = 'light';
export const DARK: Theme = 'dark';

const STORAGE_ITEM_KEY = 'theme';

function getInitialTheme(): Theme {
  return document.documentElement.classList.contains(DARK) ? DARK : LIGHT;
}

export function useTheme() {
  const [theme, setTheme] = useState<Theme>(getInitialTheme);

  useEffect(() => {
    document.documentElement.classList.toggle(DARK, theme === DARK);
    try {
      localStorage.setItem(STORAGE_ITEM_KEY, theme);
    } catch (e) {
      console.error('Failed to persist theme:', e);
    }
  }, [theme]);

  useEffect(() => {
    const mediaQuery = window.matchMedia(`(prefers-color-scheme: ${DARK})`);
    const handleChange = (e: MediaQueryListEvent) => {
      let saved: string | null = null;
      try {
        saved = localStorage.getItem(STORAGE_ITEM_KEY);
      } catch {
        //
      }
      if (!saved || (saved !== LIGHT && saved !== DARK)) {
        const newTheme: Theme = e.matches ? DARK : LIGHT;
        setTheme(newTheme);
      }
    };
    mediaQuery.addEventListener('change', handleChange);
    return () => mediaQuery.removeEventListener('change', handleChange);
  }, []);

  const toggleTheme = useCallback(() => {
    setTheme((prev) => (prev === LIGHT ? DARK : LIGHT));
  }, []);

  return { theme, toggleTheme };
}
