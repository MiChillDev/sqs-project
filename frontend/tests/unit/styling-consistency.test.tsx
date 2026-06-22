import { render, screen } from '@testing-library/react';
import type { ComponentType } from 'react';
import { rootRoute } from 'src/app/routes/__root';
import indexRoute from 'src/app/routes/index';
import jokePageRoute from 'src/app/routes/joke-page';
import { describe, expect, it, vi } from 'vitest';

vi.mock('@tanstack/react-router', async (importOriginal) => {
  const actual = await importOriginal<typeof import('@tanstack/react-router')>();
  return {
    ...actual,
    useNavigate: () => ({}),
    useSearch: () => ({}),
    useLocation: () => ({ pathname: '/' }),
    Outlet: () => null,
    Link: ({ children, ...props }: Record<string, unknown>) => (
      <a {...props}>{children as React.ReactNode}</a>
    ),
  };
});

vi.mock('src/shared/hooks/use-theme', () => ({
  useTheme: () => ({ theme: 'light' as const, toggleTheme: vi.fn() }),
}));

vi.mock('i18next', () => ({
  default: {
    t: (key: string) => key,
  },
}));

vi.mock('src/shared/api/hooks', () => ({
  useRandomJoke: () => ({
    data: undefined,
    refetch: vi.fn(),
    isSuccess: false,
    isError: false,
    isFetching: false,
  }),
}));

vi.mock('@tanstack/react-query', async (importOriginal) => {
  const actual = await importOriginal<typeof import('@tanstack/react-query')>();
  return {
    ...actual,
    useQueryClient: () => ({
      removeQueries: vi.fn(),
    }),
  };
});

vi.mock('src/shared/hooks/use-joke-counter', () => ({
  useJokeCounter: () => ({
    count: 0,
    showConfetti: false,
    increment: vi.fn(),
  }),
}));

function renderRouteComponent(route: unknown) {
  const Component = (route as { options: { component: ComponentType } }).options.component;
  return render(<Component />);
}

describe('Styling Consistency', () => {
  describe('Welcome Page (/)', () => {
    it('uses playful gradient background', () => {
      const { container } = renderRouteComponent(indexRoute);
      const rootDiv = container.firstElementChild;
      expect(rootDiv).toHaveClass('bg-linear-to-br', 'from-playful-bg-start', 'to-playful-bg-end');
    });

    it('renders welcome heading with playful heading color', () => {
      const { container } = renderRouteComponent(indexRoute);
      const h1 = container.querySelector('h1');
      expect(h1).toHaveClass('text-playful-heading');
      expect(h1).toHaveClass('font-heading');
      expect(h1).toHaveTextContent('Welcome!');
    });

    it('renders Go to Jokes button', () => {
      renderRouteComponent(indexRoute);
      expect(screen.getByText('Go to Jokes')).toBeInTheDocument();
    });
  });

  describe('Joke Page (/jokes)', () => {
    it('replaces hardcoded colors with playful tokens', () => {
      const { container } = renderRouteComponent(jokePageRoute);
      const rootDiv = container.firstElementChild;
      expect(rootDiv).toHaveClass('bg-linear-to-br', 'from-playful-bg-start', 'to-playful-bg-end');
      expect(rootDiv).toHaveClass('font-body');
    });

    it('uses playful heading color on title', () => {
      const { container } = renderRouteComponent(jokePageRoute);
      const h1 = container.querySelector('h1');
      expect(h1).toHaveClass('text-playful-heading');
    });
  });

  describe('Root Layout (Header)', () => {
    it('header uses playful background', () => {
      const { container } = renderRouteComponent(rootRoute);
      const header = container.querySelector('header');
      expect(header).toHaveClass('bg-playful-bg-start/80');
    });

    it('renders the hand-drawn SVG border line', () => {
      const { container } = renderRouteComponent(rootRoute);
      const svg = container.querySelector('header svg');
      expect(svg).toBeInTheDocument();
    });

    it('renders login button when no auth token exists', () => {
      vi.spyOn(Storage.prototype, 'getItem').mockReturnValue(null);
      renderRouteComponent(rootRoute);
      expect(screen.getByLabelText('Login')).toBeInTheDocument();
      vi.restoreAllMocks();
    });

    it('hides login button when auth token exists', () => {
      vi.spyOn(Storage.prototype, 'getItem').mockReturnValue(
        JSON.stringify({ token: 'abc', expiresAt: '2099-01-01T00:00:00' })
      );
      renderRouteComponent(rootRoute);
      expect(screen.getByLabelText('User menu')).toBeInTheDocument();
      expect(screen.queryByLabelText('Login')).not.toBeInTheDocument();
      vi.restoreAllMocks();
    });
  });
});
