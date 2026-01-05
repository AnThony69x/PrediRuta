"use client";
import { useState } from "react";
import { useTranslation } from "@/hooks/useTranslation";
import { AppLayout } from "@/components/layout/AppLayout";

// Tipos de datos (luego se moverán a un archivo types separado)
interface VelocidadData {
  hora: string;
  velocidad: number;
  confianza: number;
}

interface CongestionData {
  zona: string;
  congestion: number;
  nivel: string;
  color: string;
}

interface PrediccionData {
  zona: string;
  fecha: string;
  hora: string;
  velocidades: VelocidadData[];
  congestion: CongestionData[];
  confianza: number;
  ultimaActualizacion: string;
}

// Simulación de datos más realistas (reemplazar por backend después)
const generateMockData = (zona: string, hora: string): PrediccionData => {
  const velocidades: VelocidadData[] = [
    { hora: "06:00", velocidad: 45, confianza: 0.85 },
    { hora: "07:00", velocidad: 35, confianza: 0.90 },
    { hora: "08:00", velocidad: 25, confianza: 0.95 },
    { hora: "09:00", velocidad: 40, confianza: 0.88 },
    { hora: "10:00", velocidad: 50, confianza: 0.82 },
    { hora: "11:00", velocidad: 55, confianza: 0.80 },
    { hora: "12:00", velocidad: 30, confianza: 0.92 },
    { hora: "13:00", velocidad: 28, confianza: 0.90 },
    { hora: "14:00", velocidad: 35, confianza: 0.87 },
    { hora: "15:00", velocidad: 52, confianza: 0.83 },
    { hora: "16:00", velocidad: 40, confianza: 0.88 },
    { hora: "17:00", velocidad: 28, confianza: 0.94 },
    { hora: "18:00", velocidad: 22, confianza: 0.96 },
    { hora: "19:00", velocidad: 35, confianza: 0.89 },
    { hora: "20:00", velocidad: 42, confianza: 0.85 },
  ];

  const congestion: CongestionData[] = [
    { zona: "Centro", congestion: 0.85, nivel: "Muy Alta", color: "text-red-600" },
    { zona: "Norte", congestion: 0.45, nivel: "Media", color: "text-yellow-600" },
    { zona: "Sur", congestion: 0.65, nivel: "Alta", color: "text-orange-600" },
    { zona: "Este", congestion: 0.40, nivel: "Media", color: "text-yellow-600" },
    { zona: "Oeste", congestion: 0.25, nivel: "Baja", color: "text-green-600" },
  ];

  return {
    zona,
    fecha: new Date().toISOString().split('T')[0] || '',
    hora,
    velocidades,
    congestion,
    confianza: 0.87,
    ultimaActualizacion: new Date().toISOString()
  };
};

// Helper para mostrar nivel de congestión
function getCongestionLevel(c: number): string {
  if (c >= 0.7) return "Alta";
  if (c >= 0.4) return "Media";
  return "Baja";
}

// Helper para obtener color de velocidad
function getVelocidadColor(velocidad: number): string {
  if (velocidad >= 50) return "bg-green-500";
  if (velocidad >= 30) return "bg-yellow-500";
  return "bg-red-500";
}

// Componente gráfico mejorado para velocidades
function LineChart({ data, title = "Análisis de Velocidades" }: { data: VelocidadData[], title?: string }) {
  if (!data || data.length === 0) {
    return (
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6">
        <h2 className="text-xl font-semibold mb-4 text-gray-800 dark:text-gray-200">{title}</h2>
        <div className="flex items-center justify-center h-40 bg-gray-50 dark:bg-gray-900 rounded-lg">
          <p className="text-gray-500 dark:text-gray-400">No hay datos disponibles</p>
        </div>
      </div>
    );
  }

  const maxVelocidad = Math.max(...data.map(d => d.velocidad));
  
  return (
    <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6">
      <h2 className="text-xl font-semibold mb-4 text-gray-800 dark:text-gray-200">{title}</h2>
      
      {/* Gráfico de barras */}
      <div className="flex items-end justify-between h-48 bg-gradient-to-t from-gray-50 to-white dark:from-gray-900 dark:to-gray-800 p-4 rounded-lg mb-4">
        {data.map((item, index) => {
          const altura = maxVelocidad > 0 ? Math.max(8, (item.velocidad / maxVelocidad) * 160) : 8;
          
          return (
            <div key={index} className="flex flex-col items-center group relative">
              {/* Tooltip */}
              <div className="absolute bottom-full mb-2 opacity-0 group-hover:opacity-100 transition-opacity bg-gray-900 dark:bg-gray-700 text-white text-xs px-2 py-1 rounded shadow-lg whitespace-nowrap">
                <div>{item.velocidad} km/h</div>
                <div>Confianza: {(item.confianza * 100).toFixed(0)}%</div>
              </div>
              
              {/* Barra */}
              <div
                className={`rounded-t transition-all duration-300 hover:opacity-80 ${getVelocidadColor(item.velocidad)}`}
                style={{
                  width: "16px",
                  height: `${altura}px`,
                  minHeight: "8px"
                }}
              ></div>
              
              {/* Etiqueta */}
              <span className="text-xs mt-2 text-gray-600 dark:text-gray-400 font-medium">
                {item.hora}
              </span>
            </div>
          );
        })}
      </div>
      
      {/* Leyenda */}
      <div className="flex justify-center space-x-6 text-sm">
        <div className="flex items-center space-x-2">
          <div className="w-3 h-3 bg-green-500 rounded"></div>
          <span className="text-gray-600 dark:text-gray-400">Fluido (&gt;50 km/h)</span>
        </div>
        <div className="flex items-center space-x-2">
          <div className="w-3 h-3 bg-yellow-500 rounded"></div>
          <span className="text-gray-600 dark:text-gray-400">Moderado (30-50 km/h)</span>
        </div>
        <div className="flex items-center space-x-2">
          <div className="w-3 h-3 bg-red-500 rounded"></div>
          <span className="text-gray-600 dark:text-gray-400">Congestionado (&lt;30 km/h)</span>
        </div>
      </div>
    </div>
  );
}

// Componente gráfico mejorado para congestión
function BarChart({ data, title = "Niveles de Congestión" }: { data: CongestionData[], title?: string }) {
  if (!data || data.length === 0) {
    return (
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6">
        <h2 className="text-xl font-semibold mb-4 text-gray-800 dark:text-gray-200">{title}</h2>
        <div className="flex items-center justify-center h-40 bg-gray-50 dark:bg-gray-900 rounded-lg">
          <p className="text-gray-500 dark:text-gray-400">No hay datos disponibles</p>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6">
      <h2 className="text-xl font-semibold mb-4 text-gray-800 dark:text-gray-200">{title}</h2>
      
      <div className="space-y-4">
        {data.map((item, index) => (
          <div key={index} className="flex items-center space-x-4">
            <div className="w-16 text-sm font-medium text-gray-700 dark:text-gray-300">
              {item.zona}
            </div>
            
            <div className="flex-1 bg-gray-200 dark:bg-gray-700 rounded-full h-6 relative overflow-hidden">
              <div
                className={`h-full rounded-full transition-all duration-1000 ${
                  item.congestion >= 0.7 ? 'bg-red-500' :
                  item.congestion >= 0.4 ? 'bg-yellow-500' : 'bg-green-500'
                }`}
                style={{ width: `${item.congestion * 100}%` }}
              ></div>
              <div className="absolute inset-0 flex items-center justify-center">
                <span className="text-xs font-medium text-gray-700 dark:text-gray-300">
                  {(item.congestion * 100).toFixed(0)}%
                </span>
              </div>
            </div>
            
            <div className="w-20 text-right">
              <span className={`text-sm font-medium px-2 py-1 rounded-full ${
                item.congestion >= 0.7 ? 'bg-red-100 text-red-800' :
                item.congestion >= 0.4 ? 'bg-yellow-100 text-yellow-800' : 'bg-green-100 text-green-800'
              }`}>
                {item.nivel}
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

// Componente de resumen mejorado
function ResumenPrediccion({ data, t }: { data: PrediccionData | null, t: any }) {
  if (!data) {
    return (
      <div className="bg-gray-50 dark:bg-gray-900 border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-xl p-8 text-center">
        <div className="text-gray-400 dark:text-gray-500 mb-4">
          <svg className="mx-auto h-12 w-12" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
          </svg>
        </div>
        <h3 className="text-lg font-semibold text-gray-700 dark:text-gray-300 mb-2">Sin predicción</h3>
        <p className="text-gray-500 dark:text-gray-400">Selecciona una zona, fecha y hora para ver la predicción</p>
      </div>
    );
  }

  const velocidadActual = data.velocidades.find(v => v.hora === data.hora);
  const congestionZona = data.congestion.find(c => c.zona === data.zona);
  
  return (
    <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 overflow-hidden">
      {/* Header */}
      <div className="bg-gradient-to-r from-blue-600 to-indigo-600 px-6 py-4">
        <h2 className="text-xl font-bold text-white flex items-center">
          <svg className="w-6 h-6 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
          </svg>
          {t('sidebar.predictions')} - {data.zona}
        </h2>
      </div>

      <div className="p-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Información de zona */}
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
            <h3 className="font-semibold text-blue-900 mb-2">{t('dashboard.predictions.zone')}</h3>
            <div className="text-2xl font-bold text-blue-800">{data.zona}</div>
            <div className="text-sm text-blue-600 mt-1">
              {data.hora} - {new Date(data.fecha).toLocaleDateString()}
            </div>
          </div>

          {/* Velocidad estimada */}
          <div className="bg-gray-50 border border-gray-200 rounded-lg p-4">
            <h3 className="font-semibold text-gray-900 mb-2">{t('dashboard.predictions.estimatedSpeed')}</h3>
            <div className="text-2xl font-bold text-gray-800">
              {velocidadActual?.velocidad || 0} km/h
            </div>
            <div className="text-sm text-gray-600 mt-1">
              {t('dashboard.predictions.confidence')}: {((velocidadActual?.confianza || 0) * 100).toFixed(0)}%
            </div>
          </div>

          {/* Congestión */}
          <div className={`border rounded-lg p-4 ${
            (congestionZona?.congestion || 0) >= 0.7 ? 'bg-red-50 border-red-200' :
            (congestionZona?.congestion || 0) >= 0.4 ? 'bg-yellow-50 border-yellow-200' : 'bg-green-50 border-green-200'
          }`}>
            <h3 className={`font-semibold mb-2 ${congestionZona?.color || 'text-gray-900'}`}>
              {t('dashboard.predictions.congestion')}
            </h3>
            <div className={`text-2xl font-bold ${congestionZona?.color || 'text-gray-800'}`}>
              {congestionZona?.nivel || 'Desconocida'}
            </div>
            <div className={`text-sm mt-1 ${congestionZona?.color || 'text-gray-600'}`}>
              {((congestionZona?.congestion || 0) * 100).toFixed(0)}{t('dashboard.predictions.saturation')}
            </div>
          </div>

          {/* Confianza general */}
          <div className="bg-purple-50 border border-purple-200 rounded-lg p-4">
            <h3 className="font-semibold text-purple-900 mb-2">{t('dashboard.predictions.generalConfidence')}</h3>
            <div className="text-2xl font-bold text-purple-800">
              {(data.confianza * 100).toFixed(0)}%
            </div>
            <div className="text-sm text-purple-600 mt-1">
              {t('dashboard.predictions.basedOnHistorical')}
            </div>
          </div>
        </div>
        
        {/* Última actualización */}
        <div className="mt-6 pt-4 border-t border-gray-200 text-center">
          <p className="text-xs text-gray-500">
            {t('dashboard.predictions.lastUpdate')}: {new Date(data.ultimaActualizacion).toLocaleString()}
          </p>
        </div>
      </div>
    </div>
  );
}

export default function PrediccionesPage() {
  const { t } = useTranslation();
  // Estados para filtros
  const [zona, setZona] = useState("Centro");
  const [fecha, setFecha] = useState(() => new Date().toISOString().slice(0, 10));
  const [hora, setHora] = useState("08:00");
  
  // Estados para la aplicación
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [prediccionData, setPrediccionData] = useState<PrediccionData | null>(null);

  // Simulación de consulta (en el futuro llamarás al backend)
  const consultarPrediccion = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    
    try {
      // Simulación de delay de API
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      // Generar datos simulados
      const data = generateMockData(zona, hora);
      setPrediccionData(data);
      
    } catch (err) {
      setError(t('dashboard.predictions.error'));
    } finally {
      setLoading(false);
    }
  };

  return (
    <AppLayout>
      <main className="min-h-screen bg-gradient-to-b from-gray-50 via-blue-50 to-purple-50 dark:from-gray-900 dark:via-blue-950 dark:to-purple-950 py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 bg-clip-text text-transparent mb-4">
            {t('sidebar.predictions')}
          </h1>
          <p className="text-lg text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
            {t('routes.subtitle')}
          </p>
        </div>

        {/* Formulario de filtros */}
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6 mb-8">
          <form onSubmit={consultarPrediccion} className="grid grid-cols-1 md:grid-cols-4 gap-4 items-end">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                {t('dashboard.predictions.zone')}
              </label>
              <select 
                value={zona} 
                onChange={e => setZona(e.target.value)} 
                className="w-full border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                disabled={loading}
              >
                <option value="Centro">Centro</option>
                <option value="Norte">Norte</option>
                <option value="Sur">Sur</option>
                <option value="Este">Este</option>
                <option value="Oeste">Oeste</option>
              </select>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                {t('dashboard.predictions.date')}
              </label>
              <input 
                type="date" 
                value={fecha} 
                onChange={e => setFecha(e.target.value)} 
                className="w-full border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                disabled={loading}
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                {t('dashboard.predictions.time')}
              </label>
              <input 
                type="time" 
                value={hora} 
                onChange={e => setHora(e.target.value)} 
                className="w-full border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                disabled={loading}
              />
            </div>
            
            <button
              type="submit"
              disabled={loading}
              className={`px-6 py-2 rounded-lg font-medium transition-all duration-200 flex items-center justify-center space-x-2 ${
                loading 
                  ? "bg-gray-400 cursor-not-allowed" 
                  : "bg-blue-600 hover:bg-blue-700 focus:ring-2 focus:ring-blue-500"
              } text-white`}
            >
              {loading ? (
                <>
                  <svg className="animate-spin h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                  </svg>
                  <span>{t('dashboard.predictions.querying')}</span>
                </>
              ) : (
                <>
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                  </svg>
                  <span>{t('dashboard.predictions.query')}</span>
                </>
              )}
            </button>
          </form>
        </div>

        {/* Resumen de predicción */}
        {(prediccionData || loading) && (
          <div className="mb-8">
            {loading ? (
              <div className="bg-white rounded-xl shadow-sm border p-8 text-center">
                <div className="animate-pulse">
                  <div className="w-16 h-16 bg-gray-200 rounded-full mx-auto mb-4"></div>
                  <div className="h-4 bg-gray-200 rounded w-1/2 mx-auto mb-2"></div>
                  <div className="h-3 bg-gray-200 rounded w-1/3 mx-auto"></div>
                </div>
              </div>
            ) : (
              <ResumenPrediccion data={prediccionData} t={t} />
            )}
          </div>
        )}

        {/* Gráficos */}
        {prediccionData && (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
            <LineChart 
              data={prediccionData.velocidades}
              title={t('dashboard.predictions.speedAnalysis')}
            />
            <BarChart 
              data={prediccionData.congestion}
              title={t('dashboard.predictions.congestionLevels')}
            />
          </div>
        )}

        {/* Mensajes de error */}
        {error && (
          <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg mb-8">
            <div className="flex items-center">
              <svg className="w-5 h-5 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              {error}
            </div>
          </div>
        )}

        {/* Estado inicial */}
        {!prediccionData && !loading && !error && (
          <div className="text-center py-12">
            <svg className="mx-auto h-24 w-24 text-gray-400 dark:text-gray-600 mb-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
            </svg>
            <h3 className="text-xl font-semibold text-gray-700 dark:text-gray-300 mb-3">
              {t('dashboard.predictions.startQuery')}
            </h3>
            <p className="text-gray-500 dark:text-gray-400 max-w-md mx-auto">
              {t('dashboard.predictions.selectZoneDateTime')}
            </p>
          </div>
        )}
        </div>
      </main>
    </AppLayout>
  );
}