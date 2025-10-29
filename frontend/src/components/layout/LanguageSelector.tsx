'use client';

import { Globe } from 'lucide-react';
import { useTranslation } from '@/hooks/useTranslation';

export function LanguageSelector() {
  const { locale, changeLocale } = useTranslation();

  const handleChange = (newLang: 'es' | 'en') => {
    changeLocale(newLang);
  };

  return (
    <div className="relative">
      <label htmlFor="language-select" className="sr-only">
        Seleccionar idioma
      </label>
      
      <div className="flex items-center gap-2">
        <Globe className="w-4 h-4 text-white/80 dark:text-white/80" aria-hidden="true" />
        
        <select
          id="language-select"
          value={locale}
          onChange={(e) => handleChange(e.target.value as 'es' | 'en')}
          className="
            bg-white/10 backdrop-blur-sm
            border border-white/20
            text-white text-sm
            rounded-md
            px-3 py-1.5
            focus:outline-none focus:ring-2 focus:ring-white/50
            cursor-pointer
            appearance-none
            pr-8
            hover:bg-white/20
            transition-colors
          "
          aria-label="Seleccionar idioma de la interfaz"
        >
          <option value="es" className="bg-gray-800 text-white">
            🇪🇸 Español
          </option>
          <option value="en" className="bg-gray-800 text-white">
            🇬🇧 English
          </option>
        </select>

        {/* Icono de flecha personalizado */}
        <svg
          className="absolute right-2 top-1/2 -translate-y-1/2 w-4 h-4 text-white/60 pointer-events-none"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
          aria-hidden="true"
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
        </svg>
      </div>
    </div>
  );
}
