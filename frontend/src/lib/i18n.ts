'use client';

export type Locale = 'es' | 'en';

export const translations = {
  es: {
    // Header
    'header.logout': 'Salir',
    'header.login': 'Iniciar sesión',
    'header.register': 'Registrarse',
    'header.search': 'Buscar...',
    
    // Sidebar
    'sidebar.dashboard': 'Dashboard',
    'sidebar.routes': 'Rutas',
    'sidebar.predictions': 'Predicciones',
    'sidebar.history': 'Historial',
    'sidebar.settings': 'Configuración',
    'sidebar.assistant': 'Asistente Virtual',
    'sidebar.help': 'Ayuda y soporte',
    
    // Descriptions
    'sidebar.dashboard.desc': 'Panel principal',
    'sidebar.routes.desc': 'Planificar rutas',
    'sidebar.predictions.desc': 'Análisis de tráfico',
    'sidebar.history.desc': 'Rutas y predicciones recientes',
    'sidebar.settings.desc': 'Ajustes del sistema',
    'sidebar.assistant.desc': 'Chatbot de ayuda',
    
    // Dashboard
    'dashboard.title': 'Dashboard',
    'dashboard.subtitle': 'Aquí tienes una vista general del sistema',
    'dashboard.greeting.morning': 'Buenos días',
    'dashboard.greeting.afternoon': 'Buenas tardes',
    'dashboard.greeting.evening': 'Buenas noches',
    'dashboard.traffic.summary': 'Resumen de tráfico',
    'dashboard.traffic.map': 'Mapa de tráfico',
    'dashboard.traffic.map.hint': 'Usa "Mi ubicación" para centrar el mapa',
    'dashboard.traffic.nearby': 'Tráfico cercano',
    
    // Configuration
    'settings.title': 'Configuración',
    'settings.notifications': 'Notificaciones',
    'settings.routes': 'Preferencias de Rutas',
    'settings.language': 'Idioma y Región',
    'settings.privacy': 'Privacidad y Datos',
    'settings.appearance': 'Apariencia',
    'settings.save': 'Guardar cambios',
    'settings.reset': 'Restablecer valores predeterminados',
    'settings.darkMode': 'Modo oscuro',
    
    // Common
    'common.loading': 'Cargando...',
    'common.error': 'Error',
    'common.success': 'Éxito',
    'common.cancel': 'Cancelar',
    'common.confirm': 'Confirmar',
    'common.close': 'Cerrar',
    'common.save': 'Guardar',
    'common.update': 'Actualizar',
    'common.delete': 'Eliminar',
    'common.edit': 'Editar',
    'common.view': 'Ver',
    'common.search': 'Buscar',
    'common.filter': 'Filtrar',
    'common.export': 'Exportar',
    'common.import': 'Importar',
    'common.refresh': 'Actualizar',
    'common.back': 'Volver',
    'common.next': 'Siguiente',
    'common.previous': 'Anterior',
    'common.finish': 'Finalizar',
    'common.yes': 'Sí',
    'common.no': 'No',
    
    // Footer
    'footer.systemName': 'PrediRuta – Sistema de Predicción de Tráfico Vehicular',
    'footer.help': 'Ayuda',
    'footer.documentation': 'Documentación',
    'footer.contact': 'Contacto',
    'footer.rights': 'Todos los derechos reservados',
    'footer.version': 'Versión',
    
    // Routes Page
    'routes.title': 'Planificador de Rutas',
    'routes.subtitle': 'Encuentra la mejor ruta para tu destino',
    'routes.origin': 'Origen',
    'routes.destination': 'Destino',
    'routes.calculate': 'Calcular Ruta',
    'routes.myLocation': 'Mi ubicación',
    'routes.selectOnMap': 'Seleccionar en el mapa',
    'routes.distance': 'Distancia',
    'routes.duration': 'Duración estimada',
    'routes.traffic': 'Estado del tráfico',
    'routes.alternative': 'Ruta alternativa',
    'routes.fastest': 'Más rápida',
    'routes.shortest': 'Más corta',
    'routes.noTraffic': 'Sin tráfico',
    
    // Predictions Page
    'predictions.title': 'Predicciones de Tráfico',
    'predictions.subtitle': 'Análisis y pronósticos basados en IA',
    'predictions.selectArea': 'Seleccionar área',
    'predictions.selectTime': 'Seleccionar hora',
    'predictions.generatePrediction': 'Generar predicción',
    'predictions.historical': 'Datos históricos',
    'predictions.forecast': 'Pronóstico',
    'predictions.accuracy': 'Precisión del modelo',
    'predictions.confidence': 'Nivel de confianza',
    'predictions.viewDetails': 'Ver detalles',
    
    // History Page
    'history.title': 'Historial',
    'history.subtitle': 'Tus rutas y predicciones recientes',
    'history.routes': 'Rutas guardadas',
    'history.predictions': 'Predicciones anteriores',
    'history.date': 'Fecha',
    'history.time': 'Hora',
    'history.noHistory': 'No hay historial disponible',
    'history.clearAll': 'Limpiar todo',
    'history.viewDetails': 'Ver detalles',
    
    // Profile Page
    'profile.title': 'Mi Perfil',
    'profile.personalInfo': 'Información Personal',
    'profile.name': 'Nombre',
    'profile.email': 'Correo Electrónico',
    'profile.phone': 'Teléfono',
    'profile.address': 'Dirección',
    'profile.editProfile': 'Editar perfil',
    'profile.changePassword': 'Cambiar contraseña',
    'profile.preferences': 'Preferencias',
    'profile.notifications': 'Notificaciones',
    
    // Auth
    'auth.login': 'Iniciar Sesión',
    'auth.register': 'Registrarse',
    'auth.email': 'Correo Electrónico',
    'auth.password': 'Contraseña',
    'auth.confirmPassword': 'Confirmar Contraseña',
    'auth.forgotPassword': 'Olvidé mi contraseña',
    'auth.rememberMe': 'Recordarme',
    'auth.noAccount': '¿No tienes cuenta?',
    'auth.hasAccount': '¿Ya tienes cuenta?',
    'auth.createAccount': 'Crear cuenta',
    'auth.signInWithGoogle': 'Continuar con Google',
    'auth.signInWithGithub': 'Continuar con GitHub',
    
    // Accessibility
    'accessibility.widget': 'Accesibilidad',
    'accessibility.increaseText': 'Aumentar texto',
    'accessibility.decreaseText': 'Reducir texto',
    'accessibility.highContrast': 'Alto contraste',
    'accessibility.resetText': 'Restablecer tamaño',
    'accessibility.screenReader': 'Lector de pantalla',
    
    // Notifications
    'notifications.title': 'Notificaciones',
    'notifications.markAsRead': 'Marcar como leído',
    'notifications.markAllAsRead': 'Marcar todas como leídas',
    'notifications.noNotifications': 'No hay notificaciones',
    'notifications.settings': 'Configuración de notificaciones',
    
    // Traffic Levels
    'traffic.free': 'Fluido',
    'traffic.moderate': 'Moderado',
    'traffic.heavy': 'Pesado',
    'traffic.severe': 'Severo',
    'traffic.unknown': 'Desconocido',
    
    // Errors
    'error.generic': 'Ha ocurrido un error',
    'error.network': 'Error de conexión',
    'error.notFound': 'No encontrado',
    'error.unauthorized': 'No autorizado',
    'error.forbidden': 'Acceso denegado',
    'error.serverError': 'Error del servidor',
    'error.tryAgain': 'Intentar nuevamente',
  },
  en: {
    // Header
    'header.logout': 'Logout',
    'header.login': 'Login',
    'header.register': 'Register',
    'header.search': 'Search...',
    
    // Sidebar
    'sidebar.dashboard': 'Dashboard',
    'sidebar.routes': 'Routes',
    'sidebar.predictions': 'Predictions',
    'sidebar.history': 'History',
    'sidebar.settings': 'Settings',
    'sidebar.assistant': 'Virtual Assistant',
    'sidebar.help': 'Help & Support',
    
    // Descriptions
    'sidebar.dashboard.desc': 'Main panel',
    'sidebar.routes.desc': 'Plan routes',
    'sidebar.predictions.desc': 'Traffic analysis',
    'sidebar.history.desc': 'Recent routes and predictions',
    'sidebar.settings.desc': 'System settings',
    'sidebar.assistant.desc': 'Help chatbot',
    
    // Dashboard
    'dashboard.title': 'Dashboard',
    'dashboard.subtitle': 'Here you have an overview of the system',
    'dashboard.greeting.morning': 'Good morning',
    'dashboard.greeting.afternoon': 'Good afternoon',
    'dashboard.greeting.evening': 'Good evening',
    'dashboard.traffic.summary': 'Traffic Summary',
    'dashboard.traffic.map': 'Traffic Map',
    'dashboard.traffic.map.hint': 'Use "My location" to center the map',
    'dashboard.traffic.nearby': 'Nearby Traffic',
    
    // Configuration
    'settings.title': 'Settings',
    'settings.notifications': 'Notifications',
    'settings.routes': 'Route Preferences',
    'settings.language': 'Language & Region',
    'settings.privacy': 'Privacy & Data',
    'settings.appearance': 'Appearance',
    'settings.save': 'Save changes',
    'settings.reset': 'Reset to defaults',
    'settings.darkMode': 'Dark mode',
    
    // Common
    'common.loading': 'Loading...',
    'common.error': 'Error',
    'common.success': 'Success',
    'common.cancel': 'Cancel',
    'common.confirm': 'Confirm',
    'common.close': 'Close',
    'common.save': 'Save',
    'common.update': 'Update',
    'common.delete': 'Delete',
    'common.edit': 'Edit',
    'common.view': 'View',
    'common.search': 'Search',
    'common.filter': 'Filter',
    'common.export': 'Export',
    'common.import': 'Import',
    'common.refresh': 'Refresh',
    'common.back': 'Back',
    'common.next': 'Next',
    'common.previous': 'Previous',
    'common.finish': 'Finish',
    'common.yes': 'Yes',
    'common.no': 'No',
    
    // Footer
    'footer.systemName': 'PrediRuta – Vehicle Traffic Prediction System',
    'footer.help': 'Help',
    'footer.documentation': 'Documentation',
    'footer.contact': 'Contact',
    'footer.rights': 'All rights reserved',
    'footer.version': 'Version',
    
    // Routes Page
    'routes.title': 'Route Planner',
    'routes.subtitle': 'Find the best route to your destination',
    'routes.origin': 'Origin',
    'routes.destination': 'Destination',
    'routes.calculate': 'Calculate Route',
    'routes.myLocation': 'My location',
    'routes.selectOnMap': 'Select on map',
    'routes.distance': 'Distance',
    'routes.duration': 'Estimated duration',
    'routes.traffic': 'Traffic status',
    'routes.alternative': 'Alternative route',
    'routes.fastest': 'Fastest',
    'routes.shortest': 'Shortest',
    'routes.noTraffic': 'No traffic',
    
    // Predictions Page
    'predictions.title': 'Traffic Predictions',
    'predictions.subtitle': 'AI-based analysis and forecasts',
    'predictions.selectArea': 'Select area',
    'predictions.selectTime': 'Select time',
    'predictions.generatePrediction': 'Generate prediction',
    'predictions.historical': 'Historical data',
    'predictions.forecast': 'Forecast',
    'predictions.accuracy': 'Model accuracy',
    'predictions.confidence': 'Confidence level',
    'predictions.viewDetails': 'View details',
    
    // History Page
    'history.title': 'History',
    'history.subtitle': 'Your recent routes and predictions',
    'history.routes': 'Saved routes',
    'history.predictions': 'Previous predictions',
    'history.date': 'Date',
    'history.time': 'Time',
    'history.noHistory': 'No history available',
    'history.clearAll': 'Clear all',
    'history.viewDetails': 'View details',
    
    // Profile Page
    'profile.title': 'My Profile',
    'profile.personalInfo': 'Personal Information',
    'profile.name': 'Name',
    'profile.email': 'Email',
    'profile.phone': 'Phone',
    'profile.address': 'Address',
    'profile.editProfile': 'Edit profile',
    'profile.changePassword': 'Change password',
    'profile.preferences': 'Preferences',
    'profile.notifications': 'Notifications',
    
    // Auth
    'auth.login': 'Sign In',
    'auth.register': 'Sign Up',
    'auth.email': 'Email',
    'auth.password': 'Password',
    'auth.confirmPassword': 'Confirm Password',
    'auth.forgotPassword': 'Forgot password?',
    'auth.rememberMe': 'Remember me',
    'auth.noAccount': "Don't have an account?",
    'auth.hasAccount': 'Already have an account?',
    'auth.createAccount': 'Create account',
    'auth.signInWithGoogle': 'Continue with Google',
    'auth.signInWithGithub': 'Continue with GitHub',
    
    // Accessibility
    'accessibility.widget': 'Accessibility',
    'accessibility.increaseText': 'Increase text',
    'accessibility.decreaseText': 'Decrease text',
    'accessibility.highContrast': 'High contrast',
    'accessibility.resetText': 'Reset text size',
    'accessibility.screenReader': 'Screen reader',
    
    // Notifications
    'notifications.title': 'Notifications',
    'notifications.markAsRead': 'Mark as read',
    'notifications.markAllAsRead': 'Mark all as read',
    'notifications.noNotifications': 'No notifications',
    'notifications.settings': 'Notification settings',
    
    // Traffic Levels
    'traffic.free': 'Free flow',
    'traffic.moderate': 'Moderate',
    'traffic.heavy': 'Heavy',
    'traffic.severe': 'Severe',
    'traffic.unknown': 'Unknown',
    
    // Errors
    'error.generic': 'An error occurred',
    'error.network': 'Network error',
    'error.notFound': 'Not found',
    'error.unauthorized': 'Unauthorized',
    'error.forbidden': 'Access denied',
    'error.serverError': 'Server error',
    'error.tryAgain': 'Try again',
  },
};

export function getTranslation(key: string, locale: Locale = 'es'): string {
  // Acceder directamente a la clave completa (no dividir por puntos)
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
  // Disparar evento personalizado para notificar cambio
  window.dispatchEvent(new CustomEvent('localeChange', { detail: { locale } }));
}
