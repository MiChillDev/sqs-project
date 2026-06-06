import { createRoute } from '@tanstack/react-router';
import { useCallback, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useRandomJoke } from 'src/shared/api/hooks';
import { Confetti } from 'src/shared/components/animations/confetti';
import { Button } from 'src/shared/components/ui/button';
import { Card, CardContent } from 'src/shared/components/ui/card';
import { rootRoute } from './__root';

export function getNextCount(prev: number, max: number) {
  return (prev + 1) % max;
}

export function shouldShowConfetti(prev: number, max: number) {
  return prev === max - 1;
}

export function scheduleConfettiReset(fn: () => void, delay = 1500) {
  return setTimeout(fn, delay);
}

function useJokeCounter(maxCount: number) {
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

type JokeCardContentProps = {
  hasFetched: boolean;
  isError: boolean;
  isSuccess: boolean;
  joke?: string;
};

function JokeCardContent({ hasFetched, isError, isSuccess, joke }: JokeCardContentProps) {
  const { t } = useTranslation();

  if (isError) {
    return (
      <CardContent className='h-full flex flex-col items-center justify-center gap-6 text-center overflow-hidden'>
        <div className='text-xl text-destructive'>{t('jokePage.error')}</div>
      </CardContent>
    );
  }

  if (isSuccess && joke) {
    return (
      <CardContent className='h-full flex flex-col items-center justify-center gap-6 text-center overflow-hidden'>
        <div className='text-3xl font-heading text-[#2C3E50]'>{joke}</div>
      </CardContent>
    );
  }

  if (!hasFetched) {
    return (
      <CardContent className='h-full flex flex-col items-center justify-center gap-6 text-center overflow-hidden'>
        <div className='text-xl text-[#2C3E50]'>{t('jokePage.placeholder')}</div>
      </CardContent>
    );
  }

  return null;
}

function getButtonLabel(t: (key: string) => string, isFetching: boolean, isSuccess: boolean) {
  if (isFetching) return t('jokePage.fetching');
  if (isSuccess) return t('jokePage.refetchButton');
  return t('jokePage.fetchButton');
}

function JokePage() {
  const { t } = useTranslation();

  const [isAnimating, setIsAnimating] = useState(false);
  const [hasFetched, setHasFetched] = useState(false);

  const jokeQuery = useRandomJoke();
  const joke = jokeQuery.data?.content;

  const { count, showConfetti, increment } = useJokeCounter(100);

  const handleFetch = async () => {
    setIsAnimating(true);
    const result = await jokeQuery.refetch();
    setHasFetched(true);

    if (result.status === 'success') {
      increment();
    }

    setIsAnimating(false);
  };

  const buttonLabel = getButtonLabel(t, jokeQuery.isFetching, !!jokeQuery.isSuccess);

  return (
    <div className='min-h-screen flex flex-col items-center justify-center gap-12 bg-linear-to-br from-[#FFF5E1] via-[#FFE4C4] to-[#FFDAB9] font-[Nunito] relative overflow-hidden'>
      <h1 className='text-[4rem] font-heading text-[#2C3E50] drop-shadow-[3px_3px_0px_#FF6B35] -rotate-2 tracking-wide'>
        {t('jokePage.heading')}
      </h1>

      <Card
        className={`
          relative w-150 h-75 p-8 border-[3px] border-[#FF6B35]
          shadow-[0_20px_40px_rgba(255,107,53,0.25)]
          transition-all duration-300 ease-in-out
          ${isAnimating ? 'scale-95 opacity-60' : 'scale-100 opacity-100'}
        `}
      >
        <div
          className={`
            absolute -top-5 -right-5
            w-12 h-12
            overflow-visible
            flex items-center justify-center
            rounded-full
            bg-[#FF6B35]/90 backdrop-blur-md
            text-white
            font-bold
            text-sm
            border-[3px] border-[#FF6B35]
            shadow-[0_10px_25px_rgba(255,107,53,0.35)]
            transition-all duration-300 ease-in-out
            ${isAnimating ? 'scale-90 opacity-95' : 'scale-100 opacity-100'}
          `}
        >
          <Confetti trigger={showConfetti} />
          {count}
        </div>

        <JokeCardContent
          hasFetched={hasFetched}
          isError={jokeQuery.isError}
          isSuccess={jokeQuery.isSuccess}
          joke={joke}
        />
      </Card>

      <Button
        onClick={handleFetch}
        disabled={jokeQuery.isFetching || isAnimating}
        className='px-10 py-4 text-xl font-heading bg-linear-to-r from-[#FF6B35] to-[#F7931E] text-white rounded-full shadow-lg hover:scale-105 transition'
      >
        {buttonLabel}
      </Button>
    </div>
  );
}

export default createRoute({
  getParentRoute: () => rootRoute,
  path: '/jokes',
  component: JokePage,
});
