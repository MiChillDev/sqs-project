import type { useNavigate } from '@tanstack/react-router';
import { authStorage } from 'src/shared/lib/auth-storage';
import { is401 } from 'src/shared/lib/error-classifier';

export function handle401(
  error: unknown,
  navigate: ReturnType<typeof useNavigate>,
  redirectPath = '/admin'
): boolean {
  if (is401(error)) {
    authStorage.clear();
    navigate({ to: '/login', search: { redirect: redirectPath } });
    return true;
  }
  return false;
}
