import { useMemo } from 'react';

const STAGGER_MS = 100;

type AnimatedWelcomeProps = Readonly<{
  text: string;
}>;

export function AnimatedWelcome({ text }: AnimatedWelcomeProps) {
  const characters = useMemo(
    () => [...text].map((char, i) => ({ char, id: `${i}-${char}` })),
    [text]
  );

  return (
    <h1
      data-testid='home-heading'
      aria-label={text}
      className='text-5xl sm:text-[8rem] text-center px-4 font-heading text-playful-heading drop-shadow-[3px_3px_0px_var(--color-playful-accent)] dark:drop-shadow-[0_0_15px_var(--color-playful-accent)] tracking-wide'
    >
      {characters.map(({ char, id }, index) => (
        <span
          key={id}
          className='inline-block animate-float'
          style={{ animationDelay: `${index * STAGGER_MS}ms` }}
        >
          {char === ' ' ? '\u00A0' : char}
        </span>
      ))}
    </h1>
  );
}
