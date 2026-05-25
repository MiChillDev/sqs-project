import { useTranslation } from 'react-i18next';
import { Button } from './ui/button';

export function ErrorAlert({ messageKey, onRetry }: { messageKey: string; onRetry?: () => void }) {
  const { t } = useTranslation();

  return (
    <div className='flex flex-col gap-2'>
      <div
        role='alert'
        className='rounded-md border border-destructive/50 bg-destructive/10 px-4 py-3 text-destructive text-sm'
      >
        {t(messageKey)}
      </div>
      {onRetry && (
        <Button variant='outline' size='sm' type='button' onClick={onRetry}>
          Retry
        </Button>
      )}
    </div>
  );
}
