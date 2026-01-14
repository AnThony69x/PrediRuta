"use client";
import { ProtectedRoute } from "@/components/ProtectedRoute";
import { useAuth } from "@/hooks/useAuth";
import { useTranslation } from "@/hooks/useTranslation";
import { TrafficMap } from "@/components/map/mapbox-traffic-map";
import { useEffect, useState } from "react";
import { LegendTraffic } from "@/components/legend-traffic";
import { TrafficNearby } from "@/components/traffic-nearby";
import { getBackendUrl } from "@/lib/backend-url";
import { AppLayout } from "@/components/layout/AppLayout";
import { ECUADOR_CITIES } from "@/config/mapbox";

export default function DashboardPage() {
  const { user, loading } = useAuth();
  const { t } = useTranslation();
  const [viewport, setViewport] = useState<{ 
    center: [number, number]; 
    zoom: number; 
    bbox: { west: number; south: number; east: number; north: number } 
  } | null>(null);
  const backendUrl = getBackendUrl();
  const [userLoc, setUserLoc] = useState<[number, number] | undefined>(undefined);
  const [focusCenter, setFocusCenter] = useState<[number, number] | undefined>(ECUADOR_CITIES[0]?.coords);
  const [selectedCity, setSelectedCity] = useState<typeof ECUADOR_CITIES[number]>(ECUADOR_CITIES[0]);

  useEffect(() => {
    // Obtener ubicación del usuario automáticamente
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const { latitude, longitude } = position.coords;
          setUserLoc([longitude, latitude]); // Mapbox usa [lon, lat]
          // Enfocar en la ubicación del usuario con zoom cercano
          setFocusCenter([longitude, latitude]);
        },
        (error) => {
          console.log('No se pudo obtener ubicación del usuario:', error);
          // Usar Manta como fallback
          setFocusCenter(ECUADOR_CITIES[0]?.coords);
        },
        { enableHighAccuracy: true, timeout: 10000, maximumAge: 0 }
      );
    }
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  return (
    <ProtectedRoute>
      <AppLayout>
        <div className="p-4 md:p-6 space-y-6 min-h-screen pt-6">
          {/* Selector de ciudades - Arriba */}
          <div className="max-w-7xl mx-auto">
            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg border border-gray-200 dark:border-gray-700 p-4">
              <label className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-3 block flex items-center gap-2">
                <span className="text-xl">🇪🇨</span>
                <span>{t('dashboard.citySelector.label')}</span>
              </label>
              <select
                value={selectedCity?.name || ""}
                onChange={(e) => {
                  const city = ECUADOR_CITIES.find(c => c.name === e.target.value);
                  if (city) {
                    setSelectedCity(city);
                    setFocusCenter(city.coords);
                  }
                }}
                className="w-full text-sm rounded-lg border border-gray-300 bg-white px-4 py-2.5 text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500 dark:border-gray-600 dark:bg-gray-700 dark:text-gray-200"
              >
                {ECUADOR_CITIES.map((city) => (
                  <option key={city.name} value={city.name}>
                    {city.name}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Mapa - Sección principal con sticky */}
          <div className="max-w-7xl mx-auto">
            <div className="sticky top-0 bg-white dark:bg-gray-800 rounded-xl shadow-lg border border-gray-200 dark:border-gray-700 overflow-hidden z-30">
              <div className="relative h-[calc(100vh-8rem)] w-full">
                <TrafficMap
                  center={focusCenter}
                  zoom={selectedCity?.zoom || 13}
                  className="h-full w-full"
                  onMapLoad={(map) => {
                    console.log('Mapa cargado:', map);
                  }}
                  onViewportChange={(vp) => {
                    setViewport(vp);
                  }}
                  userLocation={userLoc}
                  showTraffic={true}
                />
                
                {/* Leyenda dentro del mapa */}
                <div className="absolute top-4 right-4 z-[1000]">
                  <LegendTraffic />
                </div>
              </div>
            </div>
          </div>

          {/* Panel de tráfico cercano - Abajo */}
          <div className="max-w-7xl mx-auto">
            <TrafficNearby
              backendUrl={backendUrl}
              onUpdate={({ level, flow, lat, lon }) => {
                // Mapbox usa [lon, lat], no [lat, lon]
                setUserLoc([lon, lat]);
                setFocusCenter([lon, lat]);
              }}
            />
          </div>
        </div>
      </AppLayout>
    </ProtectedRoute>
  );
}