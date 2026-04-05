/// <reference types="vitest/globals" />

import { act, renderHook } from '@testing-library/react';

import { useTheme } from '@/shared/hooks/use-theme';

class MockMediaQueryList {
  matches = false;
  media = '(prefers-color-scheme: dark)';
  onchange = null;
  status: 'current' | 'done' | 'pending' = 'current';

  private listeners: ((e: { matches: boolean }) => void)[] = [];

  addEventListener(type: string, listener: (e: { matches: boolean }) => void) {
    if (type === 'change') {
      this.listeners.push(listener);
    }
  }

  removeEventListener(type: string, listener: (e: { matches: boolean }) => void) {
    if (type === 'change') {
      this.listeners = this.listeners.filter((l) => l !== listener);
    }
  }

  dispatchEvent(_e: Event) {
    return true;
  }

  fireChange(matches: boolean) {
    this.matches = matches;
    for (const listener of this.listeners) {
      listener({ matches } as MediaQueryListEvent);
    }
  }

  addListener() {}
  removeListener() {}
}

let mockMql: MockMediaQueryList;
let classListContainsSpy: ReturnType<typeof vi.spyOn>;
let classListToggleSpy: ReturnType<typeof vi.spyOn>;
let localStorageGetItemSpy: ReturnType<typeof vi.spyOn>;
let localStorageSetItemSpy: ReturnType<typeof vi.spyOn>;
let consoleErrorSpy: ReturnType<typeof vi.spyOn>;

beforeEach(() => {
  document.documentElement.className = '';
  document.documentElement.classList.add('not-dark');

  mockMql = new MockMediaQueryList();
  window.matchMedia = (_query: string) => mockMql as unknown as MediaQueryList;

  classListContainsSpy = vi.spyOn(document.documentElement.classList, 'contains');
  classListToggleSpy = vi.spyOn(document.documentElement.classList, 'toggle');

  localStorageGetItemSpy = vi.spyOn(Storage.prototype, 'getItem');
  localStorageSetItemSpy = vi.spyOn(Storage.prototype, 'setItem');

  localStorageGetItemSpy.mockReturnValue(null);

  consoleErrorSpy = vi.spyOn(console, 'error').mockImplementation(() => {});
});

afterEach(() => {
  vi.restoreAllMocks();
});

describe('useTheme', () => {
  describe('initial state from DOM', () => {
    it('returns light when document has no dark class', () => {
      classListContainsSpy.mockReturnValue(false);

      const { result } = renderHook(() => useTheme());

      expect(result.current.theme).toBe('light');
    });

    it('returns dark when document has dark class', () => {
      classListContainsSpy.mockReturnValue(true);

      const { result } = renderHook(() => useTheme());

      expect(result.current.theme).toBe('dark');
    });
  });

  describe('toggleTheme', () => {
    it('toggles from light to dark and updates DOM and localStorage', () => {
      classListContainsSpy.mockReturnValue(false);

      const { result } = renderHook(() => useTheme());

      expect(result.current.theme).toBe('light');

      act(() => {
        result.current.toggleTheme();
      });

      expect(result.current.theme).toBe('dark');
      expect(classListToggleSpy).toHaveBeenCalledWith('dark', true);
      expect(localStorageSetItemSpy).toHaveBeenCalledWith('theme', 'dark');
    });

    it('toggles from dark to light and updates DOM and localStorage', () => {
      classListContainsSpy.mockReturnValue(true);

      const { result } = renderHook(() => useTheme());

      expect(result.current.theme).toBe('dark');

      act(() => {
        result.current.toggleTheme();
      });

      expect(result.current.theme).toBe('light');
      expect(classListToggleSpy).toHaveBeenCalledWith('dark', false);
      expect(localStorageSetItemSpy).toHaveBeenCalledWith('theme', 'light');
    });

    it('still toggles DOM when localStorage.setItem throws', () => {
      classListContainsSpy.mockReturnValue(false);
      localStorageSetItemSpy.mockImplementation(() => {
        throw new DOMException('Blocked', 'SecurityError');
      });

      const { result } = renderHook(() => useTheme());

      act(() => {
        result.current.toggleTheme();
      });

      expect(result.current.theme).toBe('dark');
      expect(classListToggleSpy).toHaveBeenCalledWith('dark', true);
      expect(consoleErrorSpy).toHaveBeenCalledWith(
        'Failed to persist theme:',
        expect.any(DOMException),
      );
    });
  });

  describe('toggleTheme stability', () => {
    it('has stable reference across re-renders', () => {
      classListContainsSpy.mockReturnValue(false);

      const { result, rerender } = renderHook(() => useTheme());
      const { toggleTheme } = result.current;

      rerender();

      expect(toggleTheme).toBe(result.current.toggleTheme);
    });
  });

  describe('system preference listener', () => {
    it('updates theme when system preference changes and no stored preference', () => {
      classListContainsSpy.mockReturnValue(false);
      localStorageGetItemSpy.mockReturnValue(null);

      renderHook(() => useTheme());

      act(() => {
        mockMql.fireChange(true);
      });

      expect(classListToggleSpy).toHaveBeenCalledWith('dark', true);
    });

    it('ignores system preference change when stored preference exists', () => {
      classListContainsSpy.mockReturnValue(false);
      localStorageGetItemSpy.mockReturnValue('light');

      const { result } = renderHook(() => useTheme());

      const themeBefore = result.current.theme;

      act(() => {
        mockMql.fireChange(true);
      });

      expect(result.current.theme).toBe(themeBefore);
    });

    it('updates theme when localStorage.getItem throws', () => {
      classListContainsSpy.mockReturnValue(false);
      localStorageGetItemSpy.mockImplementation(() => {
        throw new DOMException('Blocked', 'SecurityError');
      });

      const { result } = renderHook(() => useTheme());

      act(() => {
        mockMql.fireChange(true);
      });

      expect(result.current.theme).toBe('dark');
      expect(classListToggleSpy).toHaveBeenCalledWith('dark', true);
    });
  });
});
