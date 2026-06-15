import { act, renderHook } from '@testing-library/react';
import { useJokeCounter } from 'src/shared/hooks/use-joke-counter';
import { afterEach, describe, expect, it, vi } from 'vitest';

describe('useJokeCounter', () => {
  afterEach(() => {
    vi.useRealTimers();
  });

  it('initializes with count 0 and showConfetti false', () => {
    const { result } = renderHook(() => useJokeCounter(100));

    expect(result.current.count).toBe(0);
    expect(result.current.showConfetti).toBe(false);
  });

  it('increments count by 1', () => {
    const { result } = renderHook(() => useJokeCounter(100));

    act(() => {
      result.current.increment();
    });

    expect(result.current.count).toBe(1);
  });

  it('wraps count from maxCount-1 to 0', () => {
    const maxCount = 100;
    const { result } = renderHook(() => useJokeCounter(maxCount));

    for (let i = 0; i < maxCount; i++) {
      act(() => {
        result.current.increment();
      });
    }

    expect(result.current.count).toBe(0);
  });

  it('does not wrap count prematurely', () => {
    const { result } = renderHook(() => useJokeCounter(100));

    for (let i = 0; i < 50; i++) {
      act(() => {
        result.current.increment();
      });
    }

    expect(result.current.count).toBe(50);
  });

  it('sets showConfetti to true at the boundary', () => {
    vi.useFakeTimers();
    const maxCount = 5;
    const { result } = renderHook(() => useJokeCounter(maxCount));

    for (let i = 0; i < maxCount - 1; i++) {
      act(() => {
        result.current.increment();
      });
    }

    expect(result.current.count).toBe(4);
    expect(result.current.showConfetti).toBe(false);

    act(() => {
      result.current.increment();
    });

    expect(result.current.count).toBe(0);
    expect(result.current.showConfetti).toBe(true);
  });

  it('resets showConfetti after timeout', () => {
    vi.useFakeTimers();
    const { result } = renderHook(() => useJokeCounter(5));

    for (let i = 0; i < 5; i++) {
      act(() => {
        result.current.increment();
      });
    }

    expect(result.current.showConfetti).toBe(true);

    act(() => {
      vi.advanceTimersByTime(1499);
    });
    expect(result.current.showConfetti).toBe(true);

    act(() => {
      vi.advanceTimersByTime(1);
    });
    expect(result.current.showConfetti).toBe(false);
  });

  it('clears previous timeout when new confetti is triggered', () => {
    vi.useFakeTimers();
    const maxCount = 3;
    const { result } = renderHook(() => useJokeCounter(maxCount));

    for (let i = 0; i < maxCount; i++) {
      act(() => {
        result.current.increment();
      });
    }

    expect(result.current.showConfetti).toBe(true);

    act(() => {
      vi.advanceTimersByTime(500);
    });

    for (let i = 0; i < maxCount; i++) {
      act(() => {
        result.current.increment();
      });
    }

    expect(result.current.showConfetti).toBe(true);

    act(() => {
      vi.advanceTimersByTime(500);
    });
    expect(result.current.showConfetti).toBe(true);

    act(() => {
      vi.advanceTimersByTime(1000);
    });
    expect(result.current.showConfetti).toBe(false);
  });
});
