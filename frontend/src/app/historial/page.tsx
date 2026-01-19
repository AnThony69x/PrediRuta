"use client";

import { useState, useEffect } from "react";
import { useTranslation } from "@/hooks/useTranslation";
import { AppLayout } from "@/components/layout/AppLayout";
import { useHistory } from "@/hooks/useHistory";
import { 
  Clock, 
  MapPin, 
  Navigation,
  TrendingUp,
  Download,
  Trash2,
  Filter,
  Calendar,
  BarChart3,
  Loader2,
  AlertCircle
} from "lucide-react";

export default function HistorialPage() {
  const { t } = useTranslation();
  const [vistaActiva, setVistaActiva] = useState<'rutas' | 'predicciones' | 'estadisticas'>('rutas');
  const [filtroFecha, setFiltroFecha] = useState<'todas' | 'hoy' | 'semana' | 'mes'>('todas');
  const [mostrarConfirmacionEliminar, setMostrarConfirmacionEliminar] = useState(false);
  const [eliminandoRuta, setEliminandoRuta] = useState<string | null>(null);

  // Usar el hook de historial con datos reales
  const {
    rutas,
    predicciones,
    estadisticas,
    loading,
    error,
    eliminarRutaPorId,
    limpiarHistorial,
    exportarCSV,
    actualizarFiltros,
    recargar,
    totalRutas,
    totalPredicciones,
    tieneHistorial
  } = useHistory({ autoLoad: true });

  // Actualizar filtros cuando cambie el filtro de fecha
  useEffect(() => {
    actualizarFiltros({ fecha: filtroFecha });
  }, [filtroFecha, actualizarFiltros]);

  // Calcular estadísticas locales si no están disponibles desde el hook
  const totalKm = estadisticas?.totalKm || rutas.reduce((sum, r) => sum + r.distancia, 0);
  const totalTiempoAhorrado = estadisticas?.totalTiempoAhorrado || rutas.reduce((sum, r) => sum + r.tiempoAhorrado, 0);
  const precisionPromedio = estadisticas?.precisionPromedio || 
    (predicciones.length > 0 ? predicciones.reduce((sum, p) => sum + p.precisionReal, 0) / predicciones.length : 0);

  const exportarHistorial = async () => {
    const success = await exportarCSV();
    if (!success) {
      alert('Error al exportar el historial');
    }
  };

  const eliminarHistorialCompleto = async () => {
    const success = await limpiarHistorial();
    if (success) {
      setMostrarConfirmacionEliminar(false);
    } else {
      alert('Error al eliminar el historial');
    }
  };

  const eliminarRutaIndividual = async (id: string) => {
    setEliminandoRuta(id);
    const success = await eliminarRutaPorId(id);
    setEliminandoRuta(null);
    if (!success) {
      alert('Error al eliminar la ruta');
    }
  };

  return (
    <AppLayout>
      <div className="max-w-7xl mx-auto py-8 px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2 flex items-center">
            <Clock className="w-8 h-8 mr-3" />
            {t('dashboard.history.title')}
          </h1>
          <p className="text-gray-600 dark:text-gray-400">
            {t('sidebar.history.desc')}
          </p>
        </div>

        {/* Tabs de navegación */}
        <div className="mb-8 flex flex-wrap gap-2">
          <button
            onClick={() => setVistaActiva('rutas')}
            className={`px-6 py-3 rounded-lg font-medium transition-all duration-200 flex items-center space-x-2 ${
              vistaActiva === 'rutas'
                ? 'bg-gradient-to-r from-blue-600 to-indigo-600 text-white shadow-lg'
                : 'bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-300 dark:hover:bg-gray-600'
            }`}
          >
            <Navigation className="w-5 h-5" />
            <span>{t('sidebar.routes')} ({totalRutas})</span>
          </button>

          <button
            onClick={() => setVistaActiva('predicciones')}
            className={`px-6 py-3 rounded-lg font-medium transition-all duration-200 flex items-center space-x-2 ${
              vistaActiva === 'predicciones'
                ? 'bg-gradient-to-r from-blue-600 to-indigo-600 text-white shadow-lg'
                : 'bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-300 dark:hover:bg-gray-600'
            }`}
          >
            <TrendingUp className="w-5 h-5" />
            <span>{t('sidebar.predictions')} ({totalPredicciones})</span>
          </button>

          <button
            onClick={() => setVistaActiva('estadisticas')}
            className={`px-6 py-3 rounded-lg font-medium transition-all duration-200 flex items-center space-x-2 ${
              vistaActiva === 'estadisticas'
                ? 'bg-gradient-to-r from-blue-600 to-indigo-600 text-white shadow-lg'
                : 'bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-300 dark:hover:bg-gray-600'
            }`}
          >
            <BarChart3 className="w-5 h-5" />
            <span>{t('dashboard.history.statistics')}</span>
          </button>
        </div>

        {/* Acciones */}
        <div className="mb-6 flex flex-wrap gap-4 items-center justify-between">
          <div className="flex items-center space-x-2">
            <Filter className="w-5 h-5 text-gray-500" />
            <select
              value={filtroFecha}
              onChange={e => setFiltroFecha(e.target.value as any)}
              className="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500"
            >
              <option value="todas">{t('dashboard.history.allDates')}</option>
              <option value="hoy">{t('dashboard.history.today')}</option>
              <option value="semana">{t('dashboard.history.thisWeek')}</option>
              <option value="mes">{t('dashboard.history.thisMonth')}</option>
            </select>
          </div>

          <div className="flex space-x-3">
            <button
              onClick={exportarHistorial}
              className="px-4 py-2 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 transition-colors flex items-center space-x-2"
            >
              <Download className="w-4 h-4" />
              <span>{t('dashboard.history.export')}</span>
            </button>

            <button
              onClick={() => setMostrarConfirmacionEliminar(true)}
              disabled={!tieneHistorial || loading}
              className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors flex items-center space-x-2 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <Trash2 className="w-4 h-4" />
              <span>{t('dashboard.history.deleteAll')}</span>
            </button>
          </div>
        </div>

        {/* Contenido según vista activa */}
        {loading && (
          <div className="flex items-center justify-center py-12">
            <Loader2 className="w-8 h-8 animate-spin text-blue-600" />
            <span className="ml-3 text-gray-600 dark:text-gray-400">Cargando historial...</span>
          </div>
        )}

        {error && (
          <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-xl p-4 flex items-center space-x-3">
            <AlertCircle className="w-5 h-5 text-red-600 dark:text-red-400 flex-shrink-0" />
            <div>
              <p className="font-medium text-red-900 dark:text-red-200">Error al cargar historial</p>
              <p className="text-sm text-red-700 dark:text-red-300">{error}</p>
            </div>
          </div>
        )}

        {!loading && !error && !tieneHistorial && (
          <div className="bg-gray-50 dark:bg-gray-800 rounded-xl border-2 border-dashed border-gray-300 dark:border-gray-600 p-12 text-center">
            <Clock className="w-16 h-16 mx-auto text-gray-400 mb-4" />
            <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
              No hay historial disponible
            </h3>
            <p className="text-gray-600 dark:text-gray-400 mb-4">
              Comienza a consultar rutas y predicciones para ver tu historial aquí.
            </p>
          </div>
        )}

        {!loading && !error && vistaActiva === 'rutas' && rutas.length > 0 && (
          <div className="space-y-4">
            {rutas.map(ruta => (
              <div
                key={ruta.id}
                className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6 hover:shadow-lg transition-shadow"
              >
                <div className="flex items-start justify-between mb-4">
                  <div className="flex-1">
                    <div className="flex items-center space-x-2 mb-2">
                      <Calendar className="w-4 h-4 text-gray-500" />
                      <span className="text-sm text-gray-600 dark:text-gray-400">
                        {new Date(ruta.fecha).toLocaleString('es-ES', {
                          year: 'numeric',
                          month: 'long',
                          day: 'numeric',
                          hour: '2-digit',
                          minute: '2-digit'
                        })}
                      </span>
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                        ruta.trafico === 'fluido' ? 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400' :
                        ruta.trafico === 'moderado' ? 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400' :
                        'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400'
                      }`}>
                        {ruta.trafico === 'fluido' ? '🟢 Fluido' :
                         ruta.trafico === 'moderado' ? '🟡 Moderado' :
                         '🔴 Congestionado'}
                      </span>
                    </div>

                    <div className="space-y-2">
                      <div className="flex items-start space-x-2">
                        <MapPin className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" />
                        <div>
                          <p className="text-sm font-medium text-gray-900 dark:text-white">
                            {ruta.origen}
                          </p>
                        </div>
                      </div>

                      <div className="flex items-start space-x-2">
                        <Navigation className="w-5 h-5 text-emerald-600 flex-shrink-0 mt-0.5" />
                        <div>
                          <p className="text-sm font-medium text-gray-900 dark:text-white">
                            {ruta.destino}
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>

                  <button 
                    onClick={() => eliminarRutaIndividual(ruta.id)}
                    disabled={eliminandoRuta === ruta.id}
                    className="text-gray-400 hover:text-red-600 transition-colors disabled:opacity-50"
                  >
                    {eliminandoRuta === ruta.id ? (
                      <Loader2 className="w-5 h-5 animate-spin" />
                    ) : (
                      <Trash2 className="w-5 h-5" />
                    )}
                  </button>
                </div>

                <div className="grid grid-cols-3 gap-4 pt-4 border-t border-gray-200 dark:border-gray-700">
                  <div>
                    <p className="text-xs text-gray-500 dark:text-gray-400">{t('dashboard.history.distance')}</p>
                    <p className="text-lg font-semibold text-gray-900 dark:text-white">
                      {ruta.distancia.toFixed(1)} km
                    </p>
                  </div>
                  <div>
                    <p className="text-xs text-gray-500 dark:text-gray-400">{t('dashboard.history.duration')}</p>
                    <p className="text-lg font-semibold text-gray-900 dark:text-white">
                      {ruta.duracion} min
                    </p>
                  </div>
                  <div>
                    <p className="text-xs text-gray-500 dark:text-gray-400">{t('dashboard.history.timeSaved')}</p>
                    <p className="text-lg font-semibold text-emerald-600 dark:text-emerald-400">
                      +{ruta.tiempoAhorrado} min
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {!loading && !error && vistaActiva === 'predicciones' && predicciones.length > 0 && (
          <div className="space-y-4">
            {predicciones.map(pred => (
              <div
                key={pred.id}
                className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6"
              >
                <div className="flex items-center justify-between mb-4">
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                      {pred.zona}
                    </h3>
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      {new Date(pred.fecha).toLocaleDateString('es-ES', {
                        year: 'numeric',
                        month: 'long',
                        day: 'numeric'
                      })} - {pred.horaConsulta}
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="text-2xl font-bold text-blue-600 dark:text-blue-400">
                      {pred.precisionReal}%
                    </p>
                    <p className="text-xs text-gray-500 dark:text-gray-400">Precisión</p>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">Congestión predicha</p>
                    <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-3">
                      <div
                        className={`h-3 rounded-full ${
                          pred.congestionPredicha >= 0.7 ? 'bg-red-500' :
                          pred.congestionPredicha >= 0.4 ? 'bg-yellow-500' :
                          'bg-green-500'
                        }`}
                        style={{ width: `${pred.congestionPredicha * 100}%` }}
                      />
                    </div>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">Estado</p>
                    <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                      pred.precisionReal >= 90 ? 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400' :
                      pred.precisionReal >= 75 ? 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400' :
                      'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400'
                    }`}>
                      {pred.precisionReal >= 90 ? 'Excelente' :
                       pred.precisionReal >= 75 ? 'Buena' :
                       'Regular'}
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {!loading && !error && vistaActiva === 'estadisticas' && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl p-6 text-white">
              <Navigation className="w-8 h-8 mb-3 opacity-80" />
              <p className="text-sm opacity-90 mb-1">{t('dashboard.history.queriedRoutes')}</p>
              <p className="text-3xl font-bold">{totalRutas}</p>
            </div>

            <div className="bg-gradient-to-br from-emerald-500 to-emerald-600 rounded-xl p-6 text-white">
              <MapPin className="w-8 h-8 mb-3 opacity-80" />
              <p className="text-sm opacity-90 mb-1">{t('dashboard.history.kilometers')}</p>
              <p className="text-3xl font-bold">{totalKm.toFixed(1)} km</p>
            </div>

            <div className="bg-gradient-to-br from-purple-500 to-purple-600 rounded-xl p-6 text-white">
              <Clock className="w-8 h-8 mb-3 opacity-80" />
              <p className="text-sm opacity-90 mb-1">{t('dashboard.history.timeSaved')}</p>
              <p className="text-3xl font-bold">{totalTiempoAhorrado} min</p>
            </div>

            <div className="bg-gradient-to-br from-orange-500 to-orange-600 rounded-xl p-6 text-white">
              <TrendingUp className="w-8 h-8 mb-3 opacity-80" />
              <p className="text-sm opacity-90 mb-1">{t('dashboard.history.averagePrecision')}</p>
              <p className="text-3xl font-bold">{precisionPromedio.toFixed(0)}%</p>
            </div>

            {estadisticas?.rutasMasFrecuentes && estadisticas.rutasMasFrecuentes.length > 0 && (
              <div className="md:col-span-2 lg:col-span-4 bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4 flex items-center">
                  <TrendingUp className="w-5 h-5 mr-2" />
                  Rutas más frecuentes
                </h3>
                <div className="space-y-3">
                  {estadisticas.rutasMasFrecuentes.map((ruta, idx) => (
                    <div key={idx} className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-700/50 rounded-lg">
                      <div className="flex items-center space-x-3 flex-1">
                        <span className="text-lg font-bold text-gray-400">#{idx + 1}</span>
                        <div className="flex items-center space-x-2 text-sm">
                          <MapPin className="w-4 h-4 text-blue-600" />
                          <span className="text-gray-900 dark:text-white font-medium">{ruta.origen}</span>
                          <Navigation className="w-4 h-4 text-emerald-600" />
                          <span className="text-gray-900 dark:text-white font-medium">{ruta.destino}</span>
                        </div>
                      </div>
                      <span className="px-3 py-1 bg-blue-100 dark:bg-blue-900/30 text-blue-800 dark:text-blue-300 rounded-full text-sm font-medium">
                        {ruta.count} {ruta.count === 1 ? 'vez' : 'veces'}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}

        {/* Modal de confirmación de eliminación */}
        {mostrarConfirmacionEliminar && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-2xl max-w-md w-full p-6">
              <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-4">
                {t('dashboard.history.deleteConfirm')}
              </h3>
              <p className="text-gray-600 dark:text-gray-400 mb-6">
                {t('dashboard.history.deleteMessage')}
              </p>
              <div className="flex space-x-4">
                <button
                  onClick={eliminarHistorialCompleto}
                  disabled={loading}
                  className="flex-1 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors font-medium disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
                >
                  {loading ? (
                    <>
                      <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                      Eliminando...
                    </>
                  ) : (
                    t('dashboard.history.confirmDelete')
                  )}
                </button>
                <button
                  onClick={() => setMostrarConfirmacionEliminar(false)}
                  className="flex-1 px-4 py-2 bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-300 dark:hover:bg-gray-600 transition-colors font-medium"
                >
                  {t('dashboard.history.cancel')}
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </AppLayout>
  );
}
