'use client';

export type Locale = 'es' | 'en';

export const translations = {
  es: {
    // Header
  'header.logout': 'Cerrar sesión',
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
    
    // Landing Page
    'landing.hero.title': 'Optimiza tus rutas con IA',
    'landing.hero.subtitle': 'Sistema inteligente de predicción de tráfico y optimización de rutas que te ayuda a llegar más rápido a tu destino.',
    'landing.hero.cta.start': 'Comenzar Gratis',
    'landing.hero.cta.login': 'Iniciar Sesión',
    
    'landing.features.prediction.title': 'Predicción Inteligente',
    'landing.features.prediction.desc': 'Algoritmos avanzados que predicen el tráfico en tiempo real para optimizar tus rutas.',
    'landing.features.routes.title': 'Rutas Optimizadas',
    'landing.features.routes.desc': 'Encuentra las mejores rutas considerando tráfico, distancia y tiempo de viaje.',
    'landing.features.dashboard.title': 'Dashboard Completo',
    'landing.features.dashboard.desc': 'Visualiza estadísticas detalladas de tus viajes y mejora tu planificación.',
    
    'landing.section1.title': 'Predicción Inteligente de Tráfico',
    'landing.section1.desc': 'Nuestros algoritmos de inteligencia artificial analizan patrones de tráfico históricos, eventos en tiempo real y condiciones climáticas para predecir el flujo vehicular.',
    'landing.section1.feature1.title': 'Análisis en Tiempo Real',
    'landing.section1.feature1.desc': 'Procesamiento continuo de datos de tráfico actuales',
    'landing.section1.feature2.title': 'Aprendizaje Automático',
    'landing.section1.feature2.desc': 'El sistema mejora sus predicciones con cada viaje',
    'landing.section1.feature3.title': 'Precisión del 95%',
    'landing.section1.feature3.desc': 'Predicciones altamente confiables para tu planificación',
    'landing.section1.badge': 'IA en Acción',
    
    'landing.section2.title': 'Rutas Optimizadas para Cada Situación',
    'landing.section2.desc': 'Calculamos múltiples rutas alternativas considerando todos los factores que afectan tu viaje, desde el tráfico hasta las preferencias personales.',
    'landing.section2.feature1.title': 'Múltiples Opciones',
    'landing.section2.feature1.desc': 'Ruta más rápida, más corta o más económica',
    'landing.section2.feature2.title': 'Evita Congestiones',
    'landing.section2.feature2.desc': 'Actualización automática ante cambios de tráfico',
    'landing.section2.feature3.title': 'Personalización',
    'landing.section2.feature3.desc': 'Adapta las rutas según tus preferencias de conducción',
    'landing.section2.badge': 'Rutas Inteligentes',
    
    'landing.section3.title': 'Dashboard de Análisis Avanzado',
    'landing.section3.desc': 'Obtén insights detallados sobre tus patrones de viaje, ahorra tiempo y combustible con estadísticas personalizadas y recomendaciones inteligentes.',
    'landing.section3.feature1.title': 'Estadísticas Detalladas',
    'landing.section3.feature1.desc': 'Tiempo ahorrado, combustible y emisiones reducidas',
    'landing.section3.feature2.title': 'Historial de Viajes',
    'landing.section3.feature2.desc': 'Registro completo con métricas de rendimiento',
    'landing.section3.feature3.title': 'Reportes Personalizados',
    'landing.section3.feature3.desc': 'Exporta datos para análisis empresarial o personal',
    'landing.section3.badge': 'Analytics Avanzados',
    
    'landing.benefits.title': 'Más que una App de Rutas',
    'landing.benefits.speed.title': 'Velocidad',
    'landing.benefits.speed.desc': 'Reduce hasta un 30% el tiempo de viaje con nuestras predicciones inteligentes',
    'landing.benefits.savings.title': 'Ahorro',
    'landing.benefits.savings.desc': 'Optimiza el consumo de combustible y reduce costos operativos',
    'landing.benefits.sustainability.title': 'Sostenibilidad',
    'landing.benefits.sustainability.desc': 'Contribuye al medio ambiente reduciendo emisiones de CO₂',
    
    'landing.cta.title': '¿Listo para Optimizar tus Rutas?',
    'landing.cta.subtitle': 'Únete a miles de usuarios que ya están ahorrando tiempo y dinero con PrediRuta. Comienza tu prueba gratuita hoy mismo.',
    'landing.cta.start': 'Comenzar Ahora - Gratis',
    'landing.cta.demo': 'Ver Demo',
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
    
    // Landing Page
    'landing.hero.title': 'Optimize Your Routes with AI',
    'landing.hero.subtitle': 'Intelligent traffic prediction and route optimization system that helps you reach your destination faster.',
    'landing.hero.cta.start': 'Start Free',
    'landing.hero.cta.login': 'Sign In',
    
    'landing.features.prediction.title': 'Intelligent Prediction',
    'landing.features.prediction.desc': 'Advanced algorithms that predict traffic in real-time to optimize your routes.',
    'landing.features.routes.title': 'Optimized Routes',
    'landing.features.routes.desc': 'Find the best routes considering traffic, distance, and travel time.',
    'landing.features.dashboard.title': 'Complete Dashboard',
    'landing.features.dashboard.desc': 'View detailed statistics of your trips and improve your planning.',
    
    'landing.section1.title': 'Intelligent Traffic Prediction',
    'landing.section1.desc': 'Our artificial intelligence algorithms analyze historical traffic patterns, real-time events, and weather conditions to predict traffic flow.',
    'landing.section1.feature1.title': 'Real-Time Analysis',
    'landing.section1.feature1.desc': 'Continuous processing of current traffic data',
    'landing.section1.feature2.title': 'Machine Learning',
    'landing.section1.feature2.desc': 'The system improves its predictions with each trip',
    'landing.section1.feature3.title': '95% Accuracy',
    'landing.section1.feature3.desc': 'Highly reliable predictions for your planning',
    'landing.section1.badge': 'AI in Action',
    
    'landing.section2.title': 'Optimized Routes for Every Situation',
    'landing.section2.desc': 'We calculate multiple alternative routes considering all factors that affect your trip, from traffic to personal preferences.',
    'landing.section2.feature1.title': 'Multiple Options',
    'landing.section2.feature1.desc': 'Fastest, shortest, or most economical route',
    'landing.section2.feature2.title': 'Avoid Congestion',
    'landing.section2.feature2.desc': 'Automatic update for traffic changes',
    'landing.section2.feature3.title': 'Customization',
    'landing.section2.feature3.desc': 'Adapt routes to your driving preferences',
    'landing.section2.badge': 'Smart Routes',
    
    'landing.section3.title': 'Advanced Analytics Dashboard',
    'landing.section3.desc': 'Get detailed insights about your travel patterns, save time and fuel with personalized statistics and intelligent recommendations.',
    'landing.section3.feature1.title': 'Detailed Statistics',
    'landing.section3.feature1.desc': 'Time saved, fuel and reduced emissions',
    'landing.section3.feature2.title': 'Trip History',
    'landing.section3.feature2.desc': 'Complete log with performance metrics',
    'landing.section3.feature3.title': 'Custom Reports',
    'landing.section3.feature3.desc': 'Export data for business or personal analysis',
    'landing.section3.badge': 'Advanced Analytics',
    
    'landing.benefits.title': 'More Than a Route App',
    'landing.benefits.speed.title': 'Speed',
    'landing.benefits.speed.desc': 'Reduce travel time by up to 30% with our intelligent predictions',
    'landing.benefits.savings.title': 'Savings',
    'landing.benefits.savings.desc': 'Optimize fuel consumption and reduce operating costs',
    'landing.benefits.sustainability.title': 'Sustainability',
    'landing.benefits.sustainability.desc': 'Contribute to the environment by reducing CO₂ emissions',
    
    'landing.cta.title': 'Ready to Optimize Your Routes?',
    'landing.cta.subtitle': 'Join thousands of users who are already saving time and money with PrediRuta. Start your free trial today.',
    'landing.cta.start': 'Start Now - Free',
    'landing.cta.demo': 'View Demo',
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
