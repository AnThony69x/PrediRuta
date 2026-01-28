'use client';

// Import modular translations
import commonEs from '../i18n/locales/es/common.json';
import commonEn from '../i18n/locales/en/common.json';
import authEs from '../i18n/locales/es/auth.json';
import authEn from '../i18n/locales/en/auth.json';
import headerEs from '../i18n/locales/es/header.json';
import headerEn from '../i18n/locales/en/header.json';
import accessibilityEs from '../i18n/locales/es/accessibility.json';
import accessibilityEn from '../i18n/locales/en/accessibility.json';
import landingEs from '../i18n/locales/es/landing.json';
import landingEn from '../i18n/locales/en/landing.json';
import dashboardEs from '../i18n/locales/es/dashboard.json';
import dashboardEn from '../i18n/locales/en/dashboard.json';

export type Locale = 'es' | 'en';

// Flatten nested objects for easy access with dot notation
function flattenObject(obj: any, prefix = ''): Record<string, string> {
  return Object.keys(obj).reduce((acc, key) => {
    const value = obj[key];
    const newKey = prefix ? `${prefix}.${key}` : key;
    
    if (typeof value === 'object' && value !== null && !Array.isArray(value)) {
      Object.assign(acc, flattenObject(value, newKey));
    } else {
      acc[newKey] = value;
    }
    
    return acc;
  }, {} as Record<string, string>);
}

export const translations = {
  es: flattenObject({
    header: headerEs,
    common: commonEs,
    auth: authEs,
    accessibility: accessibilityEs,
    landing: landingEs,
    dashboard: dashboardEs,
    // Temporary inline translations for features not yet modularized
    sidebar: {
      dashboard: 'Dashboard',
      routes: 'Rutas',
      predictions: 'Predicciones',
      history: 'Historial',
      settings: 'Configuración',
      assistant: 'Asistente Virtual',
      help: 'Ayuda y soporte',
      'dashboard.desc': 'Panel principal',
      'routes.desc': 'Planificar rutas',
      'predictions.desc': 'Análisis de tráfico',
      'history.desc': 'Rutas y predicciones recientes',
      'settings.desc': 'Ajustes del sistema',
      'assistant.desc': 'Chatbot de ayuda',
    },
    settings: {
      title: 'Configuración',
      notifications: 'Notificaciones',
      routes: 'Preferencias de Rutas',
      language: 'Idioma y Región',
      privacy: 'Privacidad y Datos',
      appearance: 'Apariencia',
      save: 'Guardar cambios',
      reset: 'Restablecer valores predeterminados',
      darkMode: 'Modo oscuro',
    },
    footer: {
      systemName: 'PrediRuta – Sistema de Predicción de Tráfico Vehicular',
      help: 'Ayuda',
      documentation: 'Recursos',
      contact: 'Contacto',
      rights: 'Todos los derechos reservados',
      version: 'Versión',
    },
    routes: {
      title: 'Planificador de Rutas',
      subtitle: 'Encuentra la mejor ruta para tu destino',
      origin: 'Origen',
      destination: 'Destino',
      calculate: 'Calcular Ruta',
      myLocation: 'Mi ubicación',
      selectOnMap: 'Seleccionar en el mapa',
      distance: 'Distancia',
      duration: 'Duración estimada',
      traffic: 'Estado del tráfico',
      alternative: 'Ruta alternativa',
      fastest: 'Más rápida',
      shortest: 'Más corta',
      noTraffic: 'Sin tráfico',
    },
    predictions: {
      title: 'Predicciones de Tráfico',
      subtitle: 'Análisis y pronósticos basados en IA',
      selectArea: 'Seleccionar área',
      selectTime: 'Seleccionar hora',
      generatePrediction: 'Generar predicción',
      historical: 'Datos históricos',
      forecast: 'Pronóstico',
      accuracy: 'Precisión del modelo',
      confidence: 'Nivel de confianza',
      viewDetails: 'Ver detalles',
    },
    history: {
      title: 'Historial',
      subtitle: 'Tus rutas y predicciones recientes',
      routes: 'Rutas guardadas',
      predictions: 'Predicciones anteriores',
      date: 'Fecha',
      time: 'Hora',
      noHistory: 'No hay historial disponible',
      clearAll: 'Limpiar todo',
      viewDetails: 'Ver detalles',
    },
    profile: {
      title: 'Mi Perfil',
      personalInfo: 'Información Personal',
      name: 'Nombre',
      email: 'Correo Electrónico',
      phone: 'Teléfono',
      address: 'Dirección',
      editProfile: 'Editar perfil',
      changePassword: 'Cambiar contraseña',
      preferences: 'Preferencias',
      notifications: 'Notificaciones',
    },
    notifications: {
      title: 'Notificaciones',
      markAsRead: 'Marcar como leído',
      markAllAsRead: 'Marcar todas como leídas',
      noNotifications: 'No hay notificaciones',
      settings: 'Configuración de notificaciones',
    },
    traffic: {
      free: 'Fluido',
      moderate: 'Moderado',
      heavy: 'Pesado',
      severe: 'Severo',
      unknown: 'Desconocido',
    },
    error: {
      generic: 'Ha ocurrido un error',
      network: 'Error de conexión',
      notFound: 'No encontrado',
      unauthorized: 'No autorizado',
      forbidden: 'Acceso denegado',
      serverError: 'Error del servidor',
      tryAgain: 'Intentar nuevamente',
    },
  }),
  en: flattenObject({
    header: headerEn,
    common: commonEn,
    auth: authEn,
    accessibility: accessibilityEn,
    landing: landingEn,
    dashboard: dashboardEn,
    // Temporary inline translations for features not yet modularized
    sidebar: {
      dashboard: 'Dashboard',
      routes: 'Routes',
      predictions: 'Predictions',
      history: 'History',
      settings: 'Settings',
      assistant: 'Virtual Assistant',
      help: 'Help & Support',
      'dashboard.desc': 'Main panel',
      'routes.desc': 'Plan routes',
      'predictions.desc': 'Traffic analysis',
      'history.desc': 'Recent routes and predictions',
      'settings.desc': 'System settings',
      'assistant.desc': 'Help chatbot',
    },
    settings: {
      title: 'Settings',
      notifications: 'Notifications',
      routes: 'Route Preferences',
      language: 'Language & Region',
      privacy: 'Privacy & Data',
      appearance: 'Appearance',
      save: 'Save changes',
      reset: 'Reset to defaults',
      darkMode: 'Dark mode',
    },
    footer: {
      systemName: 'PrediRuta – Vehicle Traffic Prediction System',
      help: 'Help',
      documentation: 'Documentation',
      contact: 'Contact',
      rights: 'All rights reserved',
      version: 'Version',
    },
    routes: {
      title: 'Route Planner',
      subtitle: 'Find the best route to your destination',
      origin: 'Origin',
      destination: 'Destination',
      calculate: 'Calculate Route',
      myLocation: 'My location',
      selectOnMap: 'Select on map',
      distance: 'Distance',
      duration: 'Estimated duration',
      traffic: 'Traffic status',
      alternative: 'Alternative route',
      fastest: 'Fastest',
      shortest: 'Shortest',
      noTraffic: 'No traffic',
    },
    predictions: {
      title: 'Traffic Predictions',
      subtitle: 'AI-based analysis and forecasts',
      selectArea: 'Select area',
      selectTime: 'Select time',
      generatePrediction: 'Generate prediction',
      historical: 'Historical data',
      forecast: 'Forecast',
      accuracy: 'Model accuracy',
      confidence: 'Confidence level',
      viewDetails: 'View details',
    },
    history: {
      title: 'History',
      subtitle: 'Your recent routes and predictions',
      routes: 'Saved routes',
      predictions: 'Previous predictions',
      date: 'Date',
      time: 'Time',
      noHistory: 'No history available',
      clearAll: 'Clear all',
      viewDetails: 'View details',
    },
    profile: {
      title: 'My Profile',
      personalInfo: 'Personal Information',
      name: 'Name',
      email: 'Email',
      phone: 'Phone',
      address: 'Address',
      editProfile: 'Edit profile',
      changePassword: 'Change password',
      preferences: 'Preferences',
      notifications: 'Notifications',
    },
    notifications: {
      title: 'Notifications',
      markAsRead: 'Mark as read',
      markAllAsRead: 'Mark all as read',
      noNotifications: 'No notifications',
      settings: 'Notification settings',
    },
    traffic: {
      free: 'Free flow',
      moderate: 'Moderate',
      heavy: 'Heavy',
      severe: 'Severe',
      unknown: 'Unknown',
    },
    error: {
      generic: 'An error occurred',
      network: 'Connection error',
      notFound: 'Not found',
      unauthorized: 'Unauthorized',
      forbidden: 'Access denied',
      serverError: 'Server error',
      tryAgain: 'Try again',
    },
  }),
};

export function getTranslation(key: string, locale: Locale = 'es'): string {
  const value = translations[locale][key as keyof typeof translations.es];
  return typeof value === 'string' ? value : key;
}

export function getCurrentLocale(): Locale {
  if (typeof window === 'undefined') return 'es';
  return (localStorage.getItem('locale') as Locale) || 'es';
}

export function setCurrentLocale(locale: Locale): void {
  if (typeof window === 'undefined') return;
  localStorage.setItem('locale', locale);
  window.dispatchEvent(new CustomEvent('localeChange', { detail: { locale } }));
}
