import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { UserMenu } from 'src/shared/components/user-menu';
import { authStorage } from 'src/shared/lib/auth-storage';
import { beforeEach, describe, expect, it, vi } from 'vitest';

const mockNavigate = vi.fn();

vi.mock('@tanstack/react-router', async (importOriginal) => {
  const actual = await importOriginal<typeof import('@tanstack/react-router')>();
  return {
    ...actual,
    useNavigate: () => mockNavigate,
    useSearch: () => ({}),
    useLocation: () => ({}),
  };
});

vi.mock('react-i18next', () => ({
  useTranslation: () => ({
    t: (key: string) => {
      const translations: Record<string, string> = {
        'header.login': 'Login',
        'admin.logout': 'Logout',
      };
      return translations[key] ?? key;
    },
    i18n: { language: 'en' },
  }),
}));

beforeEach(() => {
  localStorage.clear();
  mockNavigate.mockClear();
});

describe('UserMenu', () => {
  it('renders login button when no token is stored', () => {
    render(<UserMenu />);
    expect(screen.getByRole('button', { name: 'Login' })).toBeInTheDocument();
  });

  it('renders the user menu button when token is stored', () => {
    authStorage.set({ token: 'test-token', expiresAt: '2099-01-01T00:00:00' });

    render(<UserMenu />);

    expect(screen.getByRole('button', { name: 'User menu' })).toBeInTheDocument();
  });

  it('clicking logout clears the token and navigates to login', async () => {
    const user = userEvent.setup();
    authStorage.set({ token: 'test-token', expiresAt: '2099-01-01T00:00:00' });

    render(<UserMenu />);

    await user.click(screen.getByRole('button', { name: 'User menu' }));
    await user.click(screen.getByText('Logout'));

    expect(authStorage.get()).toBeNull();
    expect(mockNavigate).toHaveBeenCalledWith({ to: '/login', search: { redirect: undefined } });
  });
});
