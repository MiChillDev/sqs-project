import { createRoute } from '@tanstack/react-router';
import { rootRoute } from './__root';
import { useState } from 'react';

export const jokePageRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/jokes',
  component: JokePage,
});

const jokes = [
  { setup: "Chuck Norris kennt die letzte Ziffer von Pi." },
  { setup: "Chuck Norris bringt Zwiebeln zum Weinen." },
  {
    setup: "Why don't scientists trust atoms?",
    punchline: "Because they make up everything!",
  },
  {
    setup: "What do you call a bear with no teeth?",
    punchline: "A gummy bear!",
  },
  {
    setup: "Why did the scarecrow win an award?",
    punchline: "He was outstanding in his field!",
  },
  {
    setup: "What do you call a fake noodle?",
    punchline: "An impasta!",
  },
  {
    setup: "Why don't eggs tell jokes?",
    punchline: "They'd crack each other up!",
  },
  {
    setup: "What did the ocean say to the beach?",
    punchline: "Nothing, it just waved!",
  },
  {
    setup: "Why did the math book look so sad?",
    punchline: "Because it had too many problems!",
  },
  {
    setup: "What do you call a dinosaur that crashes his car?",
    punchline: "Tyrannosaurus Wrecks!",
  },
];

function JokePage() {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isAnimating, setIsAnimating] = useState(false);

  const handleNext = () => {
    setIsAnimating(true);
    setTimeout(() => {
      setCurrentIndex((prev) => (prev + 1) % jokes.length);
      setIsAnimating(false);
    }, 300);
  };

  const currentJoke = jokes[currentIndex];

  return (
    <div className="size-full flex flex-col items-center justify-center gap-12 relative overflow-hidden"
      style={{
        background: "linear-gradient(135deg, #FFF5E1 0%, #FFE4C4 50%, #FFDAB9 100%)",
        fontFamily: "Nunito, sans-serif",
      }}
    >
      <h1 className="relative z-10 tracking-wide"
        style={{
          fontFamily: "Lilita One, cursive",
          fontSize: "4rem",
          color: "#2C3E50",
        }}
      >
        Chuck Norris Jokes
      </h1>

      <div className="bg-white rounded-3xl shadow-2xl p-12 max-w-2xl w-[600px] min-h-[320px] flex flex-col items-center justify-center gap-8"
        style={{
          border: "3px solid #FF6B35",
        }}
      >
        <div style={{ fontSize: "2rem", textAlign: "center" }}>
          {currentJoke.setup}
        </div>

        <div style={{ fontSize: "1.5rem", color: "#FF6B35", textAlign: "center" }}>
          {currentJoke.punchline}
        </div>
      </div>

      <button onClick={handleNext}>
        NEXT JOKE →
      </button>
    </div>
  );
}

export default jokePageRoute;