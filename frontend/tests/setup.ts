import '@testing-library/jest-dom/vitest';
import { vi } from 'vitest';
import { getTranslation } from './unit/translation-helper';

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

vi.mock('react-i18next', () => ({
  useTranslation: () => ({
    t: (key: string) => getTranslation(key),
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
