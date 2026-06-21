import { getNextCount, scheduleConfettiReset, shouldShowConfetti } from 'src/shared/lib/joke-counter';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';

describe('getNextCount', () => {
  it('increments and wraps around', () => {
    expect(getNextCount(0, 3)).toBe(1);
    expect(getNextCount(2, 3)).toBe(0);
    expect(getNextCount(0, 1)).toBe(0);
  });
});

describe('shouldShowConfetti', () => {
  it('true only when prev equals last index', () => {
    expect(shouldShowConfetti(2, 3)).toBe(true);
    expect(shouldShowConfetti(0, 3)).toBe(false);
    expect(shouldShowConfetti(1, 3)).toBe(false);
    expect(shouldShowConfetti(0, 1)).toBe(true); // single-element: 0 is last
    expect(shouldShowConfetti(0, 0)).toBe(false); // zero elements: no last
  });
});

describe('scheduleConfettiReset', () => {
  beforeEach(() => vi.useFakeTimers());
  afterEach(() => vi.useRealTimers());

  it('calls callback after delay', () => {
    const cb = vi.fn();
    scheduleConfettiReset(cb, 500);
    vi.advanceTimersByTime(499);
    expect(cb).not.toHaveBeenCalled();
    vi.advanceTimersByTime(1);
    expect(cb).toHaveBeenCalledOnce();
  });

  it('returns timer that can be cleared', () => {
    const cb = vi.fn();
    clearTimeout(scheduleConfettiReset(cb));
    vi.advanceTimersByTime(2000);
    expect(cb).not.toHaveBeenCalled();
  });
});
