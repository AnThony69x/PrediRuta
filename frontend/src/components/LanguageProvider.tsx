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
    };

    applyLanguage();

    // Escuchar cambios en el idioma
    const handleLocaleChange = (event: CustomEvent<{ locale: Locale }>) => {
      document.documentElement.lang = event.detail.locale;
    };

    window.addEventListener('localeChange', handleLocaleChange as EventListener);

    // Escuchar cambios en localStorage desde otras pestañas
    const handleStorageChange = (e: StorageEvent) => {
      if (e.key === 'locale' && e.newValue) {
        document.documentElement.lang = e.newValue;
        // Disparar evento para que los componentes se actualicen
        window.dispatchEvent(new CustomEvent('localeChange', { 
          detail: { locale: e.newValue as Locale } 
        }));
      }
    };

    window.addEventListener('storage', handleStorageChange);

    return () => {
      window.removeEventListener('localeChange', handleLocaleChange as EventListener);
      window.removeEventListener('storage', handleStorageChange);
    };
  }, []);

  return null;
}
