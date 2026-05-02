import { cleanup, render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { afterEach, describe, expect, it, vi } from 'vitest';
import enTranslation from '../../public/locales/en/translation.json';
import apiTestRoute from '../../src/app/routes/api-test';

const mockMutate = vi.fn();
const mockMutationResult = {
  mutate: mockMutate,
  isPending: false,
  isError: false,
  isSuccess: false,
  data: null as unknown,
  error: null as unknown,
};

vi.mock('sonner', () => ({
  toast: Object.assign(vi.fn(), {
    success: vi.fn(),
    error: vi.fn(),
  }),
}));

vi.mock('react-i18next', () => ({
  useTranslation: () => ({
    t: (key: string) => {
      const value = key
        .split('.')
        .reduce(
          (o: Record<string, unknown> | undefined, k) =>
            o?.[k] as Record<string, unknown> | undefined,
          enTranslation as unknown as Record<string, unknown>
        );
      return (value as string) ?? key;
    },
    i18n: { language: 'en' },
  }),
}));

vi.mock('src/shared/api/api', () => ({
  useHealthCheck: () => mockMutationResult,
}));

describe('ConnectivityTestPage', () => {
  const Component = apiTestRoute.options.component;

  afterEach(() => {
    cleanup();
    vi.clearAllMocks();
  });

  it('renders the page heading', () => {
    render(<Component />);
    expect(screen.getByText(enTranslation.connectivityTest.title)).toBeInTheDocument();
  });

  it('renders the test connection button with translated label', () => {
    render(<Component />);
    expect(
      screen.getByRole('button', { name: enTranslation.connectivityTest.testButton })
    ).toBeInTheDocument();
  });

  it('calls mutate when the test button is clicked', async () => {
    const user = userEvent.setup();
    render(<Component />);
    await user.click(
      screen.getByRole('button', { name: enTranslation.connectivityTest.testButton })
    );
    expect(mockMutate).toHaveBeenCalledOnce();
  });

  it('disables button and shows testing text when pending', () => {
    mockMutationResult.isPending = true;
    render(<Component />);
    const button = screen.getByRole('button', { name: enTranslation.connectivityTest.testing });
    expect(button).toBeDisabled();
    mockMutationResult.isPending = false;
  });

  it('calls toast.success with translated strings on successful mutation', async () => {
    const { toast } = await import('sonner');
    mockMutate.mockImplementationOnce((_arg: unknown, options?: { onSuccess?: () => void }) => {
      options?.onSuccess?.();
    });

    const user = userEvent.setup();
    render(<Component />);
    await user.click(
      screen.getByRole('button', { name: enTranslation.connectivityTest.testButton })
    );

    expect(toast.success).toHaveBeenCalledOnce();
    expect(toast.success).toHaveBeenCalledWith(enTranslation.connectivityTest.toastTitle, {
      description: enTranslation.connectivityTest.toastDescription,
    });
  });
});
