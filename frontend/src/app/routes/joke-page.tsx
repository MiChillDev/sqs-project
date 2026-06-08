import { createRoute } from '@tanstack/react-router';
import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useRandomJoke } from 'src/shared/api/hooks';
import { Confetti } from 'src/shared/components/animations/confetti';
import { Button } from 'src/shared/components/ui/button';
import { Card, CardContent } from 'src/shared/components/ui/card';
import { useJokeCounter } from 'src/shared/hooks/use-joke-counter';
import { rootRoute } from './__root';

type JokeCardContentProps = Readonly<{
  hasFetched: boolean;
  isError: boolean;
  isSuccess: boolean;
  joke?: string;
}>;

function JokeCardContent({ hasFetched, isError, isSuccess, joke }: JokeCardContentProps) {
  const { t } = useTranslation();

  return (
    <CardContent className='flex-1 flex flex-col items-center justify-center gap-6 text-center'>
      {!hasFetched && !isError && (
        <div className='text-xl text-(--color-playful-text)'>{t('jokePage.placeholder')}</div>
      )}

      {isError && <div className='text-xl text-destructive'>{t('jokePage.error')}</div>}

      {isSuccess && !joke && <div className='text-xl text-destructive'>{t('jokePage.empty')}</div>}

      {isSuccess && joke && (
        <div className='text-3xl font-heading text-(--color-playful-text)'>{joke}</div>
      )}
    </CardContent>
  );
}

function getButtonLabel(t: (key: string) => string, isSuccess: boolean) {
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
    try {
      const result = await jokeQuery.refetch();
      setHasFetched(true);

      if (result.status === 'success' && result.data?.content?.trim()) {
        increment();
      }
    } finally {
      setIsAnimating(false);
    }
  };

  const buttonLabel = getButtonLabel(t, jokeQuery.isSuccess);

  return (
    <div className='min-h-screen flex flex-col items-center justify-center gap-12 bg-linear-to-br from-(--color-playful-bg-start) via-(--color-playful-bg-mid) to-(--color-playful-bg-end) font-body relative overflow-hidden'>
      <h1 className='text-[4rem] font-heading text-(--color-playful-heading) drop-shadow-[3px_3px_0px_var(--color-playful-accent)] dark:drop-shadow-[0_0_15px_var(--color-playful-accent)] -rotate-2 tracking-wide'>
        {t('jokePage.heading')}
      </h1>

      <Card
        className={`
          relative w-150 min-h-75 p-8 border-[3px] border-(--color-playful-accent) flex flex-col
          shadow-[0_20px_40px_rgba(255,107,53,0.25)] dark:shadow-[0_0_30px_rgba(255,107,53,0.5),0_0_60px_rgba(255,107,53,0.2)]
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
            bg-(--color-playful-accent)/90 backdrop-blur-md
            text-white
            font-bold
            text-sm
            border-[3px] border-(--color-playful-accent)
            shadow-[0_10px_25px_rgba(255,107,53,0.35)] dark:shadow-[0_0_20px_rgba(255,107,53,0.6),0_0_40px_rgba(255,107,53,0.3)]
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
        className='px-10 py-4 text-xl font-heading bg-linear-to-r from-(--color-playful-accent) to-(--color-playful-accent-light) text-white rounded-full shadow-lg dark:shadow-[0_0_25px_rgba(255,107,53,0.5)] hover:scale-105 transition'
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
