import { Moon, Sun } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import type { Theme } from 'src/shared/hooks/use-theme';
import { Button } from './ui/button';

type Props = {
  theme: Theme;
  onToggle: () => void;
};

export function ThemeToggle(props: Readonly<Props>) {
  const { theme, onToggle } = props;
  const { t } = useTranslation();

  return (
    <Button data-testid="theme-toggle" variant='ghost' size='icon' aria-label={t('app.toggleTheme')} onClick={onToggle}>
      {theme === 'light' ? <Sun size={16} /> : <Moon size={16} />}
    </Button>
  );
}
