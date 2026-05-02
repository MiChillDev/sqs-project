import { cleanup, render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { afterEach, describe, expect, it, vi } from 'vitest';
import enTranslation from '../../public/locales/en/translation.json';
import apiTestRoute from '../../src/app/routes/api-test';

const mockRefetch = vi.fn();
function createMockQueryResult(
  overrides?: Partial<{
    refetch: ReturnType<typeof vi.fn>;
    isFetching: boolean;
    isError: boolean;
    isSuccess: boolean;
    data: unknown;
    error: unknown;
  }>
) {
  return {
    refetch: mockRefetch,
    isFetching: false,
    isError: false,
    isSuccess: false,
    data: null as unknown,
    error: null as unknown,
    ...overrides,
  };
}

let mockQueryResult = createMockQueryResult();

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

vi.mock('src/shared/api/hooks', () => ({
  useHealthCheck: () => mockQueryResult,
}));

describe('ConnectivityTestPage', () => {
  const Component = apiTestRoute.options.component;

  afterEach(() => {
    cleanup();
    vi.clearAllMocks();
    mockQueryResult = createMockQueryResult();
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

  it('calls refetch when the test button is clicked', async () => {
    mockRefetch.mockResolvedValueOnce({ isSuccess: true });
    const user = userEvent.setup();
    render(<Component />);
    await user.click(
      screen.getByRole('button', { name: enTranslation.connectivityTest.testButton })
    );
    expect(mockRefetch).toHaveBeenCalledOnce();
  });

  it('disables button and shows testing text when fetching', () => {
    mockQueryResult = createMockQueryResult({ isFetching: true });
    render(<Component />);
    const button = screen.getByRole('button', { name: enTranslation.connectivityTest.testing });
    expect(button).toBeDisabled();
  });

  it('calls toast.success with translated strings on successful refetch', async () => {
    const { toast } = await import('sonner');
    mockRefetch.mockResolvedValueOnce({ isSuccess: true });

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

  it('does not show toast when refetch fails', async () => {
    const { toast } = await import('sonner');
    mockRefetch.mockResolvedValueOnce({ isSuccess: false });

    const user = userEvent.setup();
    render(<Component />);
    await user.click(
      screen.getByRole('button', { name: enTranslation.connectivityTest.testButton })
    );

    expect(toast.success).not.toHaveBeenCalled();
  });

  it('shows error text when query has error', () => {
    mockQueryResult = createMockQueryResult({ isError: true });
    render(<Component />);
    expect(screen.getByText(enTranslation.connectivityTest.error)).toBeInTheDocument();
  });

  it('shows health data when query is successful', () => {
    mockQueryResult = createMockQueryResult({
      isSuccess: true,
      data: { status: 'UP', message: 'Service is healthy' },
    });
    render(<Component />);
    expect(screen.getByText(/UP — Service is healthy/)).toBeInTheDocument();
  });
});
