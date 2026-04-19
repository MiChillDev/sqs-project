import { Languages } from 'lucide-react';
import { useState } from 'react';
import { useTranslation } from 'react-i18next';

import { Button } from './ui/button';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem } from './ui/dropdown-menu';

const languages = [
  { code: 'en', label: 'English' },
  { code: 'de', label: 'Deutsch' },
] as const;

export function LanguageToggle() {
  const { i18n } = useTranslation();
  const [announcement, setAnnouncement] = useState('');

  const changeLanguage = (code: string) => {
    if (code === i18n.language) return;
    i18n.changeLanguage(code);
    setAnnouncement(
      code === 'de' ? 'Sprache auf Deutsch umgestellt' : 'Language switched to English'
    );
  };

  return (
    <>
      <DropdownMenu.Root>
        <DropdownMenu.Trigger asChild>
          <Button
            variant='ghost'
            size='icon'
            aria-label={i18n.language === 'en' ? 'Switch to German' : 'Switch to English'}
          >
            <Languages />
          </Button>
        </DropdownMenu.Trigger>
        <DropdownMenuContent align='end'>
          {languages.map((lang) => (
            <DropdownMenuItem
              key={lang.code}
              disabled={lang.code === i18n.language}
              onSelect={() => changeLanguage(lang.code)}
            >
              {lang.label}
              {lang.code === i18n.language && (
                <span className='ml-auto text-xs text-muted-foreground'>✓</span>
              )}
            </DropdownMenuItem>
          ))}
        </DropdownMenuContent>
      </DropdownMenu.Root>
      <span className='sr-only' aria-live='polite' role='status'>
        {announcement}
      </span>
    </>
  );
}
