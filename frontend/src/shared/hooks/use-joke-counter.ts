import { useCallback, useEffect, useRef, useState } from 'react';
import {
  getNextCount,
  scheduleConfettiReset,
  shouldShowConfetti,
} from 'src/shared/lib/joke-counter';

export function useJokeCounter(maxCount: number) {
  const [count, setCount] = useState(0);
  const [showConfetti, setShowConfetti] = useState(false);
  const timeoutRef = useRef<ReturnType<typeof setTimeout>>(undefined);

  useEffect(() => {
    return () => {
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
    };
  }, []);

  const increment = useCallback(() => {
    setCount((prev) => {
      const next = getNextCount(prev, maxCount);

      if (shouldShowConfetti(prev, maxCount)) {
        setShowConfetti(true);
        if (timeoutRef.current) clearTimeout(timeoutRef.current);
        timeoutRef.current = scheduleConfettiReset(() => setShowConfetti(false));
      }

      return next;
    });
  }, [maxCount]);

  return { count, showConfetti, increment };
}
