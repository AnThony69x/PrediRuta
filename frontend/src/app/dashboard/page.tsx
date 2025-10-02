"use client";
import { ProtectedRoute } from "@/components/ProtectedRoute";
import { useAuth } from "@/hooks/useAuth";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { TrafficMap } from "@/components/map/traffic-map";
import { UserAvatar } from "@/components/ui/user-avatar";
import { getUserFirstName } from "@/utils/userHelpers";
import Link from "next/link";
import { useEffect, useMemo, useState } from "react";

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
  const [isFetching, setIsFetching] = useState(false);

  const backendUrl = useMemo(() => {
    return process.env.NEXT_PUBLIC_BACKEND_API_URL || "http://localhost:8000";
  }, []);

  useEffect(() => {
    // Intento de obtener un resumen real si el backend expone algo (ej: /health como latido)
    const fetchSummary = async () => {
      try {
        setIsFetching(true);
        const res = await fetch(`${backendUrl}/health`, { cache: "no-store" });
        if (res.ok) {
          const data = await res.json();
          // No inventamos datos; sólo establecemos marcas temporales para indicar conexión
          setSummary({
            updatedAt: new Date().toISOString(),
          });
        } else {
          setSummary(null);
        }
      } catch (_e) {
        setSummary(null);
      } finally {
        setIsFetching(false);
      }
    };
    fetchSummary();
  }, [backendUrl]);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  return (
    <ProtectedRoute>
      <main className="p-4 md:p-6 space-y-6 min-h-screen bg-gray-50 dark:bg-gray-900">
        <header className="max-w-7xl mx-auto flex justify-between items-start">
          <div>
            <h1 className="text-2xl md:text-3xl font-bold text-gray-900 dark:text-white">
              Dashboard
            </h1>
            <p className="text-sm text-gray-600 dark:text-gray-300 mt-1">
              Hola {getUserFirstName(user)}. Aquí tienes una vista general del sistema.
            </p>
          </div>
          
          <div className="flex items-center space-x-4">
            <UserAvatar user={user} size="md" showName />
            <Button 
              variant="outline" 
              onClick={signOut}
              className="text-sm"
            >
              Cerrar sesión
            </Button>
          </div>
        </header>

        <section className="grid grid-cols-1 lg:grid-cols-3 gap-4 max-w-7xl mx-auto">
          <Card className="col-span-1">
            <CardHeader>
              <CardTitle>Resumen de tráfico</CardTitle>
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
                    Estado backend: {isFetching ? "consultando..." : summary?.updatedAt ? "conectado" : "no disponible"}
                  </li>
                </ul>
              ) : (
                <p className="text-sm text-gray-600 dark:text-gray-300">
                  Aún no hay datos disponibles para mostrar. Conecta el backend de tráfico para ver métricas en tiempo real.
                </p>
              )}
            </CardContent>
          </Card>

          <Card className="col-span-1">
            <CardHeader>
              <CardTitle>Acceso rápido</CardTitle>
            </CardHeader>
            <CardContent className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <Link href="/rutas" className="group">
                <div className="rounded-md border border-gray-200 p-3 hover:shadow-sm dark:border-gray-700 dark:hover:bg-gray-800">
                  <p className="font-medium text-gray-800 dark:text-gray-100">Rutas</p>
                  <p className="text-xs text-gray-600 dark:text-gray-300">Planifica y consulta rutas óptimas</p>
                </div>
              </Link>
              <Link href="/predicciones" className="group">
                <div className="rounded-md border border-gray-200 p-3 hover:shadow-sm dark:border-gray-700 dark:hover:bg-gray-800">
                  <p className="font-medium text-gray-800 dark:text-gray-100">Predicciones</p>
                  <p className="text-xs text-gray-600 dark:text-gray-300">Explora predicciones de tráfico</p>
                </div>
              </Link>
              <Link href="/dashboard/configuracion" className="group">
                <div className="rounded-md border border-gray-200 p-3 hover:shadow-sm dark:border-gray-700 dark:hover:bg-gray-800">
                  <p className="font-medium text-gray-800 dark:text-gray-100">Configuración</p>
                  <p className="text-xs text-gray-600 dark:text-gray-300">Perfil, idioma y preferencias</p>
                </div>
              </Link>
              <button
                type="button"
                className="text-left rounded-md border border-gray-200 p-3 hover:shadow-sm dark:border-gray-700 dark:hover:bg-gray-800"
                aria-label="Asistente virtual"
                onClick={() => alert("El asistente virtual se integrará próximamente.")}
              >
                <p className="font-medium text-gray-800 dark:text-gray-100">Asistente Virtual</p>
                <p className="text-xs text-gray-600 dark:text-gray-300">Pregúntale sobre el tráfico y rutas</p>
              </button>
            </CardContent>
          </Card>

          <Card className="col-span-1">
            <CardHeader>
              <CardTitle>Preferencias</CardTitle>
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
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle>Mapa de tráfico</CardTitle>
                <p className="text-xs text-gray-500 dark:text-gray-400">Usa "Mi ubicación" para centrar el mapa</p>
              </div>
            </CardHeader>
            <CardContent>
              <div className="h-[420px] w-full">
                <TrafficMap
                  onReady={(map) => {
                    // Placeholder para futuras capas de tráfico/predicción
                    // map (Leaflet instance) disponible para integraciones futuras
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