/// <reference types="vitest/globals" />

import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { type AuthStorageValue, authStorage } from '../../src/shared/lib/auth-storage';

const KEY = 'sqs.auth';

describe('authStorage', () => {
  beforeEach(() => {
    localStorage.clear();
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  describe('get', () => {
    it('returns null when key is missing', () => {
      expect(authStorage.get()).toBeNull();
    });

    it('returns null and clears the key when JSON is malformed', () => {
      localStorage.setItem(KEY, 'not-valid-json');

      const result = authStorage.get();

      expect(result).toBeNull();
      expect(localStorage.getItem(KEY)).toBeNull();
    });

    it('returns null and clears the key when token field is missing', () => {
      localStorage.setItem(KEY, JSON.stringify({ expiresAt: '2026-06-01T00:00:00' }));

      const result = authStorage.get();

      expect(result).toBeNull();
      expect(localStorage.getItem(KEY)).toBeNull();
    });

    it('returns null and clears the key when token field is not a string', () => {
      localStorage.setItem(KEY, JSON.stringify({ token: 12345, expiresAt: '2026-06-01T00:00:00' }));

      const result = authStorage.get();

      expect(result).toBeNull();
      expect(localStorage.getItem(KEY)).toBeNull();
    });

    it('returns null and clears the key when expiresAt field is missing', () => {
      localStorage.setItem(KEY, JSON.stringify({ token: 'test-token' }));

      const result = authStorage.get();

      expect(result).toBeNull();
      expect(localStorage.getItem(KEY)).toBeNull();
    });

    it('returns null and clears the key when expiresAt field is not a string', () => {
      localStorage.setItem(KEY, JSON.stringify({ token: 'test-token', expiresAt: 12345 }));

      const result = authStorage.get();

      expect(result).toBeNull();
      expect(localStorage.getItem(KEY)).toBeNull();
    });

    it('returns null and clears the key when expiresAt is in the past', () => {
      vi.useFakeTimers();
      vi.setSystemTime(new Date('2026-01-01T00:00:00Z'));

      const expiredValue: AuthStorageValue = {
        token: 'test-token',
        expiresAt: '2025-12-31T00:00:00',
      };
      localStorage.setItem(KEY, JSON.stringify(expiredValue));

      const result = authStorage.get();

      expect(result).toBeNull();
      expect(localStorage.getItem(KEY)).toBeNull();
    });

    it('returns the value when valid and not expired', () => {
      vi.useFakeTimers();
      vi.setSystemTime(new Date('2026-01-01T00:00:00Z'));

      const validValue: AuthStorageValue = {
        token: 'test-token',
        expiresAt: '2026-06-01T00:00:00',
      };
      localStorage.setItem(KEY, JSON.stringify(validValue));

      const result = authStorage.get();

      expect(result).toEqual(validValue);
    });
  });

  describe('set', () => {
    it('stores stringified JSON under key sqs.auth', () => {
      const value: AuthStorageValue = {
        token: 'test-token',
        expiresAt: '2026-06-01T00:00:00',
      };

      authStorage.set(value);

      const stored = localStorage.getItem(KEY);
      expect(stored).not.toBeNull();
      expect(JSON.parse(stored as string)).toEqual(value);
    });
  });

  describe('clear', () => {
    it('removes the key', () => {
      localStorage.setItem(
        KEY,
        JSON.stringify({ token: 'test', expiresAt: '2026-06-01T00:00:00' })
      );

      authStorage.clear();

      expect(localStorage.getItem(KEY)).toBeNull();
    });
  });
});
