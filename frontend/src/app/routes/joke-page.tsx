import { createRoute } from '@tanstack/react-router';
import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { fetchApi, type Joke } from 'src/shared/api/api';
import { Confetti } from 'src/shared/components/animations/confetti';
import { Button } from 'src/shared/components/ui/button';
import { Card, CardContent } from 'src/shared/components/ui/card';
import { useJokeCounter } from 'src/shared/hooks/use-joke-counter';
import { rootRoute } from './__root';

type JokeCardContentProps = Readonly<{
  isError: boolean;
  isSuccess: boolean;
  joke?: string | null;
}>;

function JokeCardContent({ isError, isSuccess, joke }: JokeCardContentProps) {
  const { t } = useTranslation();

  return (
    <CardContent className='flex-1 flex flex-col items-center justify-center gap-6 text-center'>
      {isError && <div className='text-xl text-destructive'>{t('jokePage.error')}</div>}

      {isSuccess && joke === null && (
        <div className='text-xl text-destructive'>{t('jokePage.empty')}</div>
      )}

      {isSuccess && typeof joke === 'string' && joke && (
        <div data-testid='joke-content' className='text-3xl font-heading text-playful-text'>
          {joke}
        </div>
      )}

      {!isError && !isSuccess && (
        <div className='text-xl text-playful-text'>{t('jokePage.placeholder')}</div>
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

  const [joke, setJoke] = useState<string | null>();
  const [isError, setIsError] = useState(false);
  const [isFetching, setIsFetching] = useState(false);
  const [isAnimating, setIsAnimating] = useState(false);

  const isSuccess = joke !== undefined && !isError;

  const { count, showConfetti, increment } = useJokeCounter(100);

  const handleFetch = async () => {
    setIsAnimating(true);
    setIsFetching(true);
    setIsError(false);
    try {
      const result = await fetchApi<Joke>('/api/v1/jokes');
      setJoke(result.content);
      if (result.content?.trim()) {
        increment();
      }
    } catch {
      setJoke(undefined);
      setIsError(true);
    } finally {
      setIsFetching(false);
      setIsAnimating(false);
    }
  };

  const buttonLabel = getButtonLabel(t, isSuccess);

  return (
    <div className='flex-1 flex flex-col items-center justify-center gap-8 sm:gap-12 bg-linear-to-br from-playful-bg-start via-playful-bg-mid to-playful-bg-end font-body relative overflow-auto'>
      <h1
        data-testid='joke-heading'
        className='text-5xl sm:text-[4rem] font-heading text-playful-heading drop-shadow-[3px_3px_0px_var(--color-playful-accent)] dark:drop-shadow-[0_0_15px_var(--color-playful-accent)] sm:-rotate-2 tracking-wide text-center px-4'
      >
        {t('jokePage.heading')}
      </h1>

      <Card
        className={`
          relative w-full sm:w-150 min-h-75 p-6 sm:p-8 border-[3px] border-playful-accent flex flex-col mx-auto
          shadow-[0_20px_40px_rgba(255,107,53,0.25)] dark:shadow-[0_0_30px_rgba(255,107,53,0.5),0_0_60px_rgba(255,107,53,0.2)]
          transition-all duration-300 ease-in-out
          ${isAnimating ? 'scale-95 opacity-60' : 'scale-100 opacity-100'}
        `}
      >
        <div
          data-testid='joke-counter'
          className={`
            absolute top-0 right-0 sm:-top-5 sm:-right-5
            w-12 h-12
            overflow-visible
            flex items-center justify-center
            rounded-tl-full rounded-bl-full rounded-br-full rounded-tr-xl sm:rounded-full
            bg-playful-accent/90 backdrop-blur-md
            text-white
            font-bold
            text-sm
            border-[3px] border-playful-accent
            shadow-[0_10px_25px_rgba(255,107,53,0.35)] dark:shadow-[0_0_20px_rgba(255,107,53,0.6),0_0_40px_rgba(255,107,53,0.3)]
            transition-all duration-300 ease-in-out
            ${isAnimating ? 'scale-90 opacity-95' : 'scale-100 opacity-100'}
          `}
        >
          <Confetti trigger={showConfetti} />
          {count}
        </div>

        <JokeCardContent isError={isError} isSuccess={isSuccess} joke={joke} />
      </Card>

      <Button
        data-testid='fetch-joke-button'
        onClick={handleFetch}
        disabled={isFetching || isAnimating}
        className='px-8 sm:px-10 py-3 sm:py-4 text-lg sm:text-xl font-heading bg-linear-to-r from-playful-accent to-playful-accent-light text-white rounded-full shadow-lg dark:shadow-[0_0_25px_rgba(255,107,53,0.5)] hover:scale-105 transition'
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
