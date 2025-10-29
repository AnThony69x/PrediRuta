'use client';

import { useState, useEffect } from 'react';
import { type Locale, getCurrentLocale, getTranslation, setCurrentLocale } from '@/lib/i18n';

export function useTranslation() {
  const [locale, setLocale] = useState<Locale>(getCurrentLocale());

  useEffect(() => {
    // Escuchar cambios de idioma
    const handleLocaleChange = (event: CustomEvent<{ locale: Locale }>) => {
      setLocale(event.detail.locale);
    };

    window.addEventListener('localeChange', handleLocaleChange as EventListener);
    
    return () => {
      window.removeEventListener('localeChange', handleLocaleChange as EventListener);
    };
  }, []);

  const t = (key: string): string => {
    return getTranslation(key, locale);
  };

  const changeLocale = (newLocale: Locale) => {
    setCurrentLocale(newLocale);
    setLocale(newLocale);
  };

  return { t, locale, changeLocale };
}
