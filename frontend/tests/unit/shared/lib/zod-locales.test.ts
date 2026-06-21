import { beforeEach, describe, expect, it, vi } from 'vitest';

const { deMock, enMock } = vi.hoisted(() => ({
  deMock: vi.fn(() => ({ localeError: 'de-map' })),
  enMock: vi.fn(() => ({ localeError: 'en-map' })),
}));

vi.mock('zod/v4/locales', () => ({ de: deMock, en: enMock }));

import { getZodLocale } from 'src/shared/lib/zod-locales';

describe('getZodLocale', () => {
  beforeEach(() => vi.clearAllMocks());

  it.each([
    ['de', deMock],
    ['en', enMock],
  ] as const)('%s → calls %s factory', (lang, mock) => {
    expect(getZodLocale(lang)).toEqual({ localeError: `${lang}-map` });
    expect(mock).toHaveBeenCalledOnce();
  });

  it('unknown language → en fallback', () => {
    expect(getZodLocale('fr')).toEqual({ localeError: 'en-map' });
    expect(enMock).toHaveBeenCalledOnce();
  });
});
