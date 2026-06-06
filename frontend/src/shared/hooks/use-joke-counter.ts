import { useCallback, useState } from 'react';
import {
  getNextCount,
  scheduleConfettiReset,
  shouldShowConfetti,
} from 'src/shared/lib/joke-counter';

export function useJokeCounter(maxCount: number) {
  const [count, setCount] = useState(0);
  const [showConfetti, setShowConfetti] = useState(false);

  const increment = useCallback(() => {
    setCount((prev) => {
      const next = getNextCount(prev, maxCount);

      if (shouldShowConfetti(prev, maxCount)) {
        setShowConfetti(true);
        scheduleConfettiReset(() => setShowConfetti(false));
      }

      return next;
    });
  }, [maxCount]);

  return { count, showConfetti, increment };
}
