export function getNextCount(prev: number, max: number) {
  return (prev + 1) % max;
}

export function shouldShowConfetti(prev: number, max: number) {
  return prev === max - 1;
}

export function scheduleConfettiReset(fn: () => void, delay = 1500) {
  return setTimeout(fn, delay);
}
