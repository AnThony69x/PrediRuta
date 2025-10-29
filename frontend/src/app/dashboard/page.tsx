"use client";
import { ProtectedRoute } from "@/components/ProtectedRoute";
import { useAuth } from "@/hooks/useAuth";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { TrafficMap } from "@/components/map/traffic-map";
import { getUserFirstName } from "@/utils/userHelpers";
import Link from "next/link";
import { useEffect, useState } from "react";
import { TrafficStatus } from "@/components/traffic-status";
import { LegendTraffic } from "@/components/legend-traffic";
import { TrafficNearby } from "@/components/traffic-nearby";
import { getBackendUrl } from "@/lib/backend-url";
import { AppLayout } from "@/components/layout/AppLayout";

type TrafficSummary = {
  city?: string;
  updatedAt?: string;
  currentSpeed?: number;
  freeFlowSpeed?: number;
  congestionLevel?: "free" | "moderate" | "heavy" | "severe";
  hasCoverage?: boolean;
};

// Ciudades con cobertura de tráfico TomTom
const CITIES_WITH_COVERAGE = [
  { name: "Madrid, España", coords: [40.4168, -3.7038] as [number, number], zoom: 13 },
  { name: "Barcelona, España", coords: [41.3851, 2.1734] as [number, number], zoom: 13 },
  { name: "París, Francia", coords: [48.8566, 2.3522] as [number, number], zoom: 13 },
  { name: "Londres, UK", coords: [51.5074, -0.1278] as [number, number], zoom: 13 },
  { name: "Berlín, Alemania", coords: [52.5200, 13.4050] as [number, number], zoom: 13 },
  { name: "Nueva York, USA", coords: [40.7128, -74.0060] as [number, number], zoom: 13 },
  { name: "Los Ángeles, USA", coords: [34.0522, -118.2437] as [number, number], zoom: 13 },
  { name: "Tokio, Japón", coords: [35.6762, 139.6503] as [number, number], zoom: 13 },
];

// Función auxiliar para obtener saludo según hora del día
function getGreeting(name: string): string {
  const hour = new Date().getHours();
  if (hour < 12) return `Buenos días, ${name}`;
  if (hour < 19) return `Buenas tardes, ${name}`;
  return `Buenas noches, ${name}`;
}

export default function DashboardPage() {
  const { user, loading } = useAuth();
  const [summary, setSummary] = useState<TrafficSummary | null>(null);
  const [viewport, setViewport] = useState<{ center: [number, number]; zoom: number; bbox: { west: number; south: number; east: number; north: number } } | null>(null);
  const backendUrl = getBackendUrl();
  const [userLoc, setUserLoc] = useState<[number, number] | undefined>(undefined);
  const [focusCenter, setFocusCenter] = useState<[number, number] | undefined>(CITIES_WITH_COVERAGE[0]?.coords);
  const [segments, setSegments] = useState<Array<{ coords: [number, number][], level: "free" | "moderate" | "heavy" | "severe" }>>([]);
  const [selectedCity, setSelectedCity] = useState(CITIES_WITH_COVERAGE[0]);

  useEffect(() => {
    // Inicializar con datos vacíos
    setSummary({
      updatedAt: new Date().toISOString(),
      hasCoverage: false,
    });
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
        <div className="p-4 md:p-6 space-y-6 min-h-screen bg-gradient-to-b from-white via-sky-50 to-purple-50 dark:from-gray-900 dark:via-indigo-950 dark:to-purple-950">
          {/* Header de bienvenida personalizado */}
          <div className="max-w-7xl mx-auto">
            <h1 className="text-2xl md:text-3xl font-extrabold bg-gradient-to-r from-emerald-600 via-sky-600 to-purple-600 bg-clip-text text-transparent">
              Dashboard
            </h1>
            <p className="text-sm text-gray-600 dark:text-gray-300 mt-1">
              {getGreeting(getUserFirstName(user))}. Aquí tienes una vista general del sistema.
            </p>
          </div>

          <section className="grid grid-cols-1 lg:grid-cols-3 gap-4 max-w-7xl mx-auto">
            <Card className="col-span-1 border-emerald-100/80 dark:border-emerald-900/50">
              <CardHeader>
                <CardTitle className="text-emerald-700 dark:text-emerald-300">Resumen de tráfico</CardTitle>
              </CardHeader>
              <CardContent>
              <div className="space-y-3">
                {/* Selector de ciudad */}
                <div>
                  <label className="text-xs font-medium text-gray-600 dark:text-gray-400 mb-1 block">
                    Ciudad con cobertura:
                  </label>
                  <select
                    value={selectedCity?.name || ""}
                    onChange={(e) => {
                      const city = CITIES_WITH_COVERAGE.find(c => c.name === e.target.value);
                      if (city) {
                        setSelectedCity(city);
                        setFocusCenter(city.coords);
                      }
                    }}
                    className="w-full text-sm rounded-md border border-gray-300 bg-white px-2 py-1.5 text-gray-700 focus:outline-none focus:ring-2 focus:ring-emerald-500 dark:border-gray-600 dark:bg-gray-800 dark:text-gray-200"
                  >
                    {CITIES_WITH_COVERAGE.map((city) => (
                      <option key={city.name} value={city.name}>
                        {city.name}
                      </option>
                    ))}
                  </select>
                  <p className="text-[10px] text-gray-500 dark:text-gray-400 mt-1">
                    ⚠️ Ecuador no tiene cobertura. Selecciona una ciudad con datos de tráfico.
                  </p>
                </div>

                {/* Datos de tráfico */}
                {summary && summary.hasCoverage ? (
                  <ul className="text-sm text-gray-700 dark:text-gray-200 space-y-2 pt-2 border-t border-gray-200 dark:border-gray-700">
                    <li>
                      <span className="font-medium">Ciudad:</span>{" "}
                      <span className="text-emerald-600 dark:text-emerald-400">{summary.city || selectedCity?.name || "N/D"}</span>
                    </li>
                    {typeof summary.currentSpeed === "number" && (
                      <li>
                        <span className="font-medium">Velocidad actual:</span> {summary.currentSpeed.toFixed(0)} km/h
                      </li>
                    )}
                    {typeof summary.freeFlowSpeed === "number" && (
                      <li>
                        <span className="font-medium">Flujo libre:</span> {summary.freeFlowSpeed.toFixed(0)} km/h
                      </li>
                    )}
                    {summary.congestionLevel && (
                      <li>
                        <span className="font-medium">Congestión:</span>{" "}
                        <span className={`inline-flex items-center gap-1.5 px-2 py-0.5 rounded text-xs font-semibold ${
                          summary.congestionLevel === "free" ? "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400" :
                          summary.congestionLevel === "moderate" ? "bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400" :
                          summary.congestionLevel === "heavy" ? "bg-orange-100 text-orange-700 dark:bg-orange-900/30 dark:text-orange-400" :
                          "bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400"
                        }`}>
                          {summary.congestionLevel === "free" ? "🟢 Fluido" :
                           summary.congestionLevel === "moderate" ? "🟡 Moderado" :
                           summary.congestionLevel === "heavy" ? "🟠 Pesado" :
                           "🔴 Severo"}
                        </span>
                      </li>
                    )}
                    <li className="text-xs text-gray-500 dark:text-gray-400 pt-1">
                      ✅ Datos en tiempo real de TomTom
                    </li>
                  </ul>
                ) : (
                  <div className="text-sm text-gray-600 dark:text-gray-400 pt-2 border-t border-gray-200 dark:border-gray-700">
                    <p className="mb-2">📍 Selecciona una ciudad arriba para ver datos de tráfico vehicular en tiempo real.</p>
                    <p className="text-xs">El mapa se moverá automáticamente a la ubicación seleccionada.</p>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>

          <Card className="col-span-1 border-sky-100/80 dark:border-sky-900/50">
            <CardHeader>
              <CardTitle className="text-sky-700 dark:text-sky-300">Acceso rápido</CardTitle>
            </CardHeader>
            <CardContent className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <Link href="/rutas" className="group">
                <div className="rounded-md border border-emerald-200 bg-gradient-to-br from-emerald-50 to-white p-3 transition-all hover:shadow-md dark:border-emerald-900/60 dark:from-emerald-950 dark:to-gray-900">
                  <p className="font-semibold text-emerald-700 dark:text-emerald-300 group-hover:translate-x-0.5 transition-transform">Rutas</p>
                  <p className="text-xs text-emerald-800/80 dark:text-emerald-200/80">Planifica y consulta rutas óptimas</p>
                </div>
              </Link>
              <Link href="/predicciones" className="group">
                <div className="rounded-md border border-sky-200 bg-gradient-to-br from-sky-50 to-white p-3 transition-all hover:shadow-md dark:border-sky-900/60 dark:from-sky-950 dark:to-gray-900">
                  <p className="font-semibold text-sky-700 dark:text-sky-300 group-hover:translate-x-0.5 transition-transform">Predicciones</p>
                  <p className="text-xs text-sky-800/80 dark:text-sky-200/80">Explora predicciones de tráfico</p>
                </div>
              </Link>
              <Link href="/perfil" className="group">
                <div className="rounded-md border border-purple-200 bg-gradient-to-br from-purple-50 to-white p-3 transition-all hover:shadow-md dark:border-purple-900/60 dark:from-purple-950 dark:to-gray-900">
                  <p className="font-semibold text-purple-700 dark:text-purple-300 group-hover:translate-x-0.5 transition-transform">Mi Perfil</p>
                  <p className="text-xs text-purple-800/80 dark:text-purple-200/80">Editar nombre, idioma y preferencias</p>
                </div>
              </Link>
              <button
                type="button"
                className="text-left rounded-md border border-indigo-200 bg-gradient-to-br from-indigo-50 to-white p-3 transition-all hover:shadow-md dark:border-indigo-900/60 dark:from-indigo-950 dark:to-gray-900"
                aria-label="Asistente virtual"
                onClick={() => alert("El asistente virtual se integrará próximamente.")}
              >
                <p className="font-semibold text-indigo-700 dark:text-indigo-300">Asistente Virtual</p>
                <p className="text-xs text-indigo-800/80 dark:text-indigo-200/80">Pregúntale sobre el tráfico y rutas</p>
              </button>
            </CardContent>
          </Card>
        </section>

        <section className="max-w-7xl mx-auto">
          <Card className="border-sky-100/80 dark:border-sky-900/50">
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle className="text-sky-700 dark:text-sky-300">Mapa de tráfico</CardTitle>
                <p className="text-xs text-gray-500 dark:text-gray-400">Usa "Mi ubicación" para centrar el mapa</p>
              </div>
            </CardHeader>
            <CardContent>
              <div className="relative h-[420px] w-full rounded-lg overflow-hidden ring-1 ring-sky-100 dark:ring-sky-900">
                <TrafficMap
                  onReady={(map) => {
                    // Placeholder para futuras capas de tráfico/predicción
                  }}
                  className="h-full w-full"
                  onViewportChange={(v) => {
                    setViewport(v);
                  }}
                  userLocation={userLoc}
                  focusCenter={focusCenter}
                  segments={segments}
                />
                <div className="absolute right-3 top-3 z-[1100]">
                  <LegendTraffic />
                </div>
                <div className="absolute left-3 bottom-3 right-3 z-[1100] max-w-xl">
                  <TrafficStatus 
                    viewport={viewport} 
                    backendUrl={backendUrl}
                    onStatusUpdate={(status) => {
                      // Actualizar el resumen de tráfico cuando se reciben datos
                      if (status && !status.error) {
                        setSummary({
                          city: selectedCity?.name,
                          currentSpeed: status.currentSpeed,
                          freeFlowSpeed: status.freeFlowSpeed,
                          congestionLevel: status.congestionLevel,
                          hasCoverage: true,
                          updatedAt: new Date().toISOString(),
                        });
                      } else {
                        setSummary({
                          city: selectedCity?.name,
                          hasCoverage: false,
                          updatedAt: new Date().toISOString(),
                        });
                      }
                    }}
                  />
                </div>
              </div>
              <div className="mt-3">
                <TrafficNearby
                  backendUrl={backendUrl}
                  onUpdate={({ level, flow, lat, lon }) => {
                    setUserLoc([lat, lon]);
                    setFocusCenter([lat, lon]);
                    // Dibujar un pequeño segmento ficticio como indicación de tráfico en el punto (línea corta N-S)
                    const delta = 0.001; // ~100m dependiendo lat
                    setSegments([
                      {
                        level,
                        coords: [
                          [lat - delta, lon],
                          [lat + delta, lon],
                        ],
                      },
                    ]);
                  }}
                />
              </div>
            </CardContent>
          </Card>
        </section>
        </div>
      </AppLayout>
    </ProtectedRoute>
  );
}

function ThemeToggle() {
  const [dark, setDark] = useState(false);
  useEffect(() => {
    const root = document.documentElement;
    if (dark) root.classList.add("dark");
    else root.classList.remove("dark");
  }, [dark]);
  return (
    <button
      className="inline-flex items-center rounded-md border border-gray-300 bg-white px-3 py-1 text-sm text-gray-700 shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500 dark:border-gray-600 dark:bg-gray-800 dark:text-gray-200 dark:hover:bg-gray-700"
      onClick={() => setDark((v) => !v)}
      aria-pressed={dark}
      aria-label="Alternar modo oscuro"
    >
      {dark ? "Oscuro" : "Claro"}
    </button>
  );
}

function LanguageSelect() {
  const [lang, setLang] = useState("es");
  return (
    <select
      value={lang}
      onChange={(e) => setLang(e.target.value)}
      aria-label="Seleccionar idioma"
      className="rounded-md border border-gray-300 bg-white px-2 py-1 text-sm text-gray-700 shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 dark:border-gray-600 dark:bg-gray-800 dark:text-gray-200"
    >
      <option value="es">Español</option>
      <option value="en">English</option>
    </select>
  );
}