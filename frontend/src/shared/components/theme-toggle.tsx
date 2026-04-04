import { Moon, Sun } from 'lucide-react';

import { Button } from '@/shared/components/ui/button';
import type { Theme } from '@/shared/hooks/use-theme';

export function ThemeToggle({ theme, onToggle }: { theme: Theme; onToggle: () => void }) {
  return (
    <Button variant="ghost" size="icon" aria-label="Toggle theme" onClick={onToggle}>
      {theme === 'light' ? <Sun /> : <Moon />}
    </Button>
  );
}
