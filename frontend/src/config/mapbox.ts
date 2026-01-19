/**
 * Configuración centralizada de Mapbox
 * 
 * Este archivo gestiona toda la configuración de Mapbox para el frontend.
 * Incluye validación de tokens, estilos predefinidos y configuración de límites.
 */

// Validar que el token de Mapbox esté configurado
const MAPBOX_TOKEN = process.env.NEXT_PUBLIC_MAPBOX_ACCESS_TOKEN;

if (!MAPBOX_TOKEN || MAPBOX_TOKEN === 'your-mapbox-public-token-here') {
  console.warn('⚠️ MAPBOX: Token no configurado. Configura NEXT_PUBLIC_MAPBOX_ACCESS_TOKEN en .env.local');
}

/**
 * Configuración de Mapbox
 */
export const MAPBOX_CONFIG = {
  // Token de acceso público
  accessToken: MAPBOX_TOKEN || '',
  
  // Estilo del mapa por defecto
  defaultStyle: process.env.NEXT_PUBLIC_MAPBOX_STYLE || 'mapbox://styles/mapbox/streets-v12',
  
  // Estilos predefinidos disponibles
  styles: {
    streets: 'mapbox://styles/mapbox/streets-v12',
    outdoors: 'mapbox://styles/mapbox/outdoors-v12',
    light: 'mapbox://styles/mapbox/light-v11',
    dark: 'mapbox://styles/mapbox/dark-v11',
    satellite: 'mapbox://styles/mapbox/satellite-v9',
    satelliteStreets: 'mapbox://styles/mapbox/satellite-streets-v12',
    navigationDay: 'mapbox://styles/mapbox/navigation-day-v1',
    navigationNight: 'mapbox://styles/mapbox/navigation-night-v1',
  },
  
  // Configuración por defecto del mapa
  map: {
    // Centro por defecto: Manta, Ecuador
    defaultCenter: [-80.72, -0.95] as [number, number],
    defaultZoom: 13,
    minZoom: 5,
    maxZoom: 20,
    pitch: 0,
    bearing: 0,
  },
  
  // Configuración de tráfico
  traffic: {
    // Colores para niveles de tráfico
    colors: {
      free: '#22c55e',      // Verde - flujo libre
      moderate: '#eab308',  // Amarillo - moderado
      heavy: '#f97316',     // Naranja - pesado
      severe: '#dc2626',    // Rojo - severo
    },
    // Opacidad de la capa de tráfico
    opacity: 0.85,
  },
  
  // Límites del plan gratuito (para monitoreo)
  limits: {
    mapLoadsWeb: 50000,        // 50K cargas de mapa web/mes
    staticTiles: 200000,       // 200K tiles estáticos/mes
    staticImages: 50000,       // 50K imágenes estáticas/mes
    mobileMAU: 25000,          // 25K usuarios activos móviles/mes
  },
  
  // URLs de APIs
  api: {
    directions: 'https://api.mapbox.com/directions/v5/mapbox',
    geocoding: 'https://api.mapbox.com/geocoding/v5/mapbox.places',
    staticImages: 'https://api.mapbox.com/styles/v1',
    staticTiles: 'https://api.mapbox.com/v4',
  },
} as const;

/**
 * Validar que Mapbox esté correctamente configurado
 */
export function validateMapboxConfig(): { valid: boolean; message: string } {
  if (!MAPBOX_CONFIG.accessToken) {
    return {
      valid: false,
      message: 'Token de Mapbox no configurado. Configura NEXT_PUBLIC_MAPBOX_ACCESS_TOKEN en .env.local'
    };
  }
  
  if (MAPBOX_CONFIG.accessToken === 'your-mapbox-public-token-here') {
    return {
      valid: false,
      message: 'Token de Mapbox es el valor por defecto. Configura un token válido en .env.local'
    };
  }
  
  return {
    valid: true,
    message: 'Mapbox configurado correctamente'
  };
}

/**
 * Coordenadas de ciudades importantes de Ecuador
 */
export const ECUADOR_CITIES = [
  { name: "Manta, Manabí", coords: [-80.72, -0.95] as [number, number], zoom: 14 },
  { name: "Quito, Pichincha", coords: [-78.51, -0.22] as [number, number], zoom: 12 },
  { name: "Guayaquil, Guayas", coords: [-79.88, -2.19] as [number, number], zoom: 12 },
  { name: "Cuenca, Azuay", coords: [-79.00, -2.90] as [number, number], zoom: 13 },
  { name: "Portoviejo, Manabí", coords: [-80.45, -1.05] as [number, number], zoom: 13 },
  { name: "Ambato, Tungurahua", coords: [-78.62, -1.24] as [number, number], zoom: 13 },
  { name: "Santo Domingo", coords: [-79.17, -0.25] as [number, number], zoom: 13 },
  { name: "Machala, El Oro", coords: [-79.96, -3.26] as [number, number], zoom: 13 },
] as const;

export default MAPBOX_CONFIG;
