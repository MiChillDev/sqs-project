import { render } from '@testing-library/react';
import { Toaster } from 'src/shared/components/toaster';
import { describe, expect, it, vi } from 'vitest';

vi.mock('src/shared/hooks/use-theme', () => ({
  useTheme: () => ({ theme: 'dark' as const, toggleTheme: vi.fn() }),
}));

describe('Toaster', () => {
  it('renders without crashing', () => {
    const { container } = render(<Toaster />);
    // The sonner toaster renders a section for notifications
    const region = container.querySelector('section[aria-label^="Notifications"]');
    expect(region).not.toBeNull();
  });
});
