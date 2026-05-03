import { cleanup, render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { afterEach, describe, expect, it, vi } from 'vitest';
import enTranslation from '../../public/locales/en/translation.json';
import demoApiRoute from '../../src/app/routes/demo-api';

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
let mockJokeQueryResult = createMockQueryResult();

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
      return (value as unknown as string) ?? key;
    },
    i18n: { language: 'en' },
  }),
}));

vi.mock('src/shared/api/hooks', () => ({
  useHealthCheck: () => mockQueryResult,
  useRandomJoke: () => mockJokeQueryResult,
}));

describe('ConnectivityTestPage', () => {
  const Component = demoApiRoute.options.component as NonNullable<
    typeof demoApiRoute.options.component
  >;

  afterEach(() => {
    cleanup();
    vi.clearAllMocks();
    mockQueryResult = createMockQueryResult();
    mockJokeQueryResult = createMockQueryResult();
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
    expect(screen.getByText(/Service is healthy/)).toBeInTheDocument();
  });

  it('renders joke card with fetch button', () => {
    render(<Component />);
    expect(
      screen.getByRole('button', { name: enTranslation.jokePreview.fetchButton })
    ).toBeInTheDocument();
  });

  it('shows fetching text when joke query is loading', () => {
    mockJokeQueryResult = createMockQueryResult({ isFetching: true });
    render(<Component />);
    expect(screen.getByRole('button', { name: enTranslation.jokePreview.fetching })).toBeDisabled();
  });

  it('shows error text when joke query fails', () => {
    mockJokeQueryResult = createMockQueryResult({ isError: true });
    render(<Component />);
    expect(screen.getByText(enTranslation.jokePreview.error)).toBeInTheDocument();
  });

  it('shows joke content when joke query succeeds', () => {
    mockJokeQueryResult = createMockQueryResult({
      isSuccess: true,
      data: { content: 'Why did the chicken cross the road?' },
    });
    render(<Component />);
    expect(screen.getByText('Why did the chicken cross the road?')).toBeInTheDocument();
  });

  it('shows refetch button after successful joke fetch', () => {
    mockJokeQueryResult = createMockQueryResult({
      isSuccess: true,
      data: { content: 'A joke' },
    });
    render(<Component />);
    expect(
      screen.getByRole('button', { name: enTranslation.jokePreview.refetchButton })
    ).toBeInTheDocument();
  });
});
