import { createRoute } from '@tanstack/react-router';
import { useState } from 'react';
import { Button } from 'src/shared/components/ui/button';

import { Card, CardContent } from 'src/shared/components/ui/card';
import { rootRoute } from './__root';

const jokes = [
  { setup: 'Chuck Norris kennt die letzte Ziffer von Pi.' },
  { setup: 'Chuck Norris bringt Zwiebeln zum Weinen.' },
  {
    setup: "Why don't scientists trust atoms?",
    punchline: 'Because they make up everything!',
  },
];

function JokePage() {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isAnimating, setIsAnimating] = useState(false);

  const currentJoke = jokes[currentIndex];

  const handleNext = () => {
    setIsAnimating(true);
    setTimeout(() => {
      setCurrentIndex((prev) => (prev + 1) % jokes.length);
      setIsAnimating(false);
    }, 300);
  };

  return (
    <div className='min-h-screen flex flex-col items-center justify-center gap-12 bg-linear-to-br from-[#FFF5E1] via-[#FFE4C4] to-[#FFDAB9] font-[Nunito] relative overflow-hidden'>
      {/* Titel */}
      <h1 className='text-[4rem] font-heading text-[#2C3E50] drop-shadow-[3px_3px_0px_#FF6B35] -rotate-2 tracking-wide'>
        Chuck Norris Jokes
      </h1>

      {/* Card */}
      <Card
        className={`
          w-150 h-75 p-8 overflow-hidden border-[3px] border-[#FF6B35]
          shadow-[0_20px_40px_rgba(255,107,53,0.25)]
          transition-all duration-300 ease-in-out
          ${isAnimating ? 'scale-95 opacity-60' : 'scale-100 opacity-100'}
      `}
      >
        <CardContent className='h-full flex flex-col items-center justify-center gap-6 text-center'>
          <div className='text-3xl font-heading text-[#2C3E50]'>{currentJoke.setup}</div>

          {currentJoke.punchline && (
            <div className='text-xl font-bold text-[#FF6B35]'>{currentJoke.punchline}</div>
          )}
        </CardContent>
      </Card>

      {/* Button */}
      <Button
        onClick={handleNext}
        disabled={isAnimating}
        className='px-10 py-4 text-xl font-heading bg-linear-to-r from-[#FF6B35] to-[#F7931E] text-white rounded-full shadow-lg hover:scale-105 transition'
      >
        NEXT JOKE →
      </Button>

      {/* Counter */}
      <div className='absolute bottom-6 right-6 text-sm text-[#2C3E50]/60 font-semibold'>
        {currentIndex + 1} of {jokes.length}
      </div>
    </div>
  );
}

export default createRoute({
  getParentRoute: () => rootRoute,
  path: '/jokes',
  component: JokePage,
});
