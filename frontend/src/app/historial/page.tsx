"use client";

import { useState } from "react";
import { AppLayout } from "@/components/layout/AppLayout";
import { 
  Clock, 
  MapPin, 
  Navigation,
  TrendingUp,
  Download,
  Trash2,
  Filter,
  Calendar,
  BarChart3
} from "lucide-react";

interface RutaHistorial {
  id: number;
  fecha: string;
  origen: string;
  destino: string;
  distancia: number;
  duracion: number;
  tiempoAhorrado: number;
  trafico: 'fluido' | 'moderado' | 'congestionado';
}

interface PrediccionHistorial {
  id: number;
  fecha: string;
  zona: string;
  horaConsulta: string;
  precisionReal: number;
  congestionPredicha: number;
}

const rutasHistorialMock: RutaHistorial[] = [
  {
    id: 1,
    fecha: "2025-10-28 08:30",
    origen: "Calle Gran Vía 1, Madrid",
    destino: "Aeropuerto Adolfo Suárez Madrid-Barajas",
    distancia: 14.5,
    duracion: 22,
    tiempoAhorrado: 8,
    trafico: 'fluido'
  },
  {
    id: 2,
    fecha: "2025-10-27 18:15",
    origen: "Plaza Mayor, Madrid",
    destino: "Estadio Santiago Bernabéu",
    distancia: 4.2,
    duracion: 15,
    tiempoAhorrado: 5,
    trafico: 'moderado'
  },
  {
    id: 3,
    fecha: "2025-10-26 07:45",
    origen: "Atocha Renfe",
    destino: "Parque Warner Madrid",
    distancia: 32.7,
    duracion: 35,
    tiempoAhorrado: 12,
    trafico: 'congestionado'
  },
  {
    id: 4,
    fecha: "2025-10-25 14:00",
    origen: "Universidad Complutense",
    destino: "Centro Comercial La Vaguada",
    distancia: 8.9,
    duracion: 18,
    tiempoAhorrado: 3,
    trafico: 'fluido'
  },
  {
    id: 5,
    fecha: "2025-10-24 09:30",
    origen: "Hospital La Paz",
    destino: "Museo del Prado",
    distancia: 6.3,
    duracion: 20,
    tiempoAhorrado: 7,
    trafico: 'moderado'
  }
];

const prediccionesHistorialMock: PrediccionHistorial[] = [
  {
    id: 1,
    fecha: "2025-10-28",
    zona: "Centro",
    horaConsulta: "08:00",
    precisionReal: 92,
    congestionPredicha: 0.75
  },
  {
    id: 2,
    fecha: "2025-10-27",
    zona: "Norte",
    horaConsulta: "18:00",
    precisionReal: 88,
    congestionPredicha: 0.45
  },
  {
    id: 3,
    fecha: "2025-10-26",
    zona: "Sur",
    horaConsulta: "07:30",
    precisionReal: 95,
    congestionPredicha: 0.85
  }
];

export default function HistorialPage() {
  const [vistaActiva, setVistaActiva] = useState<'rutas' | 'predicciones' | 'estadisticas'>('rutas');
  const [filtroFecha, setFiltroFecha] = useState<'todas' | 'hoy' | 'semana' | 'mes'>('todas');
  const [mostrarConfirmacionEliminar, setMostrarConfirmacionEliminar] = useState(false);

  // Calcular estadísticas
  const totalRutas = rutasHistorialMock.length;
  const totalKm = rutasHistorialMock.reduce((sum, r) => sum + r.distancia, 0);
  const totalTiempoAhorrado = rutasHistorialMock.reduce((sum, r) => sum + r.tiempoAhorrado, 0);
  const precisionPromedio = prediccionesHistorialMock.reduce((sum, p) => sum + p.precisionReal, 0) / prediccionesHistorialMock.length;

  const exportarHistorial = () => {
    // Simulación de exportación a CSV
    const csv = rutasHistorialMock.map(r => 
      `${r.fecha},${r.origen},${r.destino},${r.distancia},${r.duracion},${r.tiempoAhorrado}`
    ).join('\n');
    
    const blob = new Blob([`Fecha,Origen,Destino,Distancia(km),Duración(min),TiempoAhorrado(min)\n${csv}`], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `historial-prediruta-${new Date().toISOString().split('T')[0]}.csv`;
    a.click();
  };

  const eliminarHistorial = () => {
    // Simulación de eliminación
    console.log('Historial eliminado');
    setMostrarConfirmacionEliminar(false);
  };

  return (
    <AppLayout>
      <div className="max-w-7xl mx-auto py-8 px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2 flex items-center">
            <Clock className="w-8 h-8 mr-3" />
            Historial
          </h1>
          <p className="text-gray-600 dark:text-gray-400">
            Consulta tus rutas anteriores, predicciones pasadas y estadísticas de uso
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
            <span>Rutas ({totalRutas})</span>
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
            <span>Predicciones ({prediccionesHistorialMock.length})</span>
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
            <span>Estadísticas</span>
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
              <option value="todas">Todas las fechas</option>
              <option value="hoy">Hoy</option>
              <option value="semana">Última semana</option>
              <option value="mes">Último mes</option>
            </select>
          </div>

          <div className="flex space-x-3">
            <button
              onClick={exportarHistorial}
              className="px-4 py-2 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 transition-colors flex items-center space-x-2"
            >
              <Download className="w-4 h-4" />
              <span>Exportar CSV</span>
            </button>

            <button
              onClick={() => setMostrarConfirmacionEliminar(true)}
              className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors flex items-center space-x-2"
            >
              <Trash2 className="w-4 h-4" />
              <span>Eliminar Todo</span>
            </button>
          </div>
        </div>

        {/* Contenido según vista activa */}
        {vistaActiva === 'rutas' && (
          <div className="space-y-4">
            {rutasHistorialMock.map(ruta => (
              <div
                key={ruta.id}
                className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6 hover:shadow-lg transition-shadow"
              >
                <div className="flex items-start justify-between mb-4">
                  <div className="flex-1">
                    <div className="flex items-center space-x-2 mb-2">
                      <Calendar className="w-4 h-4 text-gray-500" />
                      <span className="text-sm text-gray-600 dark:text-gray-400">
                        {new Date(ruta.fecha).toLocaleString('es-ES')}
                      </span>
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                        ruta.trafico === 'fluido' ? 'bg-green-100 text-green-800' :
                        ruta.trafico === 'moderado' ? 'bg-yellow-100 text-yellow-800' :
                        'bg-red-100 text-red-800'
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

                  <button className="text-gray-400 hover:text-red-600 transition-colors">
                    <Trash2 className="w-5 h-5" />
                  </button>
                </div>

                <div className="grid grid-cols-3 gap-4 pt-4 border-t border-gray-200 dark:border-gray-700">
                  <div>
                    <p className="text-xs text-gray-500 dark:text-gray-400">Distancia</p>
                    <p className="text-lg font-semibold text-gray-900 dark:text-white">
                      {ruta.distancia} km
                    </p>
                  </div>
                  <div>
                    <p className="text-xs text-gray-500 dark:text-gray-400">Duración</p>
                    <p className="text-lg font-semibold text-gray-900 dark:text-white">
                      {ruta.duracion} min
                    </p>
                  </div>
                  <div>
                    <p className="text-xs text-gray-500 dark:text-gray-400">Tiempo ahorrado</p>
                    <p className="text-lg font-semibold text-emerald-600 dark:text-emerald-400">
                      +{ruta.tiempoAhorrado} min
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {vistaActiva === 'predicciones' && (
          <div className="space-y-4">
            {prediccionesHistorialMock.map(pred => (
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
                      {new Date(pred.fecha).toLocaleDateString('es-ES')} - {pred.horaConsulta}
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
                      pred.precisionReal >= 90 ? 'bg-green-100 text-green-800' :
                      pred.precisionReal >= 75 ? 'bg-yellow-100 text-yellow-800' :
                      'bg-red-100 text-red-800'
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

        {vistaActiva === 'estadisticas' && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl p-6 text-white">
              <Navigation className="w-8 h-8 mb-3 opacity-80" />
              <p className="text-sm opacity-90 mb-1">Rutas consultadas</p>
              <p className="text-3xl font-bold">{totalRutas}</p>
            </div>

            <div className="bg-gradient-to-br from-emerald-500 to-emerald-600 rounded-xl p-6 text-white">
              <MapPin className="w-8 h-8 mb-3 opacity-80" />
              <p className="text-sm opacity-90 mb-1">Kilómetros recorridos</p>
              <p className="text-3xl font-bold">{totalKm.toFixed(1)} km</p>
            </div>

            <div className="bg-gradient-to-br from-purple-500 to-purple-600 rounded-xl p-6 text-white">
              <Clock className="w-8 h-8 mb-3 opacity-80" />
              <p className="text-sm opacity-90 mb-1">Tiempo ahorrado</p>
              <p className="text-3xl font-bold">{totalTiempoAhorrado} min</p>
            </div>

            <div className="bg-gradient-to-br from-orange-500 to-orange-600 rounded-xl p-6 text-white">
              <TrendingUp className="w-8 h-8 mb-3 opacity-80" />
              <p className="text-sm opacity-90 mb-1">Precisión promedio</p>
              <p className="text-3xl font-bold">{precisionPromedio.toFixed(0)}%</p>
            </div>
          </div>
        )}

        {/* Modal de confirmación de eliminación */}
        {mostrarConfirmacionEliminar && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-2xl max-w-md w-full p-6">
              <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-4">
                ¿Eliminar todo el historial?
              </h3>
              <p className="text-gray-600 dark:text-gray-400 mb-6">
                Esta acción eliminará permanentemente todas tus rutas y predicciones guardadas. 
                No se puede deshacer.
              </p>
              <div className="flex space-x-4">
                <button
                  onClick={eliminarHistorial}
                  className="flex-1 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors font-medium"
                >
                  Sí, eliminar todo
                </button>
                <button
                  onClick={() => setMostrarConfirmacionEliminar(false)}
                  className="flex-1 px-4 py-2 bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-300 dark:hover:bg-gray-600 transition-colors font-medium"
                >
                  Cancelar
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </AppLayout>
  );
}
