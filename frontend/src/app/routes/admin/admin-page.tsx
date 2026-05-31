import { useTranslation } from 'react-i18next';
import { JokeCreationSection } from './joke-creation-section';
import { SourceJokeSection } from './source-joke-section';

export function AdminPage() {
  const { t } = useTranslation();

  return (
    <div className='mx-auto max-w-200 p-8'>
      <h1 className='text-2xl font-bold mb-8'>{t('admin.title')}</h1>
      <div className='space-y-8'>
        <JokeCreationSection />
        <SourceJokeSection />
      </div>
    </div>
  );
}
