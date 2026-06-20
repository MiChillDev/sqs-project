import { Tabs } from 'radix-ui';
import { useTranslation } from 'react-i18next';
import { JokeCreationSection } from './joke-creation-section';
import { SourceJokeSection } from './source-joke-section';

export function AdminPage() {
  const { t } = useTranslation();

  return (
    <div className='min-h-screen bg-linear-to-br from-playful-bg-start via-playful-bg-mid to-playful-bg-end'>
      <div className='mx-auto max-w-200 p-8'>
        <Tabs.Root defaultValue='source'>
          <Tabs.List
            className='tab-list relative flex border-b border-gray-200/50'
            aria-label={t('admin.tabs.label')}
          >
            <Tabs.Trigger
              value='source'
              className='flex-1 cursor-pointer px-4 py-3 text-sm font-medium text-gray-500 transition-colors duration-200 hover:text-gray-700 data-[state=active]:text-playful-accent'
            >
              {t('admin.tabs.source')}
            </Tabs.Trigger>
            <Tabs.Trigger
              value='create'
              className='flex-1 cursor-pointer px-4 py-3 text-sm font-medium text-gray-500 transition-colors duration-200 hover:text-gray-700 data-[state=active]:text-playful-accent'
            >
              {t('admin.tabs.create')}
            </Tabs.Trigger>
            <span className='tab-indicator absolute bottom-0 left-0 h-0.5 w-1/2 rounded-full bg-playful-accent transition-transform duration-200' />
          </Tabs.List>

          <Tabs.Content
            value='source'
            className='mt-6 data-[state=active]:animate-in data-[state=active]:fade-in-0 data-[state=active]:duration-200'
          >
            <SourceJokeSection />
          </Tabs.Content>

          <Tabs.Content
            value='create'
            className='mt-6 data-[state=active]:animate-in data-[state=active]:fade-in-0 data-[state=active]:duration-200'
          >
            <JokeCreationSection />
          </Tabs.Content>
        </Tabs.Root>
      </div>
    </div>
  );
}
