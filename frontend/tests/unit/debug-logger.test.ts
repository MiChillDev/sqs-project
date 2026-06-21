import { debugLogger } from 'src/shared/lib/debug-logger';
import { afterEach, describe, expect, it, vi } from 'vitest';

describe('debugLogger', () => {
  afterEach(() => {
    vi.clearAllMocks();
  });

  it.each([
    ['error', console, 'error'] as const,
    ['warn', console, 'warn'] as const,
    ['info', console, 'info'] as const,
    ['debug', console, 'debug'] as const,
  ])('forwards calls to console.%s', (_label, target, method) => {
    const spy = vi.spyOn(target, method).mockImplementation(() => {});
    const args = { detail: 42 };

    debugLogger[method]('msg', args);
    expect(spy).toHaveBeenCalledWith('msg', args);
  });

  it('handles calls with only a message (no extra args)', () => {
    const spy = vi.spyOn(console, 'error').mockImplementation(() => {});
    debugLogger.error('simple');
    expect(spy).toHaveBeenCalledWith('simple');
  });
});
