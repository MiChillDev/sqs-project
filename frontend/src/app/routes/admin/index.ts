import { createRoute } from '@tanstack/react-router';
import { requireAuth } from 'src/shared/guards/require-auth';
import { rootRoute } from '../__root';
import { AdminPage } from './admin-page';

export const adminRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/admin',
  beforeLoad: requireAuth(),
  component: AdminPage,
});

export default adminRoute;
