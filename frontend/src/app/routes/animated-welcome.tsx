const STAGGER_MS = 100;

type AnimatedWelcomeProps = Readonly<{
  text: string;
}>;

export function AnimatedWelcome({ text }: AnimatedWelcomeProps) {
  const characters = [...text];

  return (
    <h1
      aria-label={text}
      className='text-[8rem] font-heading text-playful-heading drop-shadow-[3px_3px_0px_var(--color-playful-accent)] dark:drop-shadow-[0_0_15px_var(--color-playful-accent)] tracking-wide'
    >
      {characters.map((char, index) => (
        <span
          key={`${index}-${char}`}
          className='inline-block animate-float'
          style={{ animationDelay: `${index * STAGGER_MS}ms` }}
        >
          {char === ' ' ? '\u00A0' : char}
        </span>
      ))}
    </h1>
  );
}
