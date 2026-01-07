"use client";
import { useState, useEffect } from "react";
import { useTranslation } from "@/hooks/useTranslation";
import { AppLayout } from "@/components/layout/AppLayout";
import { getBackendUrl } from "@/lib/backend-url";

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

// Tipos para ciudades del backend
interface Ciudad {
  nombre: string;
  provincia: string;
  registros: number;
}

// Función para obtener ciudades disponibles
async function fetchCiudades(): Promise<Ciudad[]> {
  const backendUrl = getBackendUrl();
  try {
    const response = await fetch(`${backendUrl}/api/v1/dataset/ciudades`);
    if (!response.ok) throw new Error('Error al cargar ciudades');
    const data = await response.json();
    return data.ciudades || [];
  } catch (error) {
    console.error('Error fetching ciudades:', error);
    return [];
  }
}

// Función para obtener predicciones reales del backend
async function fetchPredicciones(ciudad: string, hora: string): Promise<PrediccionData | null> {
  const backendUrl = getBackendUrl();
  try {
    const response = await fetch(`${backendUrl}/api/v1/predictions/velocity-analysis?ciudad=${encodeURIComponent(ciudad)}`);
    if (!response.ok) throw new Error('Error al obtener predicciones');
    const data = await response.json();
    
    // Transformar respuesta del backend a formato de la UI
    return {
      zona: ciudad,
      fecha: new Date().toISOString().slice(0, 10),
      hora: hora,
      velocidades: data.velocidades || [],
      congestion: data.congestion || [],
      confianza: data.confianza || 0.85,
      ultimaActualizacion: new Date().toLocaleTimeString()
    };
  } catch (error) {
    console.error('Error fetching predicciones:', error);
    return null;
  }
}

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
  const minVelocidad = Math.min(...data.map(d => d.velocidad));
  const avgVelocidad = data.reduce((sum, d) => sum + d.velocidad, 0) / data.length;
  
  return (
    <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg border border-gray-200 dark:border-gray-700 p-6 hover:shadow-xl transition-shadow duration-300">
      {/* Header con gradiente */}
      <div className="mb-6 pb-4 border-b border-gray-200 dark:border-gray-700">
        <h2 className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent mb-2">{title}</h2>
        <p className="text-sm text-gray-500 dark:text-gray-400">Velocidad promedio del tráfico por hora</p>
      </div>
      
      {/* Estadísticas destacadas */}
      <div className="mb-6 grid grid-cols-3 gap-4">
        <div className="px-4 py-3 bg-gradient-to-br from-green-50 to-green-100 dark:from-green-900/30 dark:to-green-800/20 rounded-xl border border-green-200 dark:border-green-700 shadow-sm hover:shadow-md transition-shadow">
          <div className="flex items-center space-x-2 mb-1">
            <svg className="w-4 h-4 text-green-600 dark:text-green-400" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M3.293 9.707a1 1 0 010-1.414l6-6a1 1 0 011.414 0l6 6a1 1 0 01-1.414 1.414L11 5.414V17a1 1 0 11-2 0V5.414L4.707 9.707a1 1 0 01-1.414 0z" clipRule="evenodd" />
            </svg>
            <div className="text-xs font-medium text-green-700 dark:text-green-400">Máxima</div>
          </div>
          <div className="text-2xl font-bold text-green-800 dark:text-green-300">{maxVelocidad.toFixed(0)}</div>
          <div className="text-xs text-green-600 dark:text-green-500">km/h</div>
        </div>
        
        <div className="px-4 py-3 bg-gradient-to-br from-blue-50 to-blue-100 dark:from-blue-900/30 dark:to-blue-800/20 rounded-xl border border-blue-200 dark:border-blue-700 shadow-sm hover:shadow-md transition-shadow">
          <div className="flex items-center space-x-2 mb-1">
            <svg className="w-4 h-4 text-blue-600 dark:text-blue-400" fill="currentColor" viewBox="0 0 20 20">
              <path d="M2 11a1 1 0 011-1h2a1 1 0 011 1v5a1 1 0 01-1 1H3a1 1 0 01-1-1v-5zM8 7a1 1 0 011-1h2a1 1 0 011 1v9a1 1 0 01-1 1H9a1 1 0 01-1-1V7zM14 4a1 1 0 011-1h2a1 1 0 011 1v12a1 1 0 01-1 1h-2a1 1 0 01-1-1V4z" />
            </svg>
            <div className="text-xs font-medium text-blue-700 dark:text-blue-400">Promedio</div>
          </div>
          <div className="text-2xl font-bold text-blue-800 dark:text-blue-300">{avgVelocidad.toFixed(0)}</div>
          <div className="text-xs text-blue-600 dark:text-blue-500">km/h</div>
        </div>
        
        <div className="px-4 py-3 bg-gradient-to-br from-orange-50 to-orange-100 dark:from-orange-900/30 dark:to-orange-800/20 rounded-xl border border-orange-200 dark:border-orange-700 shadow-sm hover:shadow-md transition-shadow">
          <div className="flex items-center space-x-2 mb-1">
            <svg className="w-4 h-4 text-orange-600 dark:text-orange-400" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M16.707 10.293a1 1 0 010 1.414l-6 6a1 1 0 01-1.414 0l-6-6a1 1 0 111.414-1.414L9 14.586V3a1 1 0 012 0v11.586l4.293-4.293a1 1 0 011.414 0z" clipRule="evenodd" />
            </svg>
            <div className="text-xs font-medium text-orange-700 dark:text-orange-400">Mínima</div>
          </div>
          <div className="text-2xl font-bold text-orange-800 dark:text-orange-300">{minVelocidad.toFixed(0)}</div>
          <div className="text-xs text-orange-600 dark:text-orange-500">km/h</div>
        </div>
      </div>
      
      {/* Gráfico de barras mejorado con líneas de referencia */}
      <div className="relative pb-8">
        {/* Líneas de referencia horizontales con etiquetas de velocidad */}
        <div className="absolute inset-0 flex flex-col justify-between pointer-events-none pl-16 pr-4">
          <div className="relative w-full border-t border-gray-300 dark:border-gray-600 border-dashed">
            <span className="absolute -left-14 -top-3 text-xs text-gray-500 dark:text-gray-400 font-medium">{maxVelocidad.toFixed(0)}</span>
          </div>
          <div className="relative w-full border-t border-gray-200 dark:border-gray-700 border-dashed">
            <span className="absolute -left-14 -top-3 text-xs text-gray-400 dark:text-gray-500">{(maxVelocidad * 0.75).toFixed(0)}</span>
          </div>
          <div className="relative w-full border-t border-gray-200 dark:border-gray-700 border-dashed">
            <span className="absolute -left-14 -top-3 text-xs text-gray-400 dark:text-gray-500">{(maxVelocidad * 0.5).toFixed(0)}</span>
          </div>
          <div className="relative w-full border-t border-gray-200 dark:border-gray-700 border-dashed">
            <span className="absolute -left-14 -top-3 text-xs text-gray-400 dark:text-gray-500">{(maxVelocidad * 0.25).toFixed(0)}</span>
          </div>
          <div className="relative w-full border-t border-gray-300 dark:border-gray-600 border-dashed">
            <span className="absolute -left-14 -top-3 text-xs text-gray-500 dark:text-gray-400 font-medium">0</span>
          </div>
        </div>
        
        <div className="h-64 flex items-end justify-between gap-0.5 pl-16 pr-2 overflow-visible">
          {data.map((item, index) => {
            const altura = maxVelocidad > 0 ? Math.max(12, (item.velocidad / maxVelocidad) * 220) : 12;
            const color = item.velocidad > 50 ? 'from-emerald-400 via-green-500 to-green-600' : 
                          item.velocidad > 30 ? 'from-amber-400 via-yellow-500 to-orange-500' : 
                          'from-red-400 via-red-500 to-red-600';
            const borderColor = item.velocidad > 50 ? 'border-green-300 dark:border-green-600' : 
                                item.velocidad > 30 ? 'border-yellow-300 dark:border-yellow-600' : 
                                'border-red-300 dark:border-red-600';
            
            return (
              <div key={index} className="flex-1 flex flex-col items-center group min-w-[28px] max-w-[40px]">
                <div className="w-full relative">
                  {/* Tooltip mejorado con animación */}
                  <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-3 opacity-0 group-hover:opacity-100 transition-all duration-200 scale-95 group-hover:scale-100 z-20 pointer-events-none">
                    <div className="bg-gradient-to-br from-gray-900 to-gray-800 dark:from-gray-700 dark:to-gray-600 text-white text-xs rounded-xl py-3 px-4 shadow-2xl whitespace-nowrap border border-gray-700 dark:border-gray-500">
                      <div className="font-bold text-sm mb-2 text-blue-300">{item.hora}</div>
                      <div className="flex items-center space-x-2 mb-1.5">
                        <svg className="w-4 h-4 text-green-400" fill="currentColor" viewBox="0 0 20 20">
                          <path d="M10 12a2 2 0 100-4 2 2 0 000 4z" />
                          <path fillRule="evenodd" d="M.458 10C1.732 5.943 5.522 3 10 3s8.268 2.943 9.542 7c-1.274 4.057-5.064 7-9.542 7S1.732 14.057.458 10zM14 10a4 4 0 11-8 0 4 4 0 018 0z" clipRule="evenodd" />
                        </svg>
                        <span className="text-lg font-bold">{item.velocidad.toFixed(1)}</span>
                        <span className="text-gray-300">km/h</span>
                      </div>
                      <div className="flex items-center space-x-2 pt-2 border-t border-gray-700 dark:border-gray-500">
                        <svg className="w-3 h-3 text-purple-400" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M6.267 3.455a3.066 3.066 0 001.745-.723 3.066 3.066 0 013.976 0 3.066 3.066 0 001.745.723 3.066 3.066 0 012.812 2.812c.051.643.304 1.254.723 1.745a3.066 3.066 0 010 3.976 3.066 3.066 0 00-.723 1.745 3.066 3.066 0 01-2.812 2.812 3.066 3.066 0 00-1.745.723 3.066 3.066 0 01-3.976 0 3.066 3.066 0 00-1.745-.723 3.066 3.066 0 01-2.812-2.812 3.066 3.066 0 00-.723-1.745 3.066 3.066 0 010-3.976 3.066 3.066 0 00.723-1.745 3.066 3.066 0 012.812-2.812zm7.44 5.252a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                        </svg>
                        <div className="flex-1 bg-gray-700 dark:bg-gray-600 rounded-full h-1.5">
                          <div 
                            className="bg-gradient-to-r from-blue-400 to-purple-500 h-1.5 rounded-full transition-all"
                            style={{ width: `${item.confianza * 100}%` }}
                          ></div>
                        </div>
                        <span className="text-gray-300 text-xs font-semibold">{(item.confianza * 100).toFixed(0)}%</span>
                      </div>
                      {/* Flecha del tooltip */}
                      <div className="absolute top-full left-1/2 transform -translate-x-1/2 -mt-px">
                        <div className="border-8 border-transparent border-t-gray-800 dark:border-t-gray-600"></div>
                      </div>
                    </div>
                  </div>
                  
                  {/* Barra del gráfico con efectos mejorados */}
                  <div 
                    className={`w-full bg-gradient-to-t ${color} rounded-t-lg transition-all duration-300 group-hover:scale-105 shadow-md group-hover:shadow-xl cursor-pointer border ${borderColor} relative overflow-hidden`}
                    style={{ height: `${altura}px`, minHeight: '12px' }}
                  >
                    {/* Efecto de brillo */}
                    <div className="absolute inset-0 bg-gradient-to-t from-transparent via-white/20 to-white/40 opacity-0 group-hover:opacity-100 transition-opacity"></div>
                    
                    {/* Indicador de valor en la barra */}
                    {altura > 30 && (
                      <div className="absolute top-1 left-0 right-0 text-center">
                        <span className="text-[10px] font-bold text-white drop-shadow-lg opacity-0 group-hover:opacity-100 transition-opacity">
                          {item.velocidad.toFixed(0)}
                        </span>
                      </div>
                    )}
                  </div>
                </div>
                <div className="text-[10px] font-medium text-gray-600 dark:text-gray-400 mt-2 transform -rotate-45 origin-top-left whitespace-nowrap group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
                  {item.hora}
                </div>
              </div>
            );
          })}
        </div>
      </div>
      
      {/* Leyenda mejorada */}
      <div className="mt-8 pt-4 border-t border-gray-200 dark:border-gray-700">
        <div className="flex justify-center flex-wrap gap-6 text-sm mb-4">
          <div className="flex items-center space-x-2 px-3 py-1.5 bg-green-50 dark:bg-green-900/20 rounded-lg">
            <div className="w-4 h-4 bg-gradient-to-r from-green-400 to-green-600 rounded shadow-sm"></div>
            <span className="text-gray-700 dark:text-gray-300 font-medium">Fluido</span>
            <span className="text-gray-500 dark:text-gray-400 text-xs">(&gt;50 km/h)</span>
          </div>
          <div className="flex items-center space-x-2 px-3 py-1.5 bg-yellow-50 dark:bg-yellow-900/20 rounded-lg">
            <div className="w-4 h-4 bg-gradient-to-r from-yellow-400 to-orange-500 rounded shadow-sm"></div>
            <span className="text-gray-700 dark:text-gray-300 font-medium">Moderado</span>
            <span className="text-gray-500 dark:text-gray-400 text-xs">(30-50 km/h)</span>
          </div>
          <div className="flex items-center space-x-2 px-3 py-1.5 bg-red-50 dark:bg-red-900/20 rounded-lg">
            <div className="w-4 h-4 bg-gradient-to-r from-red-400 to-red-600 rounded shadow-sm"></div>
            <span className="text-gray-700 dark:text-gray-300 font-medium">Congestionado</span>
            <span className="text-gray-500 dark:text-gray-400 text-xs">(&lt;30 km/h)</span>
          </div>
        </div>
        
        {/* Información adicional sobre métricas de velocidad */}
        <div className="mt-4 px-4 py-4 bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-900/20 dark:to-indigo-900/20 rounded-lg border border-blue-200 dark:border-blue-700">
          <div className="flex items-start space-x-3">
            <svg className="w-6 h-6 text-blue-600 dark:text-blue-400 mt-0.5 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
            </svg>
            <div className="flex-1">
              <h4 className="text-sm font-bold text-blue-900 dark:text-blue-200 mb-2">
                📊 Velocidades Recomendadas según Normativa Ecuatoriana
              </h4>
              <div className="text-xs text-blue-800 dark:text-blue-300 space-y-2">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  <div className="bg-white/50 dark:bg-gray-800/30 rounded-lg p-3 border border-blue-100 dark:border-blue-800">
                    <div className="font-semibold text-blue-900 dark:text-blue-200 mb-1.5 flex items-center">
                      <span className="mr-2">🏙️</span> Zonas Urbanas
                    </div>
                    <div className="space-y-1 pl-6">
                      <div className="flex justify-between">
                        <span>Vehículos Livianos:</span>
                        <span className="font-bold">50-60 km/h</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Vehículos Pesados:</span>
                        <span className="font-bold">40-50 km/h</span>
                      </div>
                      <div className="text-xs text-blue-600 dark:text-blue-400 mt-1">
                        (Av. Metropolitana, Av. 4 de Noviembre)
                      </div>
                    </div>
                  </div>
                  
                  <div className="bg-white/50 dark:bg-gray-800/30 rounded-lg p-3 border border-blue-100 dark:border-blue-800">
                    <div className="font-semibold text-blue-900 dark:text-blue-200 mb-1.5 flex items-center">
                      <span className="mr-2">🛣️</span> Vías Perimetrales
                    </div>
                    <div className="space-y-1 pl-6">
                      <div className="flex justify-between">
                        <span>Vehículos Livianos:</span>
                        <span className="font-bold">90 km/h</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Vehículos Pesados:</span>
                        <span className="font-bold">70 km/h</span>
                      </div>
                      <div className="text-xs text-blue-600 dark:text-blue-400 mt-1">
                        (Autopista C. Manabí Guillén)
                      </div>
                    </div>
                  </div>
                  
                  <div className="bg-white/50 dark:bg-gray-800/30 rounded-lg p-3 border border-blue-100 dark:border-blue-800">
                    <div className="font-semibold text-blue-900 dark:text-blue-200 mb-1.5 flex items-center">
                      <span className="mr-2">🛤️</span> Carreteras
                    </div>
                    <div className="space-y-1 pl-6">
                      <div className="flex justify-between">
                        <span>Rectas:</span>
                        <span className="font-bold">100 km/h</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Curvas:</span>
                        <span className="font-bold">60 km/h</span>
                      </div>
                      <div className="text-xs text-blue-600 dark:text-blue-400 mt-1">
                        (Vías interprovinciales)
                      </div>
                    </div>
                  </div>
                  
                  <div className="bg-white/50 dark:bg-gray-800/30 rounded-lg p-3 border border-blue-100 dark:border-blue-800">
                    <div className="font-semibold text-blue-900 dark:text-blue-200 mb-1.5 flex items-center">
                      <span className="mr-2">📈</span> Datos Históricos
                    </div>
                    <div className="space-y-1 pl-6">
                      <div className="text-xs text-blue-700 dark:text-blue-300">
                        Basados en 5,560 registros de excesos de velocidad en vías interprovinciales de Ecuador (2022)
                      </div>
                      <div className="text-xs text-blue-600 dark:text-blue-400 mt-1 font-medium">
                        ⚠️ Los valores mostrados son para referencia de patrones históricos de tráfico
                      </div>
                    </div>
                  </div>
                </div>
                
                <div className="mt-3 pt-3 border-t border-blue-200 dark:border-blue-700">
                  <div className="flex items-start space-x-2">
                    <span className="text-lg">⚠️</span>
                    <div className="text-xs">
                      <span className="font-semibold text-blue-900 dark:text-blue-200">Importante:</span> 
                      <span className="text-blue-700 dark:text-blue-300"> Siempre respeta la señalización local. Los límites pueden variar según condiciones específicas de cada vía.</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
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
      <h2 className="text-xl font-semibold mb-6 text-gray-800 dark:text-gray-200">{title}</h2>
      
      <div className="space-y-6">
        {data.map((item, index) => (
          <div key={index} className="group">
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center space-x-3">
                <div className="w-24 text-sm font-semibold text-gray-700 dark:text-gray-300">
                  {item.zona}
                </div>
                <span className={`text-xs font-medium px-3 py-1 rounded-full ${
                  item.congestion >= 0.7 ? 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200' :
                  item.congestion >= 0.4 ? 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200' : 
                  'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200'
                }`}>
                  {item.nivel}
                </span>
              </div>
              <span className="text-sm font-bold text-gray-700 dark:text-gray-300">
                {(item.congestion * 100).toFixed(0)}%
              </span>
            </div>
            
            <div className="relative">
              <div className="flex-1 bg-gray-200 dark:bg-gray-700 rounded-full h-8 relative overflow-hidden shadow-inner">
                <div
                  className={`h-full rounded-full transition-all duration-1000 ease-out group-hover:opacity-90 ${
                    item.congestion >= 0.7 ? 'bg-gradient-to-r from-red-500 to-red-600' :
                    item.congestion >= 0.4 ? 'bg-gradient-to-r from-yellow-500 to-yellow-600' : 
                    'bg-gradient-to-r from-green-500 to-green-600'
                  }`}
                  style={{ width: `${item.congestion * 100}%` }}
                >
                  <div className="absolute inset-0 bg-white opacity-20"></div>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
      
      {/* Leyenda mejorada */}
      <div className="mt-6 pt-4 border-t border-gray-200 dark:border-gray-700">
        <div className="flex flex-wrap justify-center gap-4 text-sm">
          <div className="flex items-center space-x-2">
            <div className="w-4 h-4 bg-gradient-to-r from-green-500 to-green-600 rounded"></div>
            <span className="text-gray-600 dark:text-gray-400">Baja (&lt;30%)</span>
          </div>
          <div className="flex items-center space-x-2">
            <div className="w-4 h-4 bg-gradient-to-r from-yellow-500 to-yellow-600 rounded"></div>
            <span className="text-gray-600 dark:text-gray-400">Media (30-70%)</span>
          </div>
          <div className="flex items-center space-x-2">
            <div className="w-4 h-4 bg-gradient-to-r from-red-500 to-red-600 rounded"></div>
            <span className="text-gray-600 dark:text-gray-400">Alta (&gt;70%)</span>
          </div>
        </div>
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
  const [ciudad, setCiudad] = useState("");
  const [ciudadesDisponibles, setCiudadesDisponibles] = useState<Ciudad[]>([]);
  const [fecha, setFecha] = useState(() => new Date().toISOString().slice(0, 10));
  const [hora, setHora] = useState("08:00");
  
  // Estados para la aplicación
  const [loading, setLoading] = useState(false);
  const [loadingCiudades, setLoadingCiudades] = useState(true);
  const [error, setError] = useState("");
  const [prediccionData, setPrediccionData] = useState<PrediccionData | null>(null);

  // Cargar ciudades disponibles al montar el componente
  useEffect(() => {
    const loadCiudades = async () => {
      setLoadingCiudades(true);
      const ciudades = await fetchCiudades();
      setCiudadesDisponibles(ciudades);
      // Seleccionar primera ciudad por defecto
      if (ciudades && ciudades.length > 0) {
        setCiudad(ciudades[0]?.nombre || "");
      }
      setLoadingCiudades(false);
    };
    loadCiudades();
  }, []);

  // Consulta real al backend
  const consultarPrediccion = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!ciudad) {
      setError("Por favor selecciona una ciudad");
      return;
    }
    
    setLoading(true);
    setError("");
    
    try {
      // Llamar al backend real
      const data = await fetchPredicciones(ciudad, hora);
      
      if (!data) {
        throw new Error('No se pudieron obtener los datos');
      }
      
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
                Ciudad
              </label>
              <select 
                value={ciudad} 
                onChange={e => setCiudad(e.target.value)} 
                className="w-full border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                disabled={loading || loadingCiudades}
              >
                {loadingCiudades ? (
                  <option>Cargando ciudades...</option>
                ) : ciudadesDisponibles.length === 0 ? (
                  <option>No hay ciudades disponibles</option>
                ) : (
                  ciudadesDisponibles.map((c) => (
                    <option key={c.nombre} value={c.nombre}>
                      {c.nombre} ({c.provincia})
                    </option>
                  ))
                )}
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

        {/* Gráficos - Cambiado a layout vertical */}
        {prediccionData && (
          <div className="space-y-8 mb-8">
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