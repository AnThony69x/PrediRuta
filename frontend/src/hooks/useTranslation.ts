'use client';

import { useState, useEffect } from 'react';
import { type Locale, getCurrentLocale, getTranslation, setCurrentLocale } from '@/lib/i18n';

export function useTranslation() {
  // Usar 'es' como default durante SSR para evitar hydration mismatch
  const [locale, setLocale] = useState<Locale>('es');
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    // Actualizar al idioma real solo en el cliente
    setIsClient(true);
    setLocale(getCurrentLocale());
  }, []);

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
