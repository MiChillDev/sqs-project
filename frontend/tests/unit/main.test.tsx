import { afterEach, beforeAll, describe, expect, it, vi } from 'vitest';

const { mockCreateRoot, mockRender, mockInitI18n, mockDebugLoggerError } = vi.hoisted(() => ({
  mockRender: vi.fn(),
  mockCreateRoot: vi.fn(() => ({ render: mockRender })),
  mockInitI18n: vi.fn(),
  mockDebugLoggerError: vi.fn(),
}));

vi.mock('react-dom/client', () => ({
  createRoot: mockCreateRoot,
}));

vi.mock('src/shared/lib/i18n', () => ({
  initI18n: mockInitI18n,
}));

vi.mock('src/shared/lib/debug-logger', () => ({
  debugLogger: { error: mockDebugLoggerError },
}));

describe('main.tsx entry point', () => {
  beforeAll(() => {
    document.body.innerHTML = '<div id="root"></div>';
  });

  afterEach(() => {
    vi.clearAllMocks();
    vi.resetModules();
  });

  it('calls renderApp after initI18n resolves', async () => {
    mockInitI18n.mockResolvedValue(undefined);

    await import('../../src/main');

    expect(mockInitI18n).toHaveBeenCalledOnce();
    expect(mockCreateRoot).toHaveBeenCalledOnce();
    expect(mockRender).toHaveBeenCalledOnce();
  }, 15000);

  it('logs error and still renders when initI18n rejects', async () => {
    const error = new Error('i18n failed');
    mockInitI18n.mockRejectedValue(error);

    await import('../../src/main');

    expect(mockInitI18n).toHaveBeenCalledOnce();
    expect(mockDebugLoggerError).toHaveBeenCalledWith('i18n initialization failed:', error);
    expect(mockCreateRoot).toHaveBeenCalledOnce();
    expect(mockRender).toHaveBeenCalledOnce();
  }, 15000);
});
