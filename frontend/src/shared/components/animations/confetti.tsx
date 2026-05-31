import { DotLottieReact } from '@lottiefiles/dotlottie-react';

import confettiUrl from '../../animations/Confetti.json?url';

type ConfettiProps = {
  trigger: boolean;
};

export function Confetti({ trigger }: ConfettiProps) {
  if (!trigger) return null;

  return (
    <div
      className='absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 pointer-events-none z-50 overflow-visible'
      style={{ width: 200, height: 200 }}
    >
      <DotLottieReact src={confettiUrl} autoplay loop={false} />
    </div>
  );
}
