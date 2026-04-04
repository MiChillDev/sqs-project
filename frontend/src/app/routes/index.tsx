import { createRoute } from '@tanstack/react-router';
import { rootRoute } from './__root';

const indexRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/',
  component: function IndexPage() {
    return (
      <div className="mx-auto max-w-[800px] p-8">
        <h1 className="text-2xl font-bold">SQS Frontend</h1>
        <p className="mt-4 text-muted-foreground">some paragraph</p>
      </div>
    );
  },
});

export default indexRoute;
