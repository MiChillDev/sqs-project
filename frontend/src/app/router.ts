import { createRouter } from '@tanstack/react-router';

import { rootRoute } from './routes/__root';
import adminRoute from './routes/admin';
import indexRoute from './routes/index';
import jokePageRoute from './routes/joke-page';
import loginRoute from './routes/login';

const routeTree = rootRoute.addChildren([indexRoute, jokePageRoute, loginRoute, adminRoute]);

export const router = createRouter({ routeTree });

declare module '@tanstack/react-router' {
  interface Register {
    router: typeof router;
  }
}
