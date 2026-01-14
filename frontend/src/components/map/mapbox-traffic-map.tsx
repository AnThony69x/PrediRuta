"use client";

import { useEffect, useRef, useState, useCallback } from 'react';
import mapboxgl from 'mapbox-gl';
import 'mapbox-gl/dist/mapbox-gl.css';
import { MAPBOX_CONFIG, validateMapboxConfig } from '@/config/mapbox';

export interface TrafficMapProps {
  center?: [number, number]; // [longitude, latitude]
  zoom?: number;
  className?: string;
  onMapLoad?: (map: mapboxgl.Map) => void;
  onViewportChange?: (viewport: {
    center: [number, number];
    zoom: number;
    bbox: {
      west: number;
      south: number;
      east: number;
      north: number;
    };
  }) => void;
  userLocation?: [number, number];
  showTraffic?: boolean;
  style?: string;
  markers?: Array<{
    longitude: number;
    latitude: number;
    color?: string;
    label?: string;
  }>;
  route?: {
    coordinates: number[][];
    color?: string;
  };
}

/**
 * Componente de mapa interactivo con Mapbox GL JS
 * 
 * Características:
 * - Mapa interactivo con zoom y pan
 * - Capa de tráfico en tiempo real
 * - Marcadores personalizables
 * - Visualización de rutas
 * - Estilos configurables
 */
export function TrafficMap({
  center = MAPBOX_CONFIG.map.defaultCenter,
  zoom = MAPBOX_CONFIG.map.defaultZoom,
  className = '',
  onMapLoad,
  onViewportChange,
  userLocation,
  showTraffic = true,
  style = MAPBOX_CONFIG.defaultStyle,
  markers = [],
  route,
}: TrafficMapProps) {
  const mapContainer = useRef<HTMLDivElement>(null);
  const map = useRef<mapboxgl.Map | null>(null);
  const [mapLoaded, setMapLoaded] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const markersRef = useRef<mapboxgl.Marker[]>([]);
  const userMarkerRef = useRef<mapboxgl.Marker | null>(null);

  // Validar configuración
  useEffect(() => {
    const { valid, message } = validateMapboxConfig();
    if (!valid) {
      setError(message);
    }
  }, []);

  // Inicializar mapa
  useEffect(() => {
    if (!mapContainer.current || map.current || error) return;

    mapboxgl.accessToken = MAPBOX_CONFIG.accessToken;

    try {
      map.current = new mapboxgl.Map({
        container: mapContainer.current,
        style,
        center,
        zoom,
        minZoom: MAPBOX_CONFIG.map.minZoom,
        maxZoom: MAPBOX_CONFIG.map.maxZoom,
        pitch: MAPBOX_CONFIG.map.pitch,
        bearing: MAPBOX_CONFIG.map.bearing,
      });

      // Agregar controles
      map.current.addControl(new mapboxgl.NavigationControl(), 'top-left');
      map.current.addControl(new mapboxgl.ScaleControl(), 'bottom-left');
      map.current.addControl(new mapboxgl.FullscreenControl(), 'top-left');

      // Evento de carga
      map.current.on('load', () => {
        setMapLoaded(true);
        
        // Agregar capa de tráfico si está habilitada
        if (showTraffic && map.current) {
          map.current.addLayer({
            id: 'traffic',
            type: 'line',
            source: {
              type: 'vector',
              url: 'mapbox://mapbox.mapbox-traffic-v1',
            },
            'source-layer': 'traffic',
            paint: {
              'line-width': 3,
              'line-color': [
                'case',
                ['==', ['get', 'congestion'], 'low'], MAPBOX_CONFIG.traffic.colors.free,
                ['==', ['get', 'congestion'], 'moderate'], MAPBOX_CONFIG.traffic.colors.moderate,
                ['==', ['get', 'congestion'], 'heavy'], MAPBOX_CONFIG.traffic.colors.heavy,
                ['==', ['get', 'congestion'], 'severe'], MAPBOX_CONFIG.traffic.colors.severe,
                '#888888'
              ],
              'line-opacity': MAPBOX_CONFIG.traffic.opacity,
            },
          });
        }

        if (onMapLoad && map.current) {
          onMapLoad(map.current);
        }
      });

      // Eventos de viewport
      const handleMove = () => {
        if (!map.current || !onViewportChange) return;

        const center = map.current.getCenter();
        const zoom = map.current.getZoom();
        const bounds = map.current.getBounds();

        if (bounds) {
          onViewportChange({
            center: [center.lng, center.lat],
            zoom,
            bbox: {
              west: bounds.getWest(),
              south: bounds.getSouth(),
              east: bounds.getEast(),
              north: bounds.getNorth(),
            },
          });
        }
      };

      map.current.on('moveend', handleMove);
      map.current.on('zoomend', handleMove);

    } catch (err) {
      console.error('Error inicializando mapa:', err);
      setError('Error al inicializar el mapa');
    }

    // Cleanup
    return () => {
      if (map.current) {
        map.current.remove();
        map.current = null;
      }
    };
  }, [error]); // Solo ejecutar una vez

  // Actualizar marcadores
  useEffect(() => {
    if (!map.current || !mapLoaded) return;

    // Remover marcadores existentes
    markersRef.current.forEach(marker => marker.remove());
    markersRef.current = [];

    // Agregar nuevos marcadores
    markers.forEach(markerData => {
      const el = document.createElement('div');
      el.className = 'custom-marker';
      el.style.width = '30px';
      el.style.height = '30px';
      el.style.backgroundSize = '100%';
      el.style.cursor = 'pointer';
      
      // Color del marcador
      const color = markerData.color || '#3b82f6';
      el.style.backgroundColor = color;
      el.style.borderRadius = '50%';
      el.style.border = '3px solid white';
      el.style.boxShadow = '0 2px 4px rgba(0,0,0,0.3)';

      // Label
      if (markerData.label) {
        el.style.display = 'flex';
        el.style.alignItems = 'center';
        el.style.justifyContent = 'center';
        el.style.color = 'white';
        el.style.fontWeight = 'bold';
        el.style.fontSize = '14px';
        el.textContent = markerData.label;
      }

      const marker = new mapboxgl.Marker(el)
        .setLngLat([markerData.longitude, markerData.latitude])
        .addTo(map.current!);

      markersRef.current.push(marker);
    });
  }, [markers, mapLoaded]);

  // Actualizar ubicación del usuario
  useEffect(() => {
    if (!map.current || !mapLoaded) return;

    if (userMarkerRef.current) {
      userMarkerRef.current.remove();
      userMarkerRef.current = null;
    }

    if (userLocation) {
      const el = document.createElement('div');
      el.className = 'user-location-marker';
      el.style.width = '20px';
      el.style.height = '20px';
      el.style.backgroundColor = '#3b82f6';
      el.style.border = '3px solid white';
      el.style.borderRadius = '50%';
      el.style.boxShadow = '0 0 10px rgba(59, 130, 246, 0.5)';

      userMarkerRef.current = new mapboxgl.Marker(el)
        .setLngLat([userLocation[0], userLocation[1]])
        .addTo(map.current);
    }
  }, [userLocation, mapLoaded]);

  // Dibujar ruta
  useEffect(() => {
    if (!map.current || !mapLoaded || !route) return;

    const sourceId = 'route';
    const layerId = 'route-layer';

    // Remover capa y fuente existente
    if (map.current.getLayer(layerId)) {
      map.current.removeLayer(layerId);
    }
    if (map.current.getSource(sourceId)) {
      map.current.removeSource(sourceId);
    }

    // Agregar nueva ruta
    map.current.addSource(sourceId, {
      type: 'geojson',
      data: {
        type: 'Feature',
        properties: {},
        geometry: {
          type: 'LineString',
          coordinates: route.coordinates,
        },
      },
    });

    map.current.addLayer({
      id: layerId,
      type: 'line',
      source: sourceId,
      layout: {
        'line-join': 'round',
        'line-cap': 'round',
      },
      paint: {
        'line-color': route.color || '#0074D9',
        'line-width': 5,
        'line-opacity': 0.8,
      },
    });

    // Ajustar vista a la ruta
    const bounds = route.coordinates.reduce(
      (bounds, coord) => bounds.extend(coord as [number, number]),
      new mapboxgl.LngLatBounds(route.coordinates[0] as [number, number], route.coordinates[0] as [number, number])
    );

    map.current.fitBounds(bounds, {
      padding: { top: 50, bottom: 50, left: 50, right: 50 },
      maxZoom: 15,
    });
  }, [route, mapLoaded]);

  // Botón de ubicación
  const handleLocationClick = useCallback(() => {
    if (!navigator.geolocation) {
      alert('La geolocalización no está disponible en tu navegador');
      return;
    }

    navigator.geolocation.getCurrentPosition(
      (position) => {
        const { longitude, latitude } = position.coords;
        if (map.current) {
          map.current.flyTo({
            center: [longitude, latitude],
            zoom: Math.max(map.current.getZoom(), 14),
            essential: true,
          });
        }
      },
      (error) => {
        console.error('Error obteniendo ubicación:', error);
        alert('No se pudo obtener tu ubicación');
      },
      { enableHighAccuracy: true, timeout: 10000 }
    );
  }, []);

  if (error) {
    return (
      <div className={`flex items-center justify-center bg-gray-100 dark:bg-gray-800 ${className}`}>
        <div className="text-center p-6">
          <p className="text-red-600 dark:text-red-400 font-semibold mb-2">
            Error de configuración
          </p>
          <p className="text-sm text-gray-600 dark:text-gray-400">{error}</p>
        </div>
      </div>
    );
  }

  return (
    <div className={`relative ${className}`}>
      <div ref={mapContainer} className="w-full h-full" />
      
      {/* Botón de ubicación */}
      <button
        onClick={handleLocationClick}
        className="absolute z-10 right-3 bottom-20 rounded-lg bg-white/95 backdrop-blur-sm px-4 py-2.5 text-sm font-semibold text-blue-600 shadow-lg hover:bg-white hover:shadow-xl focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-800/95 dark:text-blue-400 dark:hover:bg-gray-800 transition-all flex items-center gap-2 border border-blue-200 dark:border-blue-800"
      >
        <span className="text-lg">📍</span>
        Mi ubicación
      </button>
    </div>
  );
}

export default TrafficMap;
