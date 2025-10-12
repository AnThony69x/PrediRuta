"use client";
import { ProtectedRoute } from "@/components/ProtectedRoute";
import { useAuth } from "@/hooks/useAuth";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { TrafficMap } from "@/components/map/traffic-map";
import { UserAvatar } from "@/components/ui/user-avatar";
import { DarkModeToggle } from "@/components/ui/dark-mode-toggle";
import { getUserFirstName } from "@/utils/userHelpers";
import Link from "next/link";
import { useEffect, useState } from "react";
import { TrafficStatus } from "@/components/traffic-status";
import { LegendTraffic } from "@/components/legend-traffic";
import { TrafficNearby } from "@/components/traffic-nearby";
import { getBackendUrl } from "@/lib/backend-url";

type TrafficSummary = {
  city?: string;
  updatedAt?: string;
  segmentsObserved?: number;
  avgSpeedKmH?: number;
  congestionLevel?: 1 | 2 | 3 | 4 | 5;
};

export default function DashboardPage() {
  const { user, loading, signOut } = useAuth();
  const [summary, setSummary] = useState<TrafficSummary | null>(null);
  const [viewport, setViewport] = useState<{ center: [number, number]; zoom: number; bbox: { west: number; south: number; east: number; north: number } } | null>(null);
  const backendUrl = getBackendUrl();
  const [userLoc, setUserLoc] = useState<[number, number] | undefined>(undefined);
  const [focusCenter, setFocusCenter] = useState<[number, number] | undefined>(undefined);
  const [segments, setSegments] = useState<Array<{ coords: [number, number][], level: "free" | "moderate" | "heavy" | "severe" }>>([]);

  useEffect(() => {
    // Configurar datos de ejemplo para modo frontend-only
    setSummary({
      updatedAt: new Date().toISOString(),
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
      <main className="p-4 md:p-6 space-y-6 min-h-screen bg-gradient-to-b from-white via-sky-50 to-purple-50 dark:from-gray-900 dark:via-indigo-950 dark:to-purple-950">
        <header className="max-w-7xl mx-auto flex justify-between items-start">
          <div>
            <h1 className="text-2xl md:text-3xl font-extrabold bg-gradient-to-r from-emerald-600 via-sky-600 to-purple-600 bg-clip-text text-transparent animate-[gradient_6s_ease_infinite] [background-size:200%_auto]">
              Dashboard
            </h1>
            <p className="text-sm text-gray-600 dark:text-gray-300 mt-1">
              Hola {getUserFirstName(user)}. Aquí tienes una vista general del sistema.
            </p>
          </div>

          <div className="flex items-center space-x-4">
            <DarkModeToggle />
            <Link href="/perfil" className="group">
              <div className="flex items-center space-x-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg p-2 transition-colors">
                <UserAvatar user={user} size="md" showName />
                <svg className="w-4 h-4 text-gray-400 group-hover:text-gray-600 dark:group-hover:text-gray-300 transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </div>
            </Link>
            <Button
              variant="outline"
              onClick={signOut}
              className="text-sm border-emerald-300 text-emerald-700 hover:bg-emerald-50 dark:border-emerald-700 dark:text-emerald-300 dark:hover:bg-emerald-900/30"
            >
              Cerrar sesión
            </Button>
          </div>
        </header>

        <section className="grid grid-cols-1 lg:grid-cols-3 gap-4 max-w-7xl mx-auto">
          <Card className="col-span-1 border-emerald-100/80 dark:border-emerald-900/50">
            <CardHeader>
              <CardTitle className="text-emerald-700 dark:text-emerald-300">Resumen de tráfico</CardTitle>
            </CardHeader>
            <CardContent>
              {summary ? (
                <ul className="text-sm text-gray-700 dark:text-gray-200 space-y-1">
                  {summary.city && (
                    <li><span className="font-medium">Ciudad:</span> {summary.city}</li>
                  )}
                  {typeof summary.segmentsObserved === "number" && (
                    <li><span className="font-medium">Segmentos observados:</span> {summary.segmentsObserved}</li>
                  )}
                  {typeof summary.avgSpeedKmH === "number" && (
                    <li><span className="font-medium">Velocidad promedio:</span> {summary.avgSpeedKmH} km/h</li>
                  )}
                  {summary.congestionLevel && (
                    <li><span className="font-medium">Nivel de congestión:</span> {"".padStart(summary.congestionLevel, "⬤")}<span className="sr-only">{summary.congestionLevel}/5</span></li>
                  )}
                  <li className="text-xs text-gray-500 dark:text-gray-400">
                    Modo: Frontend Only {summary?.updatedAt ? "✅" : "⚠️"}
                  </li>
                  {viewport && (
                    <li className="text-xs text-gray-500 dark:text-gray-400">
                      Vista mapa → lat,lng: {viewport.center[0].toFixed(4)}, {viewport.center[1].toFixed(4)} | zoom: {viewport.zoom}
                    </li>
                  )}
                </ul>
              ) : (
                <p className="text-sm text-gray-600 dark:text-gray-300">
                  Aún no hay datos disponibles para mostrar. Conecta el backend de tráfico para ver métricas en tiempo real.
                </p>
              )}
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

          <Card className="col-span-1 border-purple-100/80 dark:border-purple-900/50">
            <CardHeader>
              <CardTitle className="text-purple-700 dark:text-purple-300">Preferencias</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-700 dark:text-gray-200">Modo oscuro</span>
                <ThemeToggle />
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-700 dark:text-gray-200">Idioma</span>
                <LanguageSelect />
              </div>
              <div className="pt-2">
                <Button variant="outline" className="w-full" onClick={signOut}>Cerrar sesión</Button>
              </div>
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
                  <TrafficStatus viewport={viewport} backendUrl={backendUrl} />
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
      </main>
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