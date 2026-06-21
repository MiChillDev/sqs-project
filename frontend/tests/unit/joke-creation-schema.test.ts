import { describe, expect, it } from 'vitest';
import type { JokeCreationFormValues } from '../../src/shared/lib/joke-creation-schema';
import { jokeCreationSchema } from '../../src/shared/lib/joke-creation-schema';

describe('jokeCreationSchema', () => {
  it('fails when content is empty', () => {
    const result = jokeCreationSchema.safeParse({ content: '' });

    expect(result.success).toBe(false);
  });

  it('passes with whitespace-only content (min(1) does not strip)', () => {
    const result = jokeCreationSchema.safeParse({ content: '   ' });

    expect(result.success).toBe(true);
  });

  it('fails when content exceeds 1000 chars', () => {
    const result = jokeCreationSchema.safeParse({ content: 'a'.repeat(1001) });

    expect(result.success).toBe(false);
  });

  it('passes with content at max length (1000)', () => {
    const result = jokeCreationSchema.safeParse({ content: 'a'.repeat(1000) });

    expect(result.success).toBe(true);
  });

  it('passes when externalId is omitted entirely', () => {
    const result = jokeCreationSchema.safeParse({ content: 'hello' });

    expect(result.success).toBe(true);
  });

  it('passes with empty externalId', () => {
    const result = jokeCreationSchema.safeParse({ content: 'hello', externalId: '' });

    expect(result.success).toBe(true);
  });

  it('passes with whitespace-only externalId', () => {
    const result = jokeCreationSchema.safeParse({ content: 'hello', externalId: '   ' });

    expect(result.success).toBe(true);
  });

  it('passes with valid content and externalId', () => {
    const result = jokeCreationSchema.safeParse({ content: 'A joke', externalId: 'ext-1' });

    expect(result.success).toBe(true);
    if (result.success) {
      const data: JokeCreationFormValues = result.data;
      expect(data.content).toBe('A joke');
      expect(data.externalId).toBe('ext-1');
    }
  });

  it('passes with valid content only (no externalId)', () => {
    const result = jokeCreationSchema.safeParse({ content: 'A joke' });

    expect(result.success).toBe(true);
    if (result.success) {
      const data: JokeCreationFormValues = result.data;
      expect(data.content).toBe('A joke');
    }
  });
});
