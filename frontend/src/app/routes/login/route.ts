import { createRoute } from '@tanstack/react-router';
import { rootRoute } from '../__root';
import { LoginPage } from './login-page';

export const loginRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/login',
  validateSearch: (search: Record<string, unknown>) => ({
    redirect: typeof search.redirect === 'string' ? search.redirect : undefined,
  }),
  component: LoginPage,
});

export default loginRoute;
