import { JokeCreationSection } from './joke-creation-section';
import { SourceJokeSection } from './source-joke-section';

export function AdminPage() {
  return (
    <div className='min-h-screen bg-linear-to-br from-(--color-playful-bg-start) via-(--color-playful-bg-mid) to-(--color-playful-bg-end)'>
      <div className='mx-auto max-w-200 p-8'>
        <div className='space-y-8'>
          <JokeCreationSection />
          <SourceJokeSection />
        </div>
      </div>
    </div>
  );
}
