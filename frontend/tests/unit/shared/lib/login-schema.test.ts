import type { LoginFormValues } from 'src/shared/lib/login-schema';
import { loginSchema } from 'src/shared/lib/login-schema';
import { describe, expect, it } from 'vitest';

describe('loginSchema', () => {
  it('fails validation when username is empty', () => {
    const result = loginSchema.safeParse({ username: '', password: 'secret' });

    expect(result.success).toBe(false);
  });

  it('fails validation when password is empty', () => {
    const result = loginSchema.safeParse({ username: 'alice', password: '' });

    expect(result.success).toBe(false);
  });

  it('passes validation with whitespace-only username (min(1) does not strip)', () => {
    const result = loginSchema.safeParse({ username: '   ', password: 'secret' });

    expect(result.success).toBe(true);
  });

  it('passes validation with whitespace-only password (min(1) does not strip)', () => {
    const result = loginSchema.safeParse({ username: 'alice', password: '\t\n  ' });

    expect(result.success).toBe(true);
  });

  it('fails validation when username exceeds 255 characters', () => {
    const result = loginSchema.safeParse({ username: 'a'.repeat(256), password: 'secret' });

    expect(result.success).toBe(false);
  });

  it('fails validation when password exceeds 255 characters', () => {
    const result = loginSchema.safeParse({ username: 'alice', password: 'b'.repeat(256) });

    expect(result.success).toBe(false);
  });

  it('passes validation with valid username and password', () => {
    const result = loginSchema.safeParse({ username: 'alice', password: 'secret' });

    expect(result.success).toBe(true);
    if (result.success) {
      const data: LoginFormValues = result.data;
      expect(data.username).toBe('alice');
      expect(data.password).toBe('secret');
    }
  });

  it('passes validation with username at max length boundary', () => {
    const result = loginSchema.safeParse({ username: 'a'.repeat(255), password: 'secret' });

    expect(result.success).toBe(true);
  });

  it('passes validation with password at max length boundary', () => {
    const result = loginSchema.safeParse({ username: 'alice', password: 'b'.repeat(255) });

    expect(result.success).toBe(true);
  });
});
