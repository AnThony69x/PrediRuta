"use client";

import { useState, useRef, useEffect } from "react";
import { AppLayout } from "@/components/layout/AppLayout";
import { MapPin, Navigation, Clock, TrendingUp, AlertCircle, Zap, Settings } from "lucide-react";

// Tipos de datos
interface Coordenadas {
  lat: number;
  lng: number;
}

interface Ruta {
  id: number;
  nombre: string;
  distancia: number; // km
  duracion: number; // minutos
  trafico: 'fluido' | 'moderado' | 'congestionado';
  peajes: boolean;
  velocidadPromedio: number; // km/h
  coordenadas: Coordenadas[];
  alternativa: boolean;
}

interface FormData {
  origen: string;
  destino: string;
  evitarPeajes: boolean;
  evitarAutopistas: boolean;
  rutaMasRapida: boolean;
}

// Datos simulados (reemplazar con API de TomTom)
const generarRutasSimuladas = (origen: string, destino: string, evitarPeajes: boolean): Ruta[] => {
  const rutas: Ruta[] = [
    {
      id: 1,
      nombre: "Ruta Principal (más rápida)",
      distancia: 25.4,
      duracion: 35,
      trafico: 'fluido',
      peajes: !evitarPeajes,
      velocidadPromedio: 43.5,
      coordenadas: [
        { lat: 40.4168, lng: -3.7038 },
        { lat: 40.4200, lng: -3.7000 },
        { lat: 40.4250, lng: -3.6950 },
      ],
      alternativa: false
    },
    {
      id: 2,
      nombre: "Ruta Alternativa 1 (sin peajes)",
      distancia: 28.7,
      duracion: 42,
      trafico: 'moderado',
      peajes: false,
      velocidadPromedio: 41.0,
      coordenadas: [
        { lat: 40.4168, lng: -3.7038 },
        { lat: 40.4180, lng: -3.6980 },
        { lat: 40.4250, lng: -3.6950 },
      ],
      alternativa: true
    },
    {
      id: 3,
      nombre: "Ruta Alternativa 2 (autopistas)",
      distancia: 30.2,
      duracion: 38,
      trafico: 'congestionado',
      peajes: true,
      velocidadPromedio: 47.7,
      coordenadas: [
        { lat: 40.4168, lng: -3.7038 },
        { lat: 40.4220, lng: -3.7100 },
        { lat: 40.4250, lng: -3.6950 },
      ],
      alternativa: true
    }
  ];

  if (evitarPeajes) {
    return rutas.filter(r => !r.peajes);
  }

  return rutas;
};

// Componente de tarjeta de ruta
function RutaCard({ ruta, seleccionada, onClick }: { ruta: Ruta, seleccionada: boolean, onClick: () => void }) {
  const colorTrafico = 
    ruta.trafico === 'fluido' ? 'bg-green-100 text-green-800 border-green-300' :
    ruta.trafico === 'moderado' ? 'bg-yellow-100 text-yellow-800 border-yellow-300' :
    'bg-red-100 text-red-800 border-red-300';

  const iconoTrafico =
    ruta.trafico === 'fluido' ? '🟢' :
    ruta.trafico === 'moderado' ? '🟡' : '🔴';

  return (
    <div
      onClick={onClick}
      className={`cursor-pointer rounded-xl p-5 border-2 transition-all duration-200 hover:shadow-lg ${
        seleccionada
          ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20 dark:border-blue-400'
          : 'border-gray-200 bg-white dark:bg-gray-800 dark:border-gray-700 hover:border-blue-300'
      }`}
    >
      <div className="flex items-start justify-between mb-3">
        <div className="flex-1">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-1">
            {ruta.nombre}
          </h3>
          {!ruta.alternativa && (
            <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-blue-100 text-blue-800 dark:bg-blue-800 dark:text-blue-200">
              <Zap className="w-3 h-3 mr-1" />
              Recomendada
            </span>
          )}
        </div>
        <div className={`px-3 py-1 rounded-full text-sm font-medium border ${colorTrafico}`}>
          {iconoTrafico} {ruta.trafico.charAt(0).toUpperCase() + ruta.trafico.slice(1)}
        </div>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-3">
        <div className="flex items-center space-x-2">
          <Navigation className="w-4 h-4 text-gray-500 dark:text-gray-400" />
          <div>
            <p className="text-xs text-gray-500 dark:text-gray-400">Distancia</p>
            <p className="text-sm font-semibold text-gray-900 dark:text-white">{ruta.distancia} km</p>
          </div>
        </div>

        <div className="flex items-center space-x-2">
          <Clock className="w-4 h-4 text-gray-500 dark:text-gray-400" />
          <div>
            <p className="text-xs text-gray-500 dark:text-gray-400">Tiempo</p>
            <p className="text-sm font-semibold text-gray-900 dark:text-white">{ruta.duracion} min</p>
          </div>
        </div>

        <div className="flex items-center space-x-2">
          <TrendingUp className="w-4 h-4 text-gray-500 dark:text-gray-400" />
          <div>
            <p className="text-xs text-gray-500 dark:text-gray-400">Velocidad</p>
            <p className="text-sm font-semibold text-gray-900 dark:text-white">{ruta.velocidadPromedio} km/h</p>
          </div>
        </div>

        <div className="flex items-center space-x-2">
          <AlertCircle className="w-4 h-4 text-gray-500 dark:text-gray-400" />
          <div>
            <p className="text-xs text-gray-500 dark:text-gray-400">Peajes</p>
            <p className="text-sm font-semibold text-gray-900 dark:text-white">
              {ruta.peajes ? 'Sí' : 'No'}
            </p>
          </div>
        </div>
      </div>

      {seleccionada && (
        <div className="mt-4 pt-4 border-t border-gray-200 dark:border-gray-700">
          <p className="text-sm text-gray-600 dark:text-gray-400">
            ✅ Ruta seleccionada. El mapa se actualizará con esta ruta.
          </p>
        </div>
      )}
    </div>
  );
}

// Componente principal
export default function RutasPage() {
  const [formData, setFormData] = useState<FormData>({
    origen: '',
    destino: '',
    evitarPeajes: false,
    evitarAutopistas: false,
    rutaMasRapida: true
  });

  const [rutas, setRutas] = useState<Ruta[]>([]);
  const [rutaSeleccionada, setRutaSeleccionada] = useState<number | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [mostrarMapa, setMostrarMapa] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      // Validaciones
      if (!formData.origen.trim()) {
        throw new Error('El origen es obligatorio');
      }
      if (!formData.destino.trim()) {
        throw new Error('El destino es obligatorio');
      }

      // Simulación de delay de API
      await new Promise(resolve => setTimeout(resolve, 1500));

      // Generar rutas simuladas
      const rutasGeneradas = generarRutasSimuladas(
        formData.origen,
        formData.destino,
        formData.evitarPeajes
      );

      setRutas(rutasGeneradas);
      setRutaSeleccionada(rutasGeneradas[0]?.id || null);
      setMostrarMapa(true);

    } catch (err: any) {
      setError(err.message || 'Error al calcular rutas');
      setRutas([]);
      setMostrarMapa(false);
    } finally {
      setLoading(false);
    }
  };

  return (
    <AppLayout>
      <div className="max-w-7xl mx-auto py-8 px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
            Planificador de Rutas
          </h1>
          <p className="text-gray-600 dark:text-gray-400">
            Calcula la ruta más rápida considerando tráfico en tiempo real, distancia y tus preferencias
          </p>
        </div>

        {/* Formulario de búsqueda */}
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6 mb-8">
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Origen */}
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  <MapPin className="w-4 h-4 inline mr-2" />
                  Origen *
                </label>
                <input
                  type="text"
                  value={formData.origen}
                  onChange={e => setFormData({ ...formData, origen: e.target.value })}
                  placeholder="Ej: Calle Gran Vía 1, Madrid"
                  className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors"
                  disabled={loading}
                  required
                />
              </div>

              {/* Destino */}
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  <Navigation className="w-4 h-4 inline mr-2" />
                  Destino *
                </label>
                <input
                  type="text"
                  value={formData.destino}
                  onChange={e => setFormData({ ...formData, destino: e.target.value })}
                  placeholder="Ej: Aeropuerto Adolfo Suárez Madrid-Barajas"
                  className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors"
                  disabled={loading}
                  required
                />
              </div>
            </div>

            {/* Opciones avanzadas */}
            <div className="bg-gray-50 dark:bg-gray-900/50 rounded-lg p-4">
              <div className="flex items-center mb-3">
                <Settings className="w-4 h-4 mr-2 text-gray-600 dark:text-gray-400" />
                <h3 className="text-sm font-medium text-gray-700 dark:text-gray-300">
                  Preferencias de ruta
                </h3>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <label className="flex items-center space-x-3 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={formData.evitarPeajes}
                    onChange={e => setFormData({ ...formData, evitarPeajes: e.target.checked })}
                    className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                    disabled={loading}
                  />
                  <span className="text-sm text-gray-700 dark:text-gray-300">Evitar peajes</span>
                </label>

                <label className="flex items-center space-x-3 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={formData.evitarAutopistas}
                    onChange={e => setFormData({ ...formData, evitarAutopistas: e.target.checked })}
                    className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                    disabled={loading}
                  />
                  <span className="text-sm text-gray-700 dark:text-gray-300">Evitar autopistas</span>
                </label>

                <label className="flex items-center space-x-3 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={formData.rutaMasRapida}
                    onChange={e => setFormData({ ...formData, rutaMasRapida: e.target.checked })}
                    className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                    disabled={loading}
                  />
                  <span className="text-sm text-gray-700 dark:text-gray-300">Priorizar velocidad</span>
                </label>
              </div>
            </div>

            {/* Botón de búsqueda */}
            <button
              type="submit"
              disabled={loading}
              className={`w-full md:w-auto px-8 py-3 rounded-lg font-medium text-white transition-all duration-200 flex items-center justify-center space-x-2 ${
                loading
                  ? 'bg-gray-400 cursor-not-allowed'
                  : 'bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 transform hover:scale-105 shadow-lg'
              }`}
            >
              {loading ? (
                <>
                  <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                  <span>Calculando rutas...</span>
                </>
              ) : (
                <>
                  <Navigation className="w-5 h-5" />
                  <span>Calcular Ruta</span>
                </>
              )}
            </button>
          </form>

          {/* Mensaje de error */}
          {error && (
            <div className="mt-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-4">
              <div className="flex items-center">
                <AlertCircle className="w-5 h-5 text-red-600 dark:text-red-400 mr-2" />
                <p className="text-red-700 dark:text-red-300 text-sm">{error}</p>
              </div>
            </div>
          )}
        </div>

        {/* Resultados de rutas */}
        {rutas.length > 0 && (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Lista de rutas */}
            <div className="space-y-4">
              <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
                Rutas disponibles ({rutas.length})
              </h2>
              {rutas.map(ruta => (
                <RutaCard
                  key={ruta.id}
                  ruta={ruta}
                  seleccionada={rutaSeleccionada === ruta.id}
                  onClick={() => setRutaSeleccionada(ruta.id)}
                />
              ))}
            </div>

            {/* Mapa */}
            <div className="sticky top-24">
              <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 overflow-hidden">
                <div className="bg-gradient-to-r from-blue-600 to-indigo-600 px-6 py-4">
                  <h2 className="text-xl font-bold text-white flex items-center">
                    <MapPin className="w-5 h-5 mr-2" />
                    Mapa de Ruta
                  </h2>
                </div>
                <div className="p-6">
                  {/* Placeholder del mapa - Aquí integrar TomTom Maps o Google Maps */}
                  <div className="aspect-video bg-gradient-to-br from-gray-100 to-gray-200 dark:from-gray-700 dark:to-gray-800 rounded-lg flex items-center justify-center">
                    <div className="text-center">
                      <MapPin className="w-16 h-16 mx-auto mb-4 text-gray-400" />
                      <p className="text-gray-600 dark:text-gray-400 font-medium mb-2">
                        Mapa Interactivo
                      </p>
                      <p className="text-sm text-gray-500 dark:text-gray-500 max-w-xs">
                        Aquí se mostrará el mapa con la ruta seleccionada
                      </p>
                      <div className="mt-4 p-3 bg-blue-50 dark:bg-blue-900/20 rounded border border-blue-200 dark:border-blue-800">
                        <p className="text-xs text-blue-700 dark:text-blue-300">
                          📍 <strong>TODO:</strong> Integrar TomTom Maps API para visualización de rutas en tiempo real
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* Información de la ruta seleccionada */}
                  {rutaSeleccionada && (
                    <div className="mt-6 p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg border border-blue-200 dark:border-blue-800">
                      <h3 className="text-sm font-semibold text-blue-900 dark:text-blue-300 mb-2">
                        Ruta seleccionada
                      </h3>
                      <p className="text-sm text-blue-700 dark:text-blue-400">
                        {rutas.find(r => r.id === rutaSeleccionada)?.nombre}
                      </p>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Estado inicial */}
        {!loading && rutas.length === 0 && !error && (
          <div className="text-center py-12 bg-gray-50 dark:bg-gray-900/50 rounded-xl border-2 border-dashed border-gray-300 dark:border-gray-700">
            <Navigation className="mx-auto h-16 w-16 text-gray-400 dark:text-gray-600 mb-4" />
            <h3 className="text-xl font-semibold text-gray-700 dark:text-gray-300 mb-3">
              Comienza a planificar tu ruta
            </h3>
            <p className="text-gray-500 dark:text-gray-400 max-w-md mx-auto">
              Ingresa el origen y destino de tu viaje en el formulario de arriba para obtener las mejores rutas
              con información de tráfico en tiempo real.
            </p>
          </div>
        )}
      </div>
    </AppLayout>
  );
}
