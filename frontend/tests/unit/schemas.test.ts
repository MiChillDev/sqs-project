import { describe, expect, it } from 'vitest';

import { testSchema } from '@/app/routes/component-test';
import { contactSchema } from '@/app/routes/reference';

describe('contactSchema', () => {
  it('accepts valid data', () => {
    const result = contactSchema.safeParse({ name: 'John', email: 'john@example.com' });
    expect(result.success).toBe(true);
  });

  it('rejects name shorter than 2 characters', () => {
    const result = contactSchema.safeParse({ name: 'J', email: 'john@example.com' });
    expect(result.success).toBe(false);
    if (!result.success) {
      const errorMessages = result.error.issues.map((i) => i.message);
      expect(errorMessages).toContain('Name must be at least 2 characters');
    }
  });

  it('rejects empty name', () => {
    const result = contactSchema.safeParse({ name: '', email: 'john@example.com' });
    expect(result.success).toBe(false);
  });

  it('rejects invalid email', () => {
    const result = contactSchema.safeParse({ name: 'John', email: 'not-an-email' });
    expect(result.success).toBe(false);
    if (!result.success) {
      const errorMessages = result.error.issues.map((i) => i.message);
      expect(errorMessages).toContain('Please enter a valid email address');
    }
  });

  it('rejects missing fields', () => {
    const result = contactSchema.safeParse({});
    expect(result.success).toBe(false);
  });

  it('rejects empty email', () => {
    const result = contactSchema.safeParse({ name: 'John', email: '' });
    expect(result.success).toBe(false);
  });
});

describe('testSchema', () => {
  it('accepts valid data', () => {
    const result = testSchema.safeParse({
      name: 'Jane',
      email: 'jane@example.com',
      message: 'Hello there!',
    });
    expect(result.success).toBe(true);
  });

  it('rejects name shorter than 2 characters', () => {
    const result = testSchema.safeParse({
      name: 'J',
      email: 'jane@example.com',
      message: 'Hello there!',
    });
    expect(result.success).toBe(false);
  });

  it('rejects invalid email', () => {
    const result = testSchema.safeParse({
      name: 'Jane',
      email: 'not-an-email',
      message: 'Hello there!',
    });
    expect(result.success).toBe(false);
  });

  it('rejects message shorter than 10 characters', () => {
    const result = testSchema.safeParse({
      name: 'Jane',
      email: 'jane@example.com',
      message: 'Hi',
    });
    expect(result.success).toBe(false);
    if (!result.success) {
      const errorMessages = result.error.issues.map((i) => i.message);
      expect(errorMessages).toContain('Message must be at least 10 characters');
    }
  });

  it('rejects empty message', () => {
    const result = testSchema.safeParse({
      name: 'Jane',
      email: 'jane@example.com',
      message: '',
    });
    expect(result.success).toBe(false);
  });

  it('rejects missing fields', () => {
    const result = testSchema.safeParse({});
    expect(result.success).toBe(false);
  });
});
