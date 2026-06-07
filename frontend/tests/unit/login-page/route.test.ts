import loginRoute from 'src/app/routes/login';
import { describe, expect, it } from 'vitest';

describe('loginRoute validateSearch', () => {
  const validateSearch = loginRoute.options.validateSearch as (search: Record<string, unknown>) => {
    redirect: string | undefined;
  };

  it('returns the redirect string when valid', () => {
    expect(validateSearch({ redirect: '/admin' })).toEqual({ redirect: '/admin' });
  });

  it('returns undefined when redirect is missing', () => {
    expect(validateSearch({})).toEqual({ redirect: undefined });
  });

  it('returns undefined when redirect is not a string', () => {
    expect(validateSearch({ redirect: 123 })).toEqual({ redirect: undefined });
  });
});
