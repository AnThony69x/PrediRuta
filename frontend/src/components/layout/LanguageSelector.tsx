'use client';

import { useState } from 'react';
import { Globe } from 'lucide-react';

// TODO: Implementar i18n real con next-intl
// 1. npm install next-intl
// 2. Configurar middleware para rutas con locale (/es/dashboard, /en/dashboard)
// 3. Crear archivos de traducción en /i18n/messages/es.json y /i18n/messages/en.json
// 4. Usar useLocale() y useTranslations() de next-intl
// 5. Actualizar este componente para cambiar locale real

export function LanguageSelector() {
  const [lang, setLang] = useState('es');

  const handleChange = (newLang: string) => {
    setLang(newLang);
    
    // TODO: Cambiar idioma real de la aplicación
    // const router = useRouter();
    // const pathname = usePathname();
    // router.push(pathname.replace(`/${lang}`, `/${newLang}`));
    
    console.warn('TODO: Implementar cambio de idioma real con next-intl');
  };

  return (
    <div className="relative">
      <label htmlFor="language-select" className="sr-only">
        Seleccionar idioma
      </label>
      
      <div className="flex items-center gap-2">
        <Globe className="w-4 h-4 text-white/80" aria-hidden="true" />
        
        <select
          id="language-select"
          value={lang}
          onChange={(e) => handleChange(e.target.value)}
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

      {/* Nota temporal de desarrollo */}
      {process.env.NODE_ENV === 'development' && (
        <div className="absolute top-full mt-1 right-0 w-64 bg-yellow-100 dark:bg-yellow-900 text-yellow-900 dark:text-yellow-100 text-xs p-2 rounded shadow-lg z-50">
          ⚠️ DEV: Selector de idioma no funcional. Requiere implementación de next-intl.
        </div>
      )}
    </div>
  );
}
