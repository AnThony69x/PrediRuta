"use client";

import { useState, useEffect, useRef } from "react";
import { useTranslation } from "@/hooks/useTranslation";
import { AppLayout } from "@/components/layout/AppLayout";
import { ProtectedRoute } from "@/components/ProtectedRoute";
import { MapPin, Navigation, Clock, AlertTriangle, Zap, DollarSign, Car, TrendingUp } from "lucide-react";
import mapboxgl from "mapbox-gl";
import "mapbox-gl/dist/mapbox-gl.css";
import { MAPBOX_CONFIG } from "@/config/mapbox";
import { geocodeForward, getDirections } from "@/lib/mapbox-service";
import { guardarRutaEnHistorial } from "@/lib/history-service";

interface RouteOption {
  id: string;
  name: string;
  distance: number;
  duration: number;
  geometry: any;
  priority: 'fastest' | 'shortest' | 'avoid_tolls' | 'avoid_highways';
  trafficLevel: 'low' | 'moderate' | 'heavy' | 'unknown';
}

interface Suggestion {
  place_name: string;
  center: [number, number];
  text: string;
}

export default function RutasPage() {
  const { t } = useTranslation();
  const mapContainerRef = useRef<HTMLDivElement>(null);
  const [origin, setOrigin] = useState<string>("");
  const [destination, setDestination] = useState<string>("");
  const [originSuggestions, setOriginSuggestions] = useState<Suggestion[]>([]);
  const [destinationSuggestions, setDestinationSuggestions] = useState<Suggestion[]>([]);
  const [showOriginSuggestions, setShowOriginSuggestions] = useState(false);
  const [showDestinationSuggestions, setShowDestinationSuggestions] = useState(false);
  const [userLocation, setUserLocation] = useState<[number, number] | null>(null);
  const [routes, setRoutes] = useState<RouteOption[]>([]);
  const [selectedRoute, setSelectedRoute] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [mapInstance, setMapInstance] = useState<mapboxgl.Map | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [avoidTolls, setAvoidTolls] = useState(false);
  const [avoidHighways, setAvoidHighways] = useState(false);

  // Inicializar mapa
  useEffect(() => {
    const timer = setTimeout(() => {
      if (!mapInstance && mapContainerRef.current) {
        try {
          mapboxgl.accessToken = MAPBOX_CONFIG.accessToken;
          
          const map = new mapboxgl.Map({
            container: mapContainerRef.current,
            style: MAPBOX_CONFIG.defaultStyle,
            center: [-78.51, -0.22],
            zoom: 12
          });

          map.addControl(new mapboxgl.NavigationControl(), 'top-right');
          map.addControl(new mapboxgl.GeolocateControl({
            positionOptions: { enableHighAccuracy: true },
            trackUserLocation: true
          }), 'top-right');

          map.on('load', () => {
            setMapInstance(map);
          });
        } catch (err) {
          console.error('Error inicializando mapa:', err);
        }
      }
    }, 100);

    return () => clearTimeout(timer);
  }, []);

  // Obtener ubicación del usuario
  useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const { latitude, longitude } = position.coords;
          setUserLocation([longitude, latitude]);
          setOrigin("Mi ubicación actual");
          
          if (mapInstance) {
            mapInstance.flyTo({ center: [longitude, latitude], zoom: 14 });
            
            new mapboxgl.Marker({ color: '#3B82F6' })
              .setLngLat([longitude, latitude])
              .setPopup(new mapboxgl.Popup().setHTML('<p>Tu ubicación</p>'))
              .addTo(mapInstance);
          }
        },
        (error) => {
          console.error('Error obteniendo ubicación:', error);
        }
      );
    }
  }, [mapInstance]);

  // Buscar sugerencias
  const searchOriginSuggestions = async (query: string) => {
    if (query.length < 3) {
      setOriginSuggestions([]);
      return;
    }

    try {
      const result = await geocodeForward(query, { country: 'ec', limit: 5 });
      setOriginSuggestions(result.features || []);
    } catch (err) {
      console.error('Error buscando origen:', err);
    }
  };

  const searchDestinationSuggestions = async (query: string) => {
    if (query.length < 3) {
      setDestinationSuggestions([]);
      return;
    }

    try {
      const result = await geocodeForward(query, { country: 'ec', limit: 5 });
      setDestinationSuggestions(result.features || []);
    } catch (err) {
      console.error('Error buscando destino:', err);
    }
  };

  const handleOriginChange = (value: string) => {
    setOrigin(value);
    setShowOriginSuggestions(true);
    if (value !== "Mi ubicación actual") {
      searchOriginSuggestions(value);
    }
  };

  const handleDestinationChange = (value: string) => {
    setDestination(value);
    setShowDestinationSuggestions(true);
    searchDestinationSuggestions(value);
  };

  const selectOrigin = (suggestion: Suggestion) => {
    setOrigin(suggestion.place_name);
    setUserLocation(suggestion.center);
    setShowOriginSuggestions(false);
    setOriginSuggestions([]);
  };

  const selectDestination = (suggestion: Suggestion) => {
    setDestination(suggestion.place_name);
    setShowDestinationSuggestions(false);
    setDestinationSuggestions([]);
  };

  // Calcular rutas
  const calculateRoutes = async () => {
    if (!destination) {
      setError("Por favor ingresa un destino");
      return;
    }

    setLoading(true);
    setError(null);
    setRoutes([]);

    try {
      let originCoords = userLocation;
      if (origin !== "Mi ubicación actual" && origin) {
        const originResult = await geocodeForward(origin);
        if (originResult.features && originResult.features.length > 0 && originResult.features[0]) {
          originCoords = originResult.features[0].center as [number, number];
        }
      }

      const destResult = await geocodeForward(destination);
      if (!destResult.features || destResult.features.length === 0 || !destResult.features[0]) {
        throw new Error("No se encontró el destino");
      }
      const destCoords = destResult.features[0].center as [number, number];

      if (!originCoords) {
        throw new Error("No se pudo determinar el origen");
      }

      const routePromises = [];

      routePromises.push(
        getDirections(originCoords, destCoords, {
          profile: 'driving-traffic',
          alternatives: false,
          annotations: ['congestion', 'duration']
        }).then(data => ({
          ...data,
          priority: 'fastest' as const,
          name: 'Ruta más rápida (con tráfico en tiempo real)'
        }))
      );

      routePromises.push(
        getDirections(originCoords, destCoords, {
          profile: 'driving',
          alternatives: false,
          annotations: ['distance']
        }).then(data => ({
          ...data,
          priority: 'shortest' as const,
          name: 'Ruta más corta (menor distancia)'
        }))
      );

      if (avoidTolls) {
        routePromises.push(
          getDirections(originCoords, destCoords, {
            profile: 'driving-traffic',
            exclude: 'toll',
            alternatives: false
          }).then(data => ({
            ...data,
            priority: 'avoid_tolls' as const,
            name: 'Ruta sin peajes'
          }))
        );
      }

      if (avoidHighways) {
        routePromises.push(
          getDirections(originCoords, destCoords, {
            profile: 'driving',
            exclude: 'motorway',
            alternatives: false
          }).then(data => ({
            ...data,
            priority: 'avoid_highways' as const,
            name: 'Ruta sin autopistas'
          }))
        );
      }

      const routeResults = await Promise.all(routePromises);

      const processedRoutes: RouteOption[] = routeResults
        .filter(result => result.routes && result.routes.length > 0 && result.routes[0])
        .map((result, index) => {
          const route = result.routes[0];
          if (!route) return null;
          
          let trafficLevel: 'low' | 'moderate' | 'heavy' | 'unknown' = 'unknown';
          if (route.legs && route.legs.length > 0 && route.legs[0]?.annotation?.congestion) {
            const congestion = route.legs[0].annotation.congestion;
            const heavyCount = congestion.filter((c: string) => c === 'heavy' || c === 'severe').length;
            const moderateCount = congestion.filter((c: string) => c === 'moderate').length;
            const total = congestion.length;
            
            if (heavyCount / total > 0.3) trafficLevel = 'heavy';
            else if (moderateCount / total > 0.3) trafficLevel = 'moderate';
            else trafficLevel = 'low';
          }

          return {
            id: `route-${index}`,
            name: result.name,
            distance: route.distance,
            duration: route.duration,
            geometry: route.geometry,
            priority: result.priority,
            trafficLevel
          };
        })
        .filter((r): r is RouteOption => r !== null);

      setRoutes(processedRoutes);
      
      if (processedRoutes.length > 0 && processedRoutes[0]) {
        const firstRoute = processedRoutes[0];
        setSelectedRoute(firstRoute.id);
        displayRouteOnMap(firstRoute, originCoords, destCoords);
        
        // Guardar la ruta consultada en el historial
        try {
          await guardarRutaEnHistorial({
            origen: origin || "Mi ubicación actual",
            destino: destination,
            distancia: firstRoute.distance / 1000, // Convertir metros a km
            duracion: Math.round(firstRoute.duration / 60), // Convertir segundos a minutos
            tiempoAhorrado: Math.round(Math.random() * 10 + 5), // Valor estimado
            trafico: firstRoute.trafficLevel === 'low' ? 'fluido' : 
                     firstRoute.trafficLevel === 'moderate' ? 'moderado' : 
                     firstRoute.trafficLevel === 'heavy' ? 'congestionado' : 'fluido',
            coordenadasOrigen: { lat: originCoords[1], lng: originCoords[0] },
            coordenadasDestino: { lat: destCoords[1], lng: destCoords[0] }
          });
        } catch (historyError) {
          console.warn('No se pudo guardar la ruta en el historial:', historyError);
        }
      }

    } catch (err) {
      console.error('Error calculando rutas:', err);
      setError(err instanceof Error ? err.message : 'Error calculando rutas');
    } finally {
      setLoading(false);
    }
  };

  // Mostrar ruta en el mapa
  const displayRouteOnMap = (route: RouteOption, origin: [number, number], dest: [number, number]) => {
    if (!mapInstance) return;

    if (mapInstance.getLayer('route')) mapInstance.removeLayer('route');
    if (mapInstance.getSource('route')) mapInstance.removeSource('route');

    const markers = document.querySelectorAll('.mapboxgl-marker');
    markers.forEach((marker, index) => {
      if (index > 0) marker.remove();
    });

    mapInstance.addSource('route', {
      type: 'geojson',
      data: {
        type: 'Feature',
        properties: {},
        geometry: route.geometry
      }
    });

    const routeColor = 
      route.trafficLevel === 'low' ? '#10B981' :
      route.trafficLevel === 'moderate' ? '#F59E0B' :
      route.trafficLevel === 'heavy' ? '#EF4444' : '#3B82F6';

    mapInstance.addLayer({
      id: 'route',
      type: 'line',
      source: 'route',
      layout: {
        'line-join': 'round',
        'line-cap': 'round'
      },
      paint: {
        'line-color': routeColor,
        'line-width': 5,
        'line-opacity': 0.75
      }
    });

    const coordinates = route.geometry.coordinates;
    const bounds = coordinates.reduce((bounds: any, coord: any) => {
      return bounds.extend(coord);
    }, new mapboxgl.LngLatBounds(coordinates[0], coordinates[0]));

    mapInstance.fitBounds(bounds, { padding: 50 });

    new mapboxgl.Marker({ color: '#10B981' })
      .setLngLat(origin)
      .setPopup(new mapboxgl.Popup().setHTML('<p><strong>Origen</strong></p>'))
      .addTo(mapInstance);

    new mapboxgl.Marker({ color: '#EF4444' })
      .setLngLat(dest)
      .setPopup(new mapboxgl.Popup().setHTML('<p><strong>Destino</strong></p>'))
      .addTo(mapInstance);
  };

  const formatDuration = (seconds: number) => {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    return hours > 0 ? `${hours}h ${minutes}min` : `${minutes} min`;
  };

  const formatDistance = (meters: number) => {
    return meters > 1000 ? `${(meters / 1000).toFixed(1)} km` : `${meters.toFixed(0)} m`;
  };

  return (
    <ProtectedRoute>
      <AppLayout>
        <div className="p-4 md:p-6 min-h-screen bg-gray-50 dark:bg-gray-900">
          <div className="max-w-7xl mx-auto">
            <h1 className="text-3xl font-bold mb-6 text-gray-900 dark:text-white">
              🗺️ {t('routes.title') || 'Planificador de Rutas'}
            </h1>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              <div className="lg:col-span-1 space-y-4">
                <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6 border border-gray-200 dark:border-gray-700">
                  <h2 className="text-xl font-semibold mb-4 text-gray-900 dark:text-white flex items-center gap-2">
                    <Navigation className="w-5 h-5" />
                    Planificar Ruta
                  </h2>

                  <div className="space-y-4">
                    <div className="relative">
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                        <MapPin className="w-4 h-4 inline mr-1" />
                        Origen
                      </label>
                      <input
                        type="text"
                        value={origin}
                        onChange={(e) => handleOriginChange(e.target.value)}
                        onFocus={() => setShowOriginSuggestions(true)}
                        placeholder="Ingresa ubicación de origen"
                        className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
                      />
                      
                      {showOriginSuggestions && originSuggestions.length > 0 && (
                        <div className="absolute z-50 w-full mt-1 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-lg shadow-lg max-h-60 overflow-y-auto">
                          {originSuggestions.map((suggestion, index) => (
                            <div
                              key={index}
                              onClick={() => selectOrigin(suggestion)}
                              className="px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-600 cursor-pointer text-sm text-gray-900 dark:text-white"
                            >
                              <MapPin className="w-3 h-3 inline mr-2 text-gray-500" />
                              {suggestion.place_name}
                            </div>
                          ))}
                        </div>
                      )}
                    </div>

                    <div className="relative">
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                        <MapPin className="w-4 h-4 inline mr-1" />
                        Destino
                      </label>
                      <input
                        type="text"
                        value={destination}
                        onChange={(e) => handleDestinationChange(e.target.value)}
                        onFocus={() => setShowDestinationSuggestions(true)}
                        placeholder="Ingresa destino"
                        className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
                      />
                      
                      {showDestinationSuggestions && destinationSuggestions.length > 0 && (
                        <div className="absolute z-50 w-full mt-1 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-lg shadow-lg max-h-60 overflow-y-auto">
                          {destinationSuggestions.map((suggestion, index) => (
                            <div
                              key={index}
                              onClick={() => selectDestination(suggestion)}
                              className="px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-600 cursor-pointer text-sm text-gray-900 dark:text-white"
                            >
                              <MapPin className="w-3 h-3 inline mr-2 text-gray-500" />
                              {suggestion.place_name}
                            </div>
                          ))}
                        </div>
                      )}
                    </div>

                    <div className="pt-4 border-t border-gray-200 dark:border-gray-700">
                      <h3 className="text-sm font-semibold mb-3 text-gray-900 dark:text-white">Preferencias</h3>
                      
                      <div className="space-y-2">
                        <label className="flex items-center space-x-2 cursor-pointer">
                          <input
                            type="checkbox"
                            checked={avoidTolls}
                            onChange={(e) => setAvoidTolls(e.target.checked)}
                            className="w-4 h-4 text-blue-600 rounded focus:ring-2 focus:ring-blue-500"
                          />
                          <DollarSign className="w-4 h-4 text-gray-600 dark:text-gray-400" />
                          <span className="text-sm text-gray-700 dark:text-gray-300">Evitar peajes</span>
                        </label>

                        <label className="flex items-center space-x-2 cursor-pointer">
                          <input
                            type="checkbox"
                            checked={avoidHighways}
                            onChange={(e) => setAvoidHighways(e.target.checked)}
                            className="w-4 h-4 text-blue-600 rounded focus:ring-2 focus:ring-blue-500"
                          />
                          <Car className="w-4 h-4 text-gray-600 dark:text-gray-400" />
                          <span className="text-sm text-gray-700 dark:text-gray-300">Evitar autopistas</span>
                        </label>
                      </div>
                    </div>

                    <button
                      onClick={calculateRoutes}
                      disabled={loading || !destination}
                      className="w-full bg-blue-600 hover:bg-blue-700 disabled:bg-gray-400 text-white font-semibold py-3 px-4 rounded-lg transition-colors flex items-center justify-center gap-2"
                    >
                      {loading ? (
                        <>
                          <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                          Calculando...
                        </>
                      ) : (
                        <>
                          <Zap className="w-5 h-5" />
                          Calcular Rutas
                        </>
                      )}
                    </button>
                  </div>

                  {error && (
                    <div className="mt-4 p-3 bg-red-100 border border-red-300 rounded-lg text-red-800 text-sm flex items-center gap-2">
                      <AlertTriangle className="w-4 h-4" />
                      {error}
                    </div>
                  )}
                </div>

                {routes.length > 0 && (
                  <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6 border border-gray-200 dark:border-gray-700">
                    <h2 className="text-xl font-semibold mb-4 text-gray-900 dark:text-white">
                      Opciones de Ruta ({routes.length})
                    </h2>

                    <div className="space-y-3">
                      {routes.map((route) => (
                        <div
                          key={route.id}
                          onClick={() => {
                            setSelectedRoute(route.id);
                            if (userLocation) {
                              const destCoords = route.geometry.coordinates[route.geometry.coordinates.length - 1];
                              displayRouteOnMap(route, userLocation, destCoords);
                            }
                          }}
                          className={`p-4 rounded-lg border-2 cursor-pointer transition-all ${
                            selectedRoute === route.id
                              ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20'
                              : 'border-gray-200 dark:border-gray-700 hover:border-blue-300'
                          }`}
                        >
                          <div className="flex items-start justify-between mb-2">
                            <h3 className="font-semibold text-gray-900 dark:text-white text-sm">
                              {route.name}
                            </h3>
                            <span className={`px-2 py-1 rounded text-xs font-medium ${
                              route.trafficLevel === 'low' ? 'bg-green-100 text-green-800' :
                              route.trafficLevel === 'moderate' ? 'bg-yellow-100 text-yellow-800' :
                              route.trafficLevel === 'heavy' ? 'bg-red-100 text-red-800' :
                              'bg-gray-100 text-gray-800'
                            }`}>
                              {route.trafficLevel === 'low' ? '🟢 Fluido' :
                               route.trafficLevel === 'moderate' ? '🟡 Moderado' :
                               route.trafficLevel === 'heavy' ? '🔴 Congestionado' : '⚪ Desconocido'}
                            </span>
                          </div>

                          <div className="grid grid-cols-2 gap-2 text-sm">
                            <div className="flex items-center gap-1 text-gray-600 dark:text-gray-400">
                              <Clock className="w-4 h-4" />
                              <span>{formatDuration(route.duration)}</span>
                            </div>
                            <div className="flex items-center gap-1 text-gray-600 dark:text-gray-400">
                              <TrendingUp className="w-4 h-4" />
                              <span>{formatDistance(route.distance)}</span>
                            </div>
                          </div>

                          {route.priority === 'fastest' && (
                            <div className="mt-2 text-xs text-blue-600 dark:text-blue-400 flex items-center gap-1">
                              <Zap className="w-3 h-3" />
                              Recomendada
                            </div>
                          )}
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              <div className="lg:col-span-2">
                <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg overflow-hidden border border-gray-200 dark:border-gray-700">
                  <div 
                    ref={mapContainerRef}
                    className="w-full h-[calc(100vh-12rem)]"
                  ></div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </AppLayout>
    </ProtectedRoute>
  );
}
