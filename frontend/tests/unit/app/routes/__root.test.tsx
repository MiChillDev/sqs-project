import { render, screen } from '@testing-library/react';
import type { ComponentType } from 'react';
import { rootRoute } from 'src/app/routes/__root';
import { describe, expect, it, vi } from 'vitest';
import { getTranslation } from '../../translation-helper';

let currentPathname = '/';

vi.mock('@tanstack/react-router', async (importOriginal) => {
  const actual = await importOriginal<typeof import('@tanstack/react-router')>();
  return {
    ...actual,
    useNavigate: () => ({}),
    useSearch: () => ({}),
    useLocation: () => ({ pathname: currentPathname }),
    Outlet: () => null,
    Link: ({ children, ...props }: Record<string, unknown>) => (
      <a {...props}>{children as React.ReactNode}</a>
    ),
  };
});

vi.mock('src/shared/hooks/use-theme', () => ({
  useTheme: () => ({ theme: 'light' as const, toggleTheme: vi.fn() }),
}));

vi.mock('src/shared/components/user-menu', () => ({
  UserMenu: () => null,
}));

vi.mock('i18next', () => ({
  default: {
    t: (key: string) => key,
  },
}));

function renderRoute(option: 'component' | 'errorComponent' | 'notFoundComponent') {
  const Component = rootRoute.options[option] as ComponentType;
  return render(<Component />);
}

function renderErrorRoute(error: unknown) {
  const Component = rootRoute.options.errorComponent as ComponentType<{ error: unknown }>;
  return render(<Component error={error} />);
}

describe('RootComponent', () => {
  it('renders the header with app title as h1 on home page', () => {
    currentPathname = '/';
    renderRoute('component');
    expect(screen.getByRole('heading', { level: 1 })).toHaveTextContent('Chuck Norris Jokes');
  });

  it('renders the header with app title as link on non-home page', () => {
    currentPathname = '/jokes';
    renderRoute('component');
    const link = screen.getByText('Chuck Norris Jokes');
    expect(link.closest('a')).toHaveAttribute('to', '/');
  });

  it('renders skip-to-content link', () => {
    currentPathname = '/';
    renderRoute('component');
    const link = screen.getByRole('link');
    expect(link).toHaveAttribute('href', '#main-content');
    expect(link).toHaveTextContent(getTranslation('a11y.skipToContent'));
  });

  it('renders main content area', () => {
    currentPathname = '/';
    renderRoute('component');
    expect(screen.getByRole('main')).toBeInTheDocument();
  });
});

describe('ErrorComponent', () => {
  it('renders error title', () => {
    renderErrorRoute(new Error('test error'));
    expect(screen.getByRole('heading', { level: 1 })).toHaveTextContent(
      getTranslation('error.title')
    );
  });

  it('renders safe error message from getUserSafeError for generic Error', () => {
    renderErrorRoute(new Error('some failure'));
    expect(screen.getByText('toast.unknownError')).toBeInTheDocument();
  });
});

describe('NotFoundComponent', () => {
  it('renders 404 title', () => {
    renderRoute('notFoundComponent');
    expect(screen.getByRole('heading', { level: 1 })).toHaveTextContent(
      getTranslation('notFound.title')
    );
  });

  it('renders 404 description', () => {
    renderRoute('notFoundComponent');
    expect(screen.getByText(getTranslation('notFound.description'))).toBeInTheDocument();
  });
});
