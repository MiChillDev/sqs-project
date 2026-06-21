import { ApiError } from 'src/shared/api/api-error';
import { beforeEach, describe, expect, it, vi } from 'vitest';

const clearMock = vi.hoisted(() => vi.fn());
const navigateMock = vi.hoisted(() => vi.fn());

vi.mock('src/shared/lib/auth-storage', () => ({ authStorage: { clear: clearMock } }));
vi.mock('@tanstack/react-router', () => ({ useNavigate: () => navigateMock }));

import { handle401 } from 'src/shared/lib/handle-401';

describe('handle401', () => {
  beforeEach(() => vi.clearAllMocks());

  it('401: clears auth, navigates to /login, returns true', () => {
    const result = handle401(new ApiError(401, ''), navigateMock);
    expect(clearMock).toHaveBeenCalledOnce();
    expect(navigateMock).toHaveBeenCalledWith({ to: '/login', search: { redirect: '/admin' } });
    expect(result).toBe(true);
  });

  it('401 with custom redirect', () => {
    handle401(new ApiError(401, ''), navigateMock, '/dashboard');
    expect(navigateMock).toHaveBeenCalledWith({ to: '/login', search: { redirect: '/dashboard' } });
  });

  it.each([new ApiError(403, ''), new Error('fail'), 'string'])(
    'non-401: no side effects, returns false',
    (error) => {
      expect(handle401(error, navigateMock)).toBe(false);
      expect(clearMock).not.toHaveBeenCalled();
      expect(navigateMock).not.toHaveBeenCalled();
    },
  );
});
