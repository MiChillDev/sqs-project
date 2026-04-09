import { Moon, Sun } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import type { Theme } from '@/shared/hooks/use-theme';
import { Button } from './ui/button';

export function ThemeToggle({ theme, onToggle }: { theme: Theme; onToggle: () => void }) {
  const { t } = useTranslation();

  return (
    <Button variant='ghost' size='icon' aria-label={t('app.toggleTheme')} onClick={onToggle}>
      {theme === 'light' ? <Sun size={16} /> : <Moon size={16} />}
    </Button>
  );
}
