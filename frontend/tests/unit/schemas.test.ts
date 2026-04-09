import { describe, expect, it, vi } from 'vitest';
import { z } from 'zod';

function createContactSchema(t: (key: string) => string) {
  return z.object({
    name: z.string().min(2, { error: () => t('common.validation.nameMin') }),
    email: z.email({ error: () => t('common.validation.emailInvalid') }),
  });
}

function createTestSchema(t: (key: string) => string) {
  return z.object({
    name: z.string().min(2, { error: () => t('common.validation.nameMin') }),
    email: z.email({ error: () => t('common.validation.emailInvalid') }),
    message: z.string().min(10, { error: () => t('common.validation.messageMin') }),
  });
}

const mockT = vi.fn((key: string) => {
  const translations: Record<string, string> = {
    'common.validation.nameMin': 'Name must be at least 2 characters',
    'common.validation.emailInvalid': 'Please enter a valid email address',
    'common.validation.messageMin': 'Message must be at least 10 characters',
  };
  return translations[key] ?? key;
});

describe('contactSchema', () => {
  it('accepts valid data', () => {
    const schema = createContactSchema(mockT);
    const result = schema.safeParse({ name: 'John', email: 'john@example.com' });
    expect(result.success).toBe(true);
  });

  it('rejects name shorter than 2 characters', () => {
    const schema = createContactSchema(mockT);
    const result = schema.safeParse({ name: 'J', email: 'john@example.com' });
    expect(result.success).toBe(false);
    if (!result.success) {
      const errorMessages = result.error.issues.map((i) => i.message);
      expect(errorMessages).toContain('Name must be at least 2 characters');
    }
  });

  it('rejects empty name', () => {
    const schema = createContactSchema(mockT);
    const result = schema.safeParse({ name: '', email: 'john@example.com' });
    expect(result.success).toBe(false);
  });

  it('rejects invalid email', () => {
    const schema = createContactSchema(mockT);
    const result = schema.safeParse({ name: 'John', email: 'not-an-email' });
    expect(result.success).toBe(false);
    if (!result.success) {
      const errorMessages = result.error.issues.map((i) => i.message);
      expect(errorMessages).toContain('Please enter a valid email address');
    }
  });

  it('rejects missing fields', () => {
    const schema = createContactSchema(mockT);
    const result = schema.safeParse({});
    expect(result.success).toBe(false);
  });

  it('rejects empty email', () => {
    const schema = createContactSchema(mockT);
    const result = schema.safeParse({ name: 'John', email: '' });
    expect(result.success).toBe(false);
  });
});

describe('testSchema', () => {
  it('accepts valid data', () => {
    const schema = createTestSchema(mockT);
    const result = schema.safeParse({
      name: 'Jane',
      email: 'jane@example.com',
      message: 'Hello there!',
    });
    expect(result.success).toBe(true);
  });

  it('rejects name shorter than 2 characters', () => {
    const schema = createTestSchema(mockT);
    const result = schema.safeParse({
      name: 'J',
      email: 'jane@example.com',
      message: 'Hello there!',
    });
    expect(result.success).toBe(false);
  });

  it('rejects invalid email', () => {
    const schema = createTestSchema(mockT);
    const result = schema.safeParse({
      name: 'Jane',
      email: 'not-an-email',
      message: 'Hello there!',
    });
    expect(result.success).toBe(false);
  });

  it('rejects message shorter than 10 characters', () => {
    const schema = createTestSchema(mockT);
    const result = schema.safeParse({
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
    const schema = createTestSchema(mockT);
    const result = schema.safeParse({
      name: 'Jane',
      email: 'jane@example.com',
      message: '',
    });
    expect(result.success).toBe(false);
  });

  it('rejects missing fields', () => {
    const schema = createTestSchema(mockT);
    const result = schema.safeParse({});
    expect(result.success).toBe(false);
  });
});
