import { cleanup, render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import componentDemoRoute from 'src/app/routes/component-demo';
import { afterEach, describe, expect, it, vi } from 'vitest';
import enTranslation from '../../public/locales/en/translation.json';
import { getTranslation } from './shared/translation-helper';

const t = (key: string) => getTranslation(key);

vi.mock('sonner', () => ({
  toast: Object.assign(vi.fn(), {
    success: vi.fn(),
    error: vi.fn(),
    warning: vi.fn(),
    info: vi.fn(),
    message: vi.fn(),
  }),
}));

vi.mock('react-i18next', () => ({
  useTranslation: () => ({
    t,
    i18n: { language: 'en' },
  }),
}));

describe('ComponentDemoPage', () => {
  const Component = componentDemoRoute.options.component as NonNullable<
    typeof componentDemoRoute.options.component
  >;

  afterEach(() => {
    cleanup();
  });

  it('renders the page heading', () => {
    render(<Component />);
    expect(screen.getByText(enTranslation.demo.title)).toBeInTheDocument();
  });

  it('renders all button variants', () => {
    render(<Component />);
    expect(screen.getAllByText('Default').length).toBeGreaterThanOrEqual(2);
    expect(screen.getByText('Destructive')).toBeInTheDocument();
    expect(screen.getByText('Outline')).toBeInTheDocument();
    expect(screen.getByText('Secondary')).toBeInTheDocument();
    expect(screen.getByText('Ghost')).toBeInTheDocument();
    expect(screen.getByText('Link')).toBeInTheDocument();
  });

  it('renders card components', () => {
    render(<Component />);
    expect(screen.getByText(enTranslation.demo.cards.simple.title)).toBeInTheDocument();
    expect(screen.getByText(enTranslation.demo.cards.action.title)).toBeInTheDocument();
    expect(screen.getByText(enTranslation.demo.cards.action.headerAction)).toBeInTheDocument();
  });

  it('renders form with name, email, and message inputs', () => {
    render(<Component />);
    expect(screen.getByLabelText(enTranslation.demo.form.fields.name)).toBeInTheDocument();
    expect(screen.getByLabelText(enTranslation.demo.form.fields.email)).toBeInTheDocument();
    expect(screen.getByLabelText(enTranslation.demo.form.fields.message)).toBeInTheDocument();
  });

  it('shows validation errors when submitting empty form', async () => {
    const user = userEvent.setup();
    render(<Component />);

    const submitButton = screen.getByRole('button', { name: enTranslation.demo.form.submit });
    await user.click(submitButton);

    await waitFor(() => {
      expect(screen.getByText(enTranslation.common.validation.nameMin)).toBeInTheDocument();
    });
    await waitFor(() => {
      expect(screen.getByText(enTranslation.common.validation.emailInvalid)).toBeInTheDocument();
    });
    await waitFor(() => {
      expect(screen.getByText(enTranslation.common.validation.messageMin)).toBeInTheDocument();
    });
  });

  it('renders reset button', () => {
    render(<Component />);
    expect(screen.getByRole('button', { name: enTranslation.demo.form.reset })).toBeInTheDocument();
  });

  it('clears values and errors when reset button is clicked', async () => {
    const user = userEvent.setup();
    render(<Component />);
    await user.click(screen.getByRole('button', { name: enTranslation.demo.form.submit }));
    await waitFor(() => {
      expect(screen.getByText(enTranslation.common.validation.nameMin)).toBeInTheDocument();
    });
    await user.click(screen.getByRole('button', { name: enTranslation.demo.form.reset }));
    expect(screen.queryByText(enTranslation.common.validation.nameMin)).not.toBeInTheDocument();
    expect(screen.queryByRole('alert')).not.toBeInTheDocument();
    expect(screen.getByLabelText(enTranslation.demo.form.fields.name)).toHaveValue('');
    expect(screen.getByLabelText(enTranslation.demo.form.fields.email)).toHaveValue('');
    expect(screen.getByLabelText(enTranslation.demo.form.fields.message)).toHaveValue('');
  });

  it('marks invalid fields with aria-invalid after validation error', async () => {
    const user = userEvent.setup();
    render(<Component />);
    await user.click(screen.getByRole('button', { name: enTranslation.demo.form.submit }));
    await waitFor(() => {
      expect(screen.getByLabelText(enTranslation.demo.form.fields.name)).toHaveAttribute(
        'aria-invalid',
        'true'
      );
    });
  });

  it('renders error messages with role="alert" for screen readers', async () => {
    const user = userEvent.setup();
    render(<Component />);
    await user.click(screen.getByRole('button', { name: enTranslation.demo.form.submit }));
    await waitFor(() => {
      expect(screen.getAllByRole('alert').length).toBeGreaterThan(0);
    });
  });

  it('does NOT show toast on validation failure', async () => {
    const user = userEvent.setup();
    render(<Component />);
    await user.click(screen.getByRole('button', { name: enTranslation.demo.form.submit }));
    await waitFor(() => {
      expect(screen.getByText(enTranslation.common.validation.nameMin)).toBeInTheDocument();
    });
    const { toast } = await import('sonner');
    expect(toast.error).not.toHaveBeenCalled();
    expect(toast.success).not.toHaveBeenCalled();
  });

  it('shows success toast and resets form on valid submit', async () => {
    const user = userEvent.setup();
    render(<Component />);

    await user.type(screen.getByLabelText(enTranslation.demo.form.fields.name), 'John Doe');
    await user.type(
      screen.getByLabelText(enTranslation.demo.form.fields.email),
      'john@example.com'
    );
    await user.type(
      screen.getByLabelText(enTranslation.demo.form.fields.message),
      'Hello this is a long enough message'
    );

    await user.click(screen.getByRole('button', { name: enTranslation.demo.form.submit }));

    const { toast } = await import('sonner');
    await waitFor(
      () => {
        expect(toast.success).toHaveBeenCalledWith(enTranslation.demo.form.toastTitle, {
          description: enTranslation.demo.form.toastDescription,
        });
      },
      { timeout: 3000 }
    );

    await waitFor(() => {
      expect(screen.getByLabelText(enTranslation.demo.form.fields.name)).toHaveValue('');
      expect(screen.getByLabelText(enTranslation.demo.form.fields.email)).toHaveValue('');
      expect(screen.getByLabelText(enTranslation.demo.form.fields.message)).toHaveValue('');
    });
  });

  it('submit button shows submitting text and is disabled while submitting', async () => {
    const user = userEvent.setup();
    render(<Component />);

    await user.type(screen.getByLabelText(enTranslation.demo.form.fields.name), 'John Doe');
    await user.type(
      screen.getByLabelText(enTranslation.demo.form.fields.email),
      'john@example.com'
    );
    await user.type(
      screen.getByLabelText(enTranslation.demo.form.fields.message),
      'Hello this is a long enough message'
    );

    await user.click(screen.getByRole('button', { name: enTranslation.demo.form.submit }));

    expect(screen.getByRole('button', { name: enTranslation.demo.form.submitting })).toBeDisabled();
  });

  it.each([
    'success',
    'error',
    'warning',
    'info',
    'message',
  ] as const)('toast %s button triggers the correct sonner call', async (variant) => {
    const user = userEvent.setup();
    render(<Component />);

    const triggerKey =
      `trigger${variant[0].toUpperCase()}${variant.slice(1)}` as keyof typeof enTranslation.demo.toasts;
    const titleKey = `${variant}Title` as keyof typeof enTranslation.demo.toasts;
    const descKey = `${variant}Description` as keyof typeof enTranslation.demo.toasts;

    await user.click(screen.getByRole('button', { name: enTranslation.demo.toasts[triggerKey] }));

    const { toast } = await import('sonner');
    expect(toast[variant]).toHaveBeenCalledWith(enTranslation.demo.toasts[titleKey], {
      description: enTranslation.demo.toasts[descKey],
    });
  });
});
