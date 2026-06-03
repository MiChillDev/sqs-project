import { getNextCount, scheduleConfettiReset, shouldShowConfetti } from 'src/app/routes/joke-page';
import { afterEach, describe, expect, it, vi } from 'vitest';

// -----------------------------
// TESTS
// -----------------------------

describe('joke-page helpers', () => {
  afterEach(() => {
    vi.useRealTimers();
  });

  it('increments count', () => {
    expect(getNextCount(0, 100)).toBe(1);
  });

  it('wraps from 99 to 0', () => {
    expect(getNextCount(99, 100)).toBe(0);
  });

  it('shows confetti at boundary', () => {
    expect(shouldShowConfetti(99, 100)).toBe(true);
  });

  it('does not show confetti otherwise', () => {
    expect(shouldShowConfetti(42, 100)).toBe(false);
  });

  it('schedules confetti reset with the default delay', () => {
    vi.useFakeTimers();

    const fn = vi.fn();

    scheduleConfettiReset(fn);

    expect(fn).not.toHaveBeenCalled();

    vi.advanceTimersByTime(1499);
    expect(fn).not.toHaveBeenCalled();

    vi.advanceTimersByTime(1);
    expect(fn).toHaveBeenCalledTimes(1);
  });

  it('schedules confetti reset with a custom delay', () => {
    vi.useFakeTimers();

    const fn = vi.fn();

    scheduleConfettiReset(fn, 2500);

    vi.advanceTimersByTime(2499);
    expect(fn).not.toHaveBeenCalled();

    vi.advanceTimersByTime(1);
    expect(fn).toHaveBeenCalledTimes(1);
  });
});
