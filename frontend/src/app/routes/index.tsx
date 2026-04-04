import { createRoute } from '@tanstack/react-router';
import { rootRoute } from './__root';

const indexRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/',
  component: function IndexPage() {
    return (
      <div style={{ padding: '2rem', maxWidth: '800px', margin: '0 auto' }}>
        <h1>SQS Frontend</h1>
        <p>some paragraph</p>
      </div>
    );
  },
});

export default indexRoute;
