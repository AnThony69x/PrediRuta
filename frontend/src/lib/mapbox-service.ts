/**
 * Servicio de Mapbox para frontend
 * 
 * Proporciona funcionalidades para interactuar con las APIs de Mapbox desde el frontend:
 * - Geocodificación
 * - Búsqueda de lugares
 * - Cálculo de rutas
 * - Imágenes estáticas
 */

import { MAPBOX_CONFIG } from '@/config/mapbox';

export interface Coordinates {
  longitude: number;
  latitude: number;
}

export interface GeocodeResult {
  name: string;
  place_name: string;
  coordinates: Coordinates;
  bbox?: number[];
  place_type: string[];
  relevance: number;
  address?: string;
  context?: any[];
}

export interface DirectionsRoute {
  distance: number; // metros
  duration: number; // segundos
  geometry: {
    type: string;
    coordinates: number[][];
  };
  legs: Array<{
    distance: number;
    duration: number;
    steps: any[];
    annotation?: {
      duration?: number[];
      distance?: number[];
      speed?: number[];
      congestion?: string[];
    };
  }>;
}

/**
 * Geocodificación directa: convertir dirección en coordenadas
 * Retorna la respuesta completa de Mapbox para mantener compatibilidad
 */
export async function geocodeForward(
  query: string,
  options?: {
    country?: string;
    types?: string[];
    limit?: number;
    language?: string;
  }
): Promise<{ features: Array<{ center: [number, number]; place_name: string; text: string; }> }> {
  const params = new URLSearchParams({
    access_token: MAPBOX_CONFIG.accessToken,
    limit: String(options?.limit || 5),
    language: options?.language || 'es',
  });

  if (options?.country) {
    params.append('country', options.country);
  }

  if (options?.types && options.types.length > 0) {
    params.append('types', options.types.join(','));
  }

  const url = `${MAPBOX_CONFIG.api.geocoding}/${encodeURIComponent(query)}.json?${params}`;

  try {
    const response = await fetch(url);
    if (!response.ok) {
      throw new Error(`Geocoding error: ${response.statusText}`);
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Error en geocodificación:', error);
    throw error;
  }
}

/**
 * Geocodificación inversa: convertir coordenadas en dirección
 */
export async function geocodeReverse(
  longitude: number,
  latitude: number,
  options?: {
    types?: string[];
    language?: string;
  }
): Promise<GeocodeResult | null> {
  const params = new URLSearchParams({
    access_token: MAPBOX_CONFIG.accessToken,
    language: options?.language || 'es',
  });

  if (options?.types && options.types.length > 0) {
    params.append('types', options.types.join(','));
  }

  const url = `${MAPBOX_CONFIG.api.geocoding}/${longitude},${latitude}.json?${params}`;

  try {
    const response = await fetch(url);
    if (!response.ok) {
      throw new Error(`Reverse geocoding error: ${response.statusText}`);
    }

    const data = await response.json();

    if (!data.features || data.features.length === 0) {
      return null;
    }

    const feature = data.features[0];

    return {
      name: feature.text,
      place_name: feature.place_name,
      coordinates: {
        longitude: feature.center[0],
        latitude: feature.center[1],
      },
      place_type: feature.place_type,
      relevance: feature.relevance,
      address: feature.address,
      context: feature.context,
    };
  } catch (error) {
    console.error('Error en geocodificación inversa:', error);
    throw error;
  }
}

/**
 * Obtener direcciones entre dos puntos
 */
export async function getDirections(
  origin: [number, number],
  destination: [number, number],
  options?: {
    profile?: 'driving-traffic' | 'driving' | 'walking' | 'cycling';
    alternatives?: boolean;
    steps?: boolean;
    geometries?: 'geojson' | 'polyline' | 'polyline6';
    overview?: 'full' | 'simplified' | 'false';
    annotations?: string[];
    exclude?: 'toll' | 'motorway' | 'ferry';
  }
): Promise<{ routes: DirectionsRoute[]; waypoints: any[] }> {
  const profile = options?.profile || 'driving-traffic';
  const coordsString = `${origin[0]},${origin[1]};${destination[0]},${destination[1]}`;

  const params = new URLSearchParams({
    access_token: MAPBOX_CONFIG.accessToken,
    alternatives: String(options?.alternatives !== false),
    steps: String(options?.steps !== false),
    geometries: options?.geometries || 'geojson',
    overview: options?.overview || 'full',
  });

  if (options?.annotations && options?.annotations.length > 0) {
    params.append('annotations', options.annotations.join(','));
  } else {
    params.append('annotations', 'duration,distance,speed,congestion');
  }

  if (options?.exclude) {
    params.append('exclude', options.exclude);
  }

  const url = `${MAPBOX_CONFIG.api.directions}/${profile}/${coordsString}?${params}`;

  try {
    const response = await fetch(url);
    if (!response.ok) {
      throw new Error(`Directions error: ${response.statusText}`);
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Error obteniendo direcciones:', error);
    throw error;
  }
}

/**
 * Generar URL de imagen estática
 */
export function getStaticImageUrl(
  longitude: number,
  latitude: number,
  options?: {
    zoom?: number;
    width?: number;
    height?: number;
    style?: string;
    markers?: Array<{
      longitude: number;
      latitude: number;
      color?: string;
      label?: string;
    }>;
    bearing?: number;
    pitch?: number;
    retina?: boolean;
  }
): string {
  const zoom = options?.zoom || 13;
  const width = options?.width || 600;
  const height = options?.height || 400;
  const style = options?.style || 'streets-v12';
  const bearing = options?.bearing || 0;
  const pitch = options?.pitch || 0;
  const retina = options?.retina ? '@2x' : '';

  let overlays = '';

  // Agregar marcadores
  if (options?.markers && options.markers.length > 0) {
    const markerStrings = options.markers.map(marker => {
      let str = 'pin-s';
      
      if (marker.label) {
        str += `-${marker.label}`;
      }
      
      if (marker.color) {
        const color = marker.color.replace('#', '');
        str += `+${color}`;
      }
      
      str += `(${marker.longitude},${marker.latitude})`;
      return str;
    });

    overlays = markerStrings.join(',');
  }

  const size = `${width}x${height}${retina}`;
  const baseUrl = `${MAPBOX_CONFIG.api.staticImages}/mapbox/${style}/static`;

  let url: string;
  if (overlays) {
    url = `${baseUrl}/${overlays}/${longitude},${latitude},${zoom},${bearing},${pitch}/${size}`;
  } else {
    url = `${baseUrl}/${longitude},${latitude},${zoom},${bearing},${pitch}/${size}`;
  }

  return `${url}?access_token=${MAPBOX_CONFIG.accessToken}`;
}
