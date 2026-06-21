import { zodResolver } from '@hookform/resolvers/zod';
import { renderHook } from '@testing-library/react';
import { useZodResolver } from 'src/shared/hooks/use-zod-resolver';
import { getZodLocale } from 'src/shared/lib/zod-locales';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { z } from 'zod';

const testSchema = z.object({ name: z.string().min(1) });
let mockLanguage = 'en';

vi.mock('react-i18next', () => ({ useTranslation: () => ({ i18n: { language: mockLanguage } }) }));
vi.mock('src/shared/lib/zod-locales', () => ({
  getZodLocale: vi.fn((lang: string) => ({ localeError: vi.fn(() => ({ message: () => `err-${lang}` })) })),
}));
vi.mock('@hookform/resolvers/zod', () => ({ zodResolver: vi.fn(() => vi.fn()) }));

describe('useZodResolver', () => {
  beforeEach(() => {
    mockLanguage = 'en';
    vi.clearAllMocks();
  });

  it('returns resolver from zodResolver', () => {
    const { result } = renderHook(() => useZodResolver(testSchema));
    expect(result.current).toBeInstanceOf(Function);
  });

  it('passes current language to getZodLocale', () => {
    mockLanguage = 'de';
    renderHook(() => useZodResolver(testSchema));
    expect(vi.mocked(getZodLocale)).toHaveBeenCalledWith('de');
  });

  it('re-memoizes on language change', () => {
    const { result, rerender } = renderHook(() => useZodResolver(testSchema));
    const first = result.current;
    mockLanguage = 'de';
    rerender();
    expect(result.current).not.toBe(first);
    expect(vi.mocked(zodResolver)).toHaveBeenCalledTimes(2);
  });
});
