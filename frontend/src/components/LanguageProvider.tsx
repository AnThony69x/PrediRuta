'use client';

import { useEffect } from 'react';
import { type Locale, getCurrentLocale, setCurrentLocale } from '@/lib/i18n';

export function LanguageProvider() {
  useEffect(() => {
    // Aplicar idioma inmediatamente al montar
    const applyLanguage = () => {
      const savedLocale = getCurrentLocale();
      // Actualizar el atributo lang del HTML para accesibilidad
      document.documentElement.lang = savedLocale;
      document.documentElement.setAttribute('data-locale', savedLocale);
    };

    applyLanguage();

    // Escuchar cambios en el idioma desde setCurrentLocale o desde el selector
    const handleLocaleChange = (event: Event) => {
      const customEvent = event as CustomEvent<{ locale: Locale }>;
      const newLocale = customEvent.detail.locale;
      document.documentElement.lang = newLocale;
      document.documentElement.setAttribute('data-locale', newLocale);
    };

    window.addEventListener('localeChange', handleLocaleChange);

    // Escuchar cambios en localStorage desde otras pestañas o ventanas
    const handleStorageChange = (e: StorageEvent) => {
      if (e.key === 'locale' && e.newValue) {
        const newLocale = e.newValue as Locale;
        document.documentElement.lang = newLocale;
        document.documentElement.setAttribute('data-locale', newLocale);
        
        // Disparar evento para que los componentes se actualicen
        window.dispatchEvent(new CustomEvent('localeChange', { 
          detail: { locale: newLocale } 
        }));
      }
    };

    window.addEventListener('storage', handleStorageChange);

    return () => {
      window.removeEventListener('localeChange', handleLocaleChange);
      window.removeEventListener('storage', handleStorageChange);
    };
  }, []);

  return null;
}
