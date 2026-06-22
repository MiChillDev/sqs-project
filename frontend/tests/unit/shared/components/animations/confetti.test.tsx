import { render, screen } from '@testing-library/react';
import { Confetti } from 'src/shared/components/animations/confetti';
import { describe, expect, it, vi } from 'vitest';

// -----------------------------
// MOCKS
// -----------------------------

vi.mock('@lottiefiles/dotlottie-react', () => ({
  DotLottieReact: () => <div data-testid='lottie' />,
}));

// -----------------------------
// TESTS
// -----------------------------

describe('Confetti', () => {
  it('renders nothing when trigger is false', () => {
    const { container } = render(<Confetti trigger={false} />);
    expect(container.firstChild).toBeNull();
  });

  it('renders confetti animation when trigger is true', () => {
    render(<Confetti trigger={true} />);
    expect(screen.getByTestId('lottie')).toBeInTheDocument();
    expect(screen.getByTestId('lottie').parentElement).toBeInTheDocument();
  });

  it('renders nothing again when toggled from true to false', () => {
    const { rerender, container } = render(<Confetti trigger={true} />);
    expect(screen.getByTestId('lottie')).toBeInTheDocument();

    rerender(<Confetti trigger={false} />);
    expect(container.firstChild).toBeNull();
  });

  it('re-renders confetti when toggled back to true', () => {
    const { rerender } = render(<Confetti trigger={true} />);
    expect(screen.getByTestId('lottie')).toBeInTheDocument();

    rerender(<Confetti trigger={false} />);

    rerender(<Confetti trigger={true} />);
    expect(screen.getByTestId('lottie')).toBeInTheDocument();
  });
});
