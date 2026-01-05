'use client';

import { useState, useEffect, useCallback } from 'react';
import { type Locale, getCurrentLocale, getTranslation, setCurrentLocale } from '@/lib/i18n';

export function useTranslation() {
  // Usar 'es' como default durante SSR para evitar hydration mismatch
  const [locale, setLocale] = useState<Locale>('es');
  const [isClient, setIsClient] = useState(false);

  // Efecto para inicializar en el cliente
  useEffect(() => {
    setIsClient(true);
    const currentLocale = getCurrentLocale();
    setLocale(currentLocale);
  }, []);

  // Efecto para escuchar cambios de idioma desde otros componentes o pestañas
  useEffect(() => {
    const handleLocaleChange = (event: Event) => {
      const customEvent = event as CustomEvent<{ locale: Locale }>;
      setLocale(customEvent.detail.locale);
    };

    window.addEventListener('localeChange', handleLocaleChange);
    
    // Escuchar cambios en localStorage desde otras pestañas
    const handleStorageChange = (e: StorageEvent) => {
      if (e.key === 'locale' && e.newValue) {
        setLocale(e.newValue as Locale);
      }
    };

    window.addEventListener('storage', handleStorageChange);

    return () => {
      window.removeEventListener('localeChange', handleLocaleChange);
      window.removeEventListener('storage', handleStorageChange);
    };
  }, []);

  // Función de traducción memoizada
  const t = useCallback((key: string): string => {
    return getTranslation(key, locale);
  }, [locale]);

  // Función para cambiar idioma
  const changeLocale = useCallback((newLocale: Locale) => {
    setLocale(newLocale);
    setCurrentLocale(newLocale);
  }, []);

  return { t, locale, changeLocale, isClient };
}
