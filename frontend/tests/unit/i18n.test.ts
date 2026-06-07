import { describe, expect, it, vi } from 'vitest';

const { useMock, initMock } = vi.hoisted(() => ({
  useMock: vi.fn().mockReturnThis(),
  initMock: vi.fn().mockResolvedValue(undefined),
}));

vi.mock('i18next', () => ({
  default: { use: useMock, init: initMock },
}));

vi.mock('i18next-browser-languagedetector', () => ({ default: {} }));
vi.mock('i18next-http-backend', () => ({ default: {} }));
vi.mock('react-i18next', () => ({ initReactI18next: {} }));

describe('initI18n', () => {
  it('configures i18next with expected plugins and options', async () => {
    vi.stubEnv('DEV', false);

    const { initI18n } = await import('src/shared/lib/i18n');
    await initI18n();

    expect(useMock).toHaveBeenCalled();
    expect(initMock).toHaveBeenCalledWith(
      expect.objectContaining({
        fallbackLng: 'en',
        supportedLngs: ['en', 'de'],
      })
    );
    expect(initMock).toHaveBeenCalledWith(
      expect.objectContaining({
        debug: false,
      })
    );
  });
});
