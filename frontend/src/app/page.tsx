import Link from "next/link";

export default function Home() {
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header con navegación */}
      <header className="bg-white shadow-sm">
        <div className="container mx-auto px-4 py-4 flex justify-between items-center">
          <h1 className="text-2xl font-bold text-blue-600">PrediRuta</h1>
          <div className="space-x-4">
            <Link 
              href="/login" 
              className="px-4 py-2 text-blue-600 border border-blue-600 rounded-lg hover:bg-blue-50 transition-colors"
            >
              Iniciar Sesión
            </Link>
            <Link 
              href="/register" 
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              Registrarse
            </Link>
          </div>
        </div>
      </header>

      {/* Contenido principal */}
      <main className="container mx-auto px-4 py-12">
        <div className="text-center mb-12">
          <h2 className="text-5xl font-bold text-gray-800 mb-6">
            Optimiza tus rutas con IA
          </h2>
          <p className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto">
            Sistema inteligente de predicción de tráfico y optimización de rutas 
            que te ayuda a llegar más rápido a tu destino.
          </p>
          
          {/* Botones de acción principales */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link 
              href="/register" 
              className="px-8 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-lg font-semibold"
            >
              Comenzar Gratis
            </Link>
            <Link 
              href="/login" 
              className="px-8 py-3 border-2 border-blue-600 text-blue-600 rounded-lg hover:bg-blue-50 transition-colors text-lg font-semibold"
            >
              Iniciar Sesión
            </Link>
          </div>
        </div>
        
        {/* Características principales */}
        <div className="grid md:grid-cols-3 gap-8 max-w-4xl mx-auto">
          <div className="bg-white p-6 rounded-xl shadow-md text-center">
            <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mx-auto mb-4">
              🔮
            </div>
            <h3 className="text-xl font-semibold mb-3">Predicción Inteligente</h3>
            <p className="text-gray-600">
              Algoritmos avanzados que predicen el tráfico en tiempo real 
              para optimizar tus rutas.
            </p>
          </div>
          
          <div className="bg-white p-6 rounded-xl shadow-md text-center">
            <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center mx-auto mb-4">
              🗺️
            </div>
            <h3 className="text-xl font-semibold mb-3">Rutas Optimizadas</h3>
            <p className="text-gray-600">
              Encuentra las mejores rutas considerando tráfico, distancia 
              y tiempo de viaje.
            </p>
          </div>
          
          <div className="bg-white p-6 rounded-xl shadow-md text-center">
            <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center mx-auto mb-4">
              📊
            </div>
            <h3 className="text-xl font-semibold mb-3">Dashboard Completo</h3>
            <p className="text-gray-600">
              Visualiza estadísticas detalladas de tus viajes y 
              mejora tu planificación.
            </p>
          </div>
        </div>
      </main>
    </div>
  );
}