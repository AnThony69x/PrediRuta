import Link from "next/link";
import { ThemeToggle } from "../components/ThemeToggle";

export default function Home() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-cyan-50 dark:from-gray-900 dark:via-blue-900 dark:to-indigo-900 transition-colors duration-300">
      {/* Header con navegación */}
      <header className="bg-gradient-to-r from-blue-600 via-blue-700 to-cyan-600 dark:from-blue-800 dark:via-gray-800 dark:to-indigo-800 shadow-lg">
        <div className="container mx-auto px-4 py-3 flex justify-between items-center">
          <h1 className="text-xl sm:text-2xl font-bold text-white">PrediRuta</h1>
          <div className="flex flex-row gap-3 sm:gap-4 items-center">
            <ThemeToggle />
            <Link 
              href="/login" 
              className="px-4 py-2 text-sm font-medium text-white hover:text-cyan-200 dark:hover:text-cyan-300 hover:scale-105 transition-all duration-300"
            >
              Inicia sesión
            </Link>
            <Link 
              href="/register" 
              className="px-4 py-2 text-sm font-medium text-blue-600 dark:text-blue-400 bg-white dark:bg-gray-800 rounded-full hover:bg-gradient-to-r hover:from-blue-50 hover:to-cyan-50 dark:hover:from-gray-700 dark:hover:to-gray-600 hover:text-blue-700 dark:hover:text-blue-300 hover:scale-105 transform transition-all duration-300 shadow-md"
            >
              Regístrate
            </Link>
          </div>
        </div>
      </header>

      {/* Contenido principal */}
      <main className="container mx-auto px-4 py-8 sm:py-12">
        <div className="text-center mb-8 sm:mb-12">
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold text-gray-800 dark:text-white mb-4 sm:mb-6 px-4">
            Optimiza tus rutas con IA
          </h2>
          <p className="text-lg sm:text-xl text-gray-600 dark:text-gray-300 mb-6 sm:mb-8 max-w-2xl mx-auto px-4">
            Sistema inteligente de predicción de tráfico y optimización de rutas 
            que te ayuda a llegar más rápido a tu destino.
          </p>
          
          {/* Botones de acción principales */}
          <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 justify-center px-4">
            <Link 
              href="/register" 
              className="px-8 py-3 bg-gradient-to-r from-blue-600 to-cyan-600 dark:from-blue-700 dark:to-cyan-700 text-white rounded-full hover:from-blue-700 hover:to-cyan-700 dark:hover:from-blue-600 dark:hover:to-cyan-600 hover:scale-105 transform transition-all duration-300 text-base sm:text-lg font-medium text-center shadow-lg hover:shadow-xl"
            >
              Comenzar Gratis
            </Link>
            <Link 
              href="/login" 
              className="px-8 py-3 bg-gradient-to-r from-white to-gray-50 dark:from-gray-800 dark:to-gray-700 border-2 border-blue-500 dark:border-blue-400 text-blue-600 dark:text-blue-400 rounded-full hover:from-blue-50 hover:to-cyan-50 dark:hover:from-gray-700 dark:hover:to-gray-600 hover:scale-105 transform transition-all duration-300 text-base sm:text-lg font-medium text-center shadow-md hover:shadow-lg"
            >
              Iniciar Sesión
            </Link>
          </div>
        </div>
        
        {/* Características principales */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8 max-w-4xl mx-auto px-4">
          <div className="bg-gradient-to-br from-white to-blue-50 dark:from-gray-800 dark:to-blue-900/50 p-4 sm:p-6 rounded-xl shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-300 text-center border border-blue-100 dark:border-blue-800">
            <div className="w-10 h-10 sm:w-12 sm:h-12 bg-gradient-to-br from-blue-500 to-cyan-500 dark:from-blue-600 dark:to-cyan-600 rounded-lg flex items-center justify-center mx-auto mb-3 sm:mb-4 shadow-md">
              <span className="text-lg sm:text-xl">🔮</span>
            </div>
            <h3 className="text-lg sm:text-xl font-semibold mb-2 sm:mb-3 text-gray-800 dark:text-white">Predicción Inteligente</h3>
            <p className="text-sm sm:text-base text-gray-600 dark:text-gray-300">
              Algoritmos avanzados que predicen el tráfico en tiempo real 
              para optimizar tus rutas.
            </p>
          </div>
          
          <div className="bg-gradient-to-br from-white to-emerald-50 dark:from-gray-800 dark:to-emerald-900/50 p-4 sm:p-6 rounded-xl shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-300 text-center border border-emerald-100 dark:border-emerald-800">
            <div className="w-10 h-10 sm:w-12 sm:h-12 bg-gradient-to-br from-emerald-500 to-teal-500 dark:from-emerald-600 dark:to-teal-600 rounded-lg flex items-center justify-center mx-auto mb-3 sm:mb-4 shadow-md">
              <span className="text-lg sm:text-xl">🗺️</span>
            </div>
            <h3 className="text-lg sm:text-xl font-semibold mb-2 sm:mb-3 text-gray-800 dark:text-white">Rutas Optimizadas</h3>
            <p className="text-sm sm:text-base text-gray-600 dark:text-gray-300">
              Encuentra las mejores rutas considerando tráfico, distancia 
              y tiempo de viaje.
            </p>
          </div>
          
          <div className="bg-gradient-to-br from-white to-violet-50 dark:from-gray-800 dark:to-violet-900/50 p-4 sm:p-6 rounded-xl shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-300 text-center border border-violet-100 dark:border-violet-800 lg:col-span-1 sm:col-span-2 lg:col-span-1">
            <div className="w-10 h-10 sm:w-12 sm:h-12 bg-gradient-to-br from-violet-500 to-purple-500 dark:from-violet-600 dark:to-purple-600 rounded-lg flex items-center justify-center mx-auto mb-3 sm:mb-4 shadow-md">
              <span className="text-lg sm:text-xl">📊</span>
            </div>
            <h3 className="text-lg sm:text-xl font-semibold mb-2 sm:mb-3 text-gray-800 dark:text-white">Dashboard Completo</h3>
            <p className="text-sm sm:text-base text-gray-600 dark:text-gray-300">
              Visualiza estadísticas detalladas de tus viajes y 
              mejora tu planificación.
            </p>
          </div>
        </div>

        {/* Sección Predicción Inteligente */}
        <section className="mt-16 sm:mt-24 py-12 sm:py-16 bg-gradient-to-r from-blue-50 via-white to-cyan-50 dark:from-gray-900 dark:via-gray-800 dark:to-blue-900">
          <div className="max-w-6xl mx-auto px-4">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12 items-center">
              <div className="order-2 lg:order-1">
                <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-cyan-500 dark:from-blue-600 dark:to-cyan-600 rounded-2xl flex items-center justify-center mb-6 shadow-lg">
                  <span className="text-3xl">🔮</span>
                </div>
                <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-gray-800 dark:text-white mb-6">
                  Predicción Inteligente de Tráfico
                </h2>
                <p className="text-lg text-gray-600 dark:text-gray-300 mb-6">
                  Nuestros algoritmos de inteligencia artificial analizan patrones de tráfico históricos, 
                  eventos en tiempo real y condiciones climáticas para predecir el flujo vehicular.
                </p>
                  <div className="space-y-4">
                  <div className="flex items-start space-x-3">
                    <div className="w-6 h-6 bg-gradient-to-r from-blue-600 to-cyan-600 rounded-full flex items-center justify-center mt-1 shadow-md">
                      <span className="text-white text-sm">✓</span>
                    </div>
                    <div>
                      <h4 className="font-semibold text-gray-800 dark:text-white">Análisis en Tiempo Real</h4>
                      <p className="text-gray-600 dark:text-gray-300">Procesamiento continuo de datos de tráfico actuales</p>
                    </div>
                  </div>
                  <div className="flex items-start space-x-3">
                    <div className="w-6 h-6 bg-gradient-to-r from-blue-600 to-cyan-600 rounded-full flex items-center justify-center mt-1 shadow-md">
                      <span className="text-white text-sm">✓</span>
                    </div>
                    <div>
                      <h4 className="font-semibold text-gray-800 dark:text-white">Aprendizaje Automático</h4>
                      <p className="text-gray-600 dark:text-gray-300">El sistema mejora sus predicciones con cada viaje</p>
                    </div>
                  </div>
                  <div className="flex items-start space-x-3">
                    <div className="w-6 h-6 bg-gradient-to-r from-blue-600 to-cyan-600 rounded-full flex items-center justify-center mt-1 shadow-md">
                      <span className="text-white text-sm">✓</span>
                    </div>
                    <div>
                      <h4 className="font-semibold text-gray-800 dark:text-white">Precisión del 95%</h4>
                      <p className="text-gray-600 dark:text-gray-300">Predicciones altamente confiables para tu planificación</p>
                    </div>
                  </div>
                </div>
              </div>
              <div className="order-1 lg:order-2">
                <div className="bg-gradient-to-br from-blue-100 via-cyan-100 to-blue-200 dark:from-blue-900/50 dark:via-cyan-900/50 dark:to-blue-800/50 rounded-2xl p-8 h-80 flex items-center justify-center shadow-lg border border-blue-200 dark:border-blue-700">
                  <div className="text-center">
                    <div className="text-6xl mb-4 animate-pulse">🧠</div>
                    <p className="text-blue-700 dark:text-blue-300 font-bold text-lg">IA en Acción</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Sección Rutas Optimizadas */}
        <section className="py-12 sm:py-16 bg-gradient-to-r from-emerald-50 via-green-50 to-teal-50 dark:from-gray-800 dark:via-emerald-900/30 dark:to-teal-900/30">
          <div className="max-w-6xl mx-auto px-4">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12 items-center">
              <div>
                <div className="bg-gradient-to-br from-emerald-100 via-green-100 to-teal-200 dark:from-emerald-900/50 dark:via-green-900/50 dark:to-teal-800/50 rounded-2xl p-8 h-80 flex items-center justify-center shadow-lg border border-emerald-200 dark:border-emerald-700">
                  <div className="text-center">
                    <div className="text-6xl mb-4 animate-bounce">🛣️</div>
                    <p className="text-emerald-700 dark:text-emerald-300 font-bold text-lg">Rutas Inteligentes</p>
                  </div>
                </div>
              </div>
              <div>
                <div className="w-16 h-16 bg-gradient-to-br from-emerald-500 to-teal-500 dark:from-emerald-600 dark:to-teal-600 rounded-2xl flex items-center justify-center mb-6 shadow-lg">
                  <span className="text-3xl">🗺️</span>
                </div>
                <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-gray-800 dark:text-white mb-6">
                  Rutas Optimizadas para Cada Situación
                </h2>
                <p className="text-lg text-gray-600 dark:text-gray-300 mb-6">
                  Calculamos múltiples rutas alternativas considerando todos los factores que afectan tu viaje, 
                  desde el tráfico hasta las preferencias personales.
                </p>
                <div className="space-y-4">
                  <div className="flex items-start space-x-3">
                    <div className="w-6 h-6 bg-gradient-to-r from-emerald-600 to-teal-600 rounded-full flex items-center justify-center mt-1 shadow-md">
                      <span className="text-white text-sm">✓</span>
                    </div>
                    <div>
                      <h4 className="font-semibold text-gray-800 dark:text-white">Múltiples Opciones</h4>
                      <p className="text-gray-600 dark:text-gray-300">Ruta más rápida, más corta o más económica</p>
                    </div>
                  </div>
                  <div className="flex items-start space-x-3">
                    <div className="w-6 h-6 bg-gradient-to-r from-emerald-600 to-teal-600 rounded-full flex items-center justify-center mt-1 shadow-md">
                      <span className="text-white text-sm">✓</span>
                    </div>
                    <div>
                      <h4 className="font-semibold text-gray-800 dark:text-white">Evita Congestiones</h4>
                      <p className="text-gray-600 dark:text-gray-300">Actualización automática ante cambios de tráfico</p>
                    </div>
                  </div>
                  <div className="flex items-start space-x-3">
                    <div className="w-6 h-6 bg-gradient-to-r from-emerald-600 to-teal-600 rounded-full flex items-center justify-center mt-1 shadow-md">
                      <span className="text-white text-sm">✓</span>
                    </div>
                    <div>
                      <h4 className="font-semibold text-gray-800 dark:text-white">Personalización</h4>
                      <p className="text-gray-600 dark:text-gray-300">Adapta las rutas según tus preferencias de conducción</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Sección Dashboard Completo */}
        <section className="py-12 sm:py-16 bg-gradient-to-r from-violet-50 via-white to-purple-50 dark:from-gray-900 dark:via-violet-900/30 dark:to-purple-900/30">
          <div className="max-w-6xl mx-auto px-4">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12 items-center">
              <div className="order-2 lg:order-1">
                <div className="w-16 h-16 bg-gradient-to-br from-violet-500 to-purple-500 dark:from-violet-600 dark:to-purple-600 rounded-2xl flex items-center justify-center mb-6 shadow-lg">
                  <span className="text-3xl">📊</span>
                </div>
                <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-gray-800 dark:text-white mb-6">
                  Dashboard de Análisis Avanzado
                </h2>
                <p className="text-lg text-gray-600 dark:text-gray-300 mb-6">
                  Obtén insights detallados sobre tus patrones de viaje, ahorra tiempo y combustible 
                  con estadísticas personalizadas y recomendaciones inteligentes.
                </p>
                <div className="space-y-4">
                  <div className="flex items-start space-x-3">
                    <div className="w-6 h-6 bg-gradient-to-r from-violet-600 to-purple-600 rounded-full flex items-center justify-center mt-1 shadow-md">
                      <span className="text-white text-sm">✓</span>
                    </div>
                    <div>
                      <h4 className="font-semibold text-gray-800 dark:text-white">Estadísticas Detalladas</h4>
                      <p className="text-gray-600 dark:text-gray-300">Tiempo ahorrado, combustible y emisiones reducidas</p>
                    </div>
                  </div>
                  <div className="flex items-start space-x-3">
                    <div className="w-6 h-6 bg-gradient-to-r from-violet-600 to-purple-600 rounded-full flex items-center justify-center mt-1 shadow-md">
                      <span className="text-white text-sm">✓</span>
                    </div>
                    <div>
                      <h4 className="font-semibold text-gray-800 dark:text-white">Historial de Viajes</h4>
                      <p className="text-gray-600 dark:text-gray-300">Registro completo con métricas de rendimiento</p>
                    </div>
                  </div>
                  <div className="flex items-start space-x-3">
                    <div className="w-6 h-6 bg-gradient-to-r from-violet-600 to-purple-600 rounded-full flex items-center justify-center mt-1 shadow-md">
                      <span className="text-white text-sm">✓</span>
                    </div>
                    <div>
                      <h4 className="font-semibold text-gray-800 dark:text-white">Reportes Personalizados</h4>
                      <p className="text-gray-600 dark:text-gray-300">Exporta datos para análisis empresarial o personal</p>
                    </div>
                  </div>
                </div>
              </div>
              <div className="order-1 lg:order-2">
                <div className="bg-gradient-to-br from-violet-100 via-purple-100 to-pink-200 dark:from-violet-900/50 dark:via-purple-900/50 dark:to-pink-900/50 rounded-2xl p-8 h-80 flex items-center justify-center shadow-lg border border-violet-200 dark:border-violet-700">
                  <div className="text-center">
                    <div className="text-6xl mb-4 animate-pulse">📈</div>
                    <p className="text-violet-700 dark:text-violet-300 font-bold text-lg">Analytics Avanzados</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Sección de Beneficios Adicionales */}
        <section className="py-12 sm:py-16 bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600">
          <div className="max-w-4xl mx-auto px-4 text-center">
            <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-white mb-8">
              Más que una App de Rutas
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 sm:gap-8">
              <div className="bg-white bg-opacity-15 backdrop-blur-md rounded-xl p-6 text-white hover:bg-opacity-20 transform hover:scale-105 transition-all duration-300 shadow-lg">
                <div className="text-4xl mb-4 animate-bounce">⚡</div>
                <h3 className="text-xl font-semibold mb-3 text-yellow-200">Velocidad</h3>
                <p className="text-blue-100">
                  Reduce hasta un 30% el tiempo de viaje con nuestras predicciones inteligentes
                </p>
              </div>
              <div className="bg-white bg-opacity-15 backdrop-blur-md rounded-xl p-6 text-white hover:bg-opacity-20 transform hover:scale-105 transition-all duration-300 shadow-lg">
                <div className="text-4xl mb-4 animate-pulse">💰</div>
                <h3 className="text-xl font-semibold mb-3 text-green-200">Ahorro</h3>
                <p className="text-blue-100">
                  Optimiza el consumo de combustible y reduce costos operativos
                </p>
              </div>
              <div className="bg-white bg-opacity-15 backdrop-blur-md rounded-xl p-6 text-white hover:bg-opacity-20 transform hover:scale-105 transition-all duration-300 shadow-lg">
                <div className="text-4xl mb-4 animate-bounce">🌱</div>
                <h3 className="text-xl font-semibold mb-3 text-emerald-200">Sostenibilidad</h3>
                <p className="text-blue-100">
                  Contribuye al medio ambiente reduciendo emisiones de CO₂
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Call to Action Final */}
        <section className="py-12 sm:py-16 bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 dark:from-gray-900 dark:via-blue-900 dark:to-indigo-900">
          <div className="max-w-4xl mx-auto px-4 text-center">
            <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-gray-800 dark:text-white mb-6">
              ¿Listo para Optimizar tus Rutas?
            </h2>
            <p className="text-lg text-gray-600 dark:text-gray-300 mb-8 max-w-2xl mx-auto">
              Únete a miles de usuarios que ya están ahorrando tiempo y dinero 
              con PrediRuta. Comienza tu prueba gratuita hoy mismo.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link 
                href="/register" 
                className="px-8 py-4 bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 dark:from-blue-700 dark:via-indigo-700 dark:to-purple-700 text-white rounded-full hover:from-blue-700 hover:via-indigo-700 hover:to-purple-700 dark:hover:from-blue-600 dark:hover:via-indigo-600 dark:hover:to-purple-600 hover:scale-105 transform transition-all duration-300 text-lg font-medium shadow-lg hover:shadow-xl"
              >
                Comenzar Ahora - Gratis
              </Link>
              <Link 
                href="/login" 
                className="px-8 py-4 bg-gradient-to-r from-white to-blue-50 dark:from-gray-800 dark:to-gray-700 border-2 border-blue-500 dark:border-blue-400 text-blue-600 dark:text-blue-400 rounded-full hover:from-blue-50 hover:to-indigo-50 dark:hover:from-gray-700 dark:hover:to-gray-600 hover:scale-105 transform transition-all duration-300 text-lg font-medium shadow-md hover:shadow-lg"
              >
                Ver Demo
              </Link>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
}