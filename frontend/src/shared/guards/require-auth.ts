import { redirect } from '@tanstack/react-router';
import { authStorage } from 'src/shared/lib/auth-storage';

export function requireAuth() {
  return ({ location }: { location: { pathname: string } }) => {
    if (!authStorage.get()) {
      throw redirect({
        to: '/login',
        search: { redirect: location.pathname },
      });
    }
  };
}
