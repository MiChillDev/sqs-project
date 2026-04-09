import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';

import { debugLogger } from '@/shared/lib/debug-logger';

describe('debugLogger', () => {
  let errorSpy: ReturnType<typeof vi.spyOn>;
  let warnSpy: ReturnType<typeof vi.spyOn>;
  let infoSpy: ReturnType<typeof vi.spyOn>;
  let debugSpy: ReturnType<typeof vi.spyOn>;

  beforeEach(() => {
    errorSpy = vi.spyOn(console, 'error').mockImplementation(() => {});
    warnSpy = vi.spyOn(console, 'warn').mockImplementation(() => {});
    infoSpy = vi.spyOn(console, 'info').mockImplementation(() => {});
    debugSpy = vi.spyOn(console, 'debug').mockImplementation(() => {});
  });

  afterEach(() => {
    errorSpy.mockRestore();
    warnSpy.mockRestore();
    infoSpy.mockRestore();
    debugSpy.mockRestore();
  });

  it('error() works without throwing', () => {
    expect(() => debugLogger.error('msg', { code: 500 })).not.toThrow();
    expect(errorSpy).toHaveBeenCalledWith('msg', { code: 500 });
  });

  it('warn() works without throwing', () => {
    expect(() => debugLogger.warn('msg', { field: 'name' })).not.toThrow();
    expect(warnSpy).toHaveBeenCalledWith('msg', { field: 'name' });
  });

  it('info() works without throwing', () => {
    expect(() => debugLogger.info('msg', { userId: 1 })).not.toThrow();
    expect(infoSpy).toHaveBeenCalledWith('msg', { userId: 1 });
  });

  it('debug() works without throwing', () => {
    expect(() => debugLogger.debug('msg', { trace: 'abc' })).not.toThrow();
    expect(debugSpy).toHaveBeenCalledWith('msg', { trace: 'abc' });
  });
});
