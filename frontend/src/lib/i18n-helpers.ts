/**
 * Helper functions para manejo de internacionalización
 * Proporciona utilidades para trabajo con idiomas y traducciones
 */

import { type Locale, getCurrentLocale, setCurrentLocale as saveLocale } from './i18n';

/**
 * Obtiene el idioma actual o el default
 */
export function getActiveLocale(): Locale {
  if (typeof window === 'undefined') return 'es';
  return getCurrentLocale();
}

/**
 * Cambia el idioma y dispara evento de cambio
 * Sincroniza automáticamente en todas las pestañas
 */
export function changeLanguage(locale: Locale): void {
  if (typeof window === 'undefined') return;
  
  // Guardar en localStorage
  saveLocale(locale);
  
  // Actualizar atributo lang del HTML
  document.documentElement.lang = locale;
  document.documentElement.setAttribute('data-locale', locale);
  
  // Dispara evento para sincronizar componentes
  window.dispatchEvent(new CustomEvent('localeChange', { 
    detail: { locale } 
  }));
}

/**
 * Obtiene la etiqueta de idioma en texto legible
 */
export function getLanguageName(locale: Locale): string {
  const names: Record<Locale, string> = {
    es: 'Español',
    en: 'English',
  };
  return names[locale];
}

/**
 * Obtiene la bandera del país para un idioma
 */
export function getLanguageFlag(locale: Locale): string {
  const flags: Record<Locale, string> = {
    es: '🇪🇸',
    en: '🇺🇸',
  };
  return flags[locale];
}

/**
 * Valida si un locale es válido
 */
export function isValidLocale(locale: string): locale is Locale {
  return locale === 'es' || locale === 'en';
}

/**
 * Obtiene el locale del navegador como fallback
 */
export function getBrowserLocale(): Locale {
  if (typeof navigator === 'undefined') return 'es';
  
  const language = navigator.language.toLowerCase();
  
  if (language.startsWith('es')) return 'es';
  if (language.startsWith('en')) return 'en';
  
  return 'es'; // Default fallback
}

/**
 * Inicializa el idioma en la primera visita
 */
export function initializeLocale(): Locale {
  if (typeof window === 'undefined') return 'es';
  
  // 1. Verificar si hay idioma guardado en localStorage
  const saved = getCurrentLocale();
  if (saved) return saved;
  
  // 2. Intentar detectar del navegador
  const browserLocale = getBrowserLocale();
  saveLocale(browserLocale);
  
  return browserLocale;
}
