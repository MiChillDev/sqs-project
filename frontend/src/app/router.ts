import { createRouter } from '@tanstack/react-router';

import { rootRoute } from './routes/__root';
import demoApiRoute from './routes/demo-api';
import componentTestRoute from './routes/component-demo';
import indexRoute from './routes/index';
import referenceRoute from './routes/reference';

const routeTree = rootRoute.addChildren([
  indexRoute,
  componentTestRoute,
  referenceRoute,
  demoApiRoute,
]);

export const router = createRouter({ routeTree });

declare module '@tanstack/react-router' {
  interface Register {
    router: typeof router;
  }
}
