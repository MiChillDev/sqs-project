import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { authStorage } from '../../src/shared/lib/auth-storage';

const KEY = 'sqs.auth';

describe('authStorage.subscribe', () => {
  beforeEach(() => {
    localStorage.clear();
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  it('registers a storage event listener on globalThis', () => {
    const addSpy = vi.spyOn(globalThis, 'addEventListener');
    const handler = vi.fn();

    authStorage.subscribe(handler);

    expect(addSpy).toHaveBeenCalledWith('storage', expect.any(Function));
  });

  it('calls handler with current value when storage event matches KEY', () => {
    const handler = vi.fn();
    authStorage.set({ token: 'tok', expiresAt: '2099-01-01T00:00:00' });

    authStorage.subscribe(handler);
    window.dispatchEvent(new StorageEvent('storage', { key: KEY }));

    expect(handler).toHaveBeenCalledWith({ token: 'tok', expiresAt: '2099-01-01T00:00:00' });
  });

  it('does NOT call handler for unrelated keys', () => {
    const handler = vi.fn();

    authStorage.subscribe(handler);
    window.dispatchEvent(new StorageEvent('storage', { key: 'other.key' }));

    expect(handler).not.toHaveBeenCalled();
  });

  it('calls handler when key is null (clear-all signal)', () => {
    const handler = vi.fn();

    authStorage.subscribe(handler);
    window.dispatchEvent(new StorageEvent('storage', { key: null }));

    expect(handler).toHaveBeenCalledWith(null);
  });

  it('returned unsubscribe function removes the listener', () => {
    const removeSpy = vi.spyOn(globalThis, 'removeEventListener');
    const handler = vi.fn();

    const unsubscribe = authStorage.subscribe(handler);
    unsubscribe();

    expect(removeSpy).toHaveBeenCalledWith('storage', expect.any(Function));

    window.dispatchEvent(new StorageEvent('storage', { key: KEY }));
    expect(handler).not.toHaveBeenCalled();
  });
});
