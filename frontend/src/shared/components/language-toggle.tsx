import { Languages } from 'lucide-react';
import { useState } from 'react';
import { useTranslation } from 'react-i18next';

import { Button } from './ui/button';

export function LanguageToggle() {
  const { i18n } = useTranslation();
  const [announcement, setAnnouncement] = useState('');

  const toggleLanguage = () => {
    const next = i18n.language === 'en' ? 'de' : 'en';
    i18n.changeLanguage(next);
    setAnnouncement(
      next === 'de' ? 'Sprache auf Deutsch umgestellt' : 'Language switched to English',
    );
  };

  return (
    <>
      <Button
        variant="ghost"
        size="icon"
        lang="en"
        aria-label={i18n.language === 'en' ? 'Switch to German' : 'Switch to English'}
        onClick={toggleLanguage}
      >
        <Languages />
      </Button>
      <span className="sr-only" aria-live="polite" role="status">
        {announcement}
      </span>
    </>
  );
}
