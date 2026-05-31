import '@testing-library/jest-dom/vitest';
import { vi } from 'vitest';
import enTranslation from '../public/locales/en/translation.json';

const { mockNavigate, mockUseSearch } = vi.hoisted(() => ({
  mockNavigate: vi.fn(),
  mockUseSearch: vi.fn(() => ({})),
}));

(globalThis as Record<string, unknown>).__mockNavigate = mockNavigate;
(globalThis as Record<string, unknown>).__mockUseSearch = mockUseSearch;

vi.mock('@tanstack/react-router', async (importOriginal) => {
  const actual = await importOriginal<typeof import('@tanstack/react-router')>();
  return { ...actual, useNavigate: () => mockNavigate, useSearch: mockUseSearch };
});

function getTranslation(key: string, translations: Record<string, unknown>): string {
  const result = key.split('.').reduce<unknown>((obj, part) => {
    if (obj && typeof obj === 'object' && part in obj) {
      return (obj as Record<string, unknown>)[part];
    }
    return undefined;
  }, translations);
  return typeof result === 'string' ? result : key;
}

vi.mock('react-i18next', () => ({
  useTranslation: () => ({
    t: (key: string) => getTranslation(key, enTranslation),
    i18n: { language: 'en' },
  }),
}));

Object.defineProperty(window, 'matchMedia', {
  writable: true,
  value: (query: string) => ({
    matches: false,
    media: query,
    onchange: null,
    addListener: () => {},
    removeListener: () => {},
    addEventListener: () => {},
    removeEventListener: () => {},
    dispatchEvent: () => false,
  }),
});
