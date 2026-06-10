import { render, screen } from '@testing-library/react';
import { AnimatedWelcome } from 'src/app/routes/animated-welcome';
import { describe, expect, it } from 'vitest';

// -----------------------------
// TESTS
// -----------------------------

describe('AnimatedWelcome', () => {
  it('renders <h1> with aria-label matching the text prop', () => {
    render(<AnimatedWelcome text='Welcome!' />);

    const heading = screen.getByRole('heading', { name: 'Welcome!' });
    expect(heading).toBeInTheDocument();
    expect(heading).toHaveAttribute('aria-label', 'Welcome!');
  });

  it('renders correct number of character spans for "Welcome!" (8 chars) and "Willkommen!" (11 chars)', () => {
    const { unmount } = render(<AnimatedWelcome text='Welcome!' />);
    const welcomeSpans = screen.getByRole('heading').querySelectorAll('span');
    expect(welcomeSpans).toHaveLength(8);
    unmount();

    render(<AnimatedWelcome text='Willkommen!' />);
    const willkommenSpans = screen.getByRole('heading').querySelectorAll('span');
    expect(willkommenSpans).toHaveLength(11);
  });

  it('each span has inline-block and animate-float classes', () => {
    render(<AnimatedWelcome text='Test' />);

    const spans = screen.getByRole('heading').querySelectorAll('span');
    expect(spans.length).toBeGreaterThan(0);

    for (const span of spans) {
      expect(span).toHaveClass('inline-block');
      expect(span).toHaveClass('animate-float');
    }
  });

  it('span at index 0 has animation-delay: 0ms', () => {
    render(<AnimatedWelcome text='Test' />);

    const spans = screen.getByRole('heading').querySelectorAll('span');
    expect(spans[0]).toHaveStyle({ animationDelay: '0ms' });
  });

  it('span at index 3 has animation-delay: 300ms', () => {
    render(<AnimatedWelcome text='Test!' />);

    const spans = screen.getByRole('heading').querySelectorAll('span');
    expect(spans[3]).toHaveStyle({ animationDelay: '300ms' });
  });

  it('space characters render as \\u00A0', () => {
    render(<AnimatedWelcome text='Hello World' />);

    const spans = screen.getByRole('heading').querySelectorAll('span');
    // Space is at index 5 in "Hello World"
    expect(spans[5].textContent).toBe('\u00A0');
  });

  it('empty string renders empty <h1> with no spans', () => {
    render(<AnimatedWelcome text='' />);

    const heading = screen.getByRole('heading');
    expect(heading).toBeInTheDocument();
    expect(heading.querySelectorAll('span')).toHaveLength(0);
  });

  it('aria-label attribute is set on the <h1> for screen reader accessibility', () => {
    render(<AnimatedWelcome text='Accessible text' />);

    const heading = screen.getByRole('heading');
    expect(heading).toHaveAttribute('aria-label', 'Accessible text');
  });
});
