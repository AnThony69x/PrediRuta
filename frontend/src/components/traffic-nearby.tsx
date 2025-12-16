"use client";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { getBackendUrl } from "@/lib/backend-url";

type FlowData = {
  currentSpeed?: number;
  freeFlowSpeed?: number;
  confidence?: number;
  frc?: string;
};

type Level = "free" | "moderate" | "heavy" | "severe";

function levelFrom(flow?: FlowData): Level {
  if (!flow || !flow.currentSpeed || !flow.freeFlowSpeed || flow.freeFlowSpeed <= 0) return "free";
  const ratio = flow.currentSpeed / flow.freeFlowSpeed;
  if (ratio >= 0.9) return "free";
  if (ratio >= 0.7) return "moderate";
  if (ratio >= 0.5) return "heavy";
  return "severe";
}

export function TrafficNearby({ onUpdate, backendUrl }: { onUpdate?: (p: { level: Level; flow: FlowData; lat: number; lon: number }) => void; backendUrl?: string }) {
  const [coords, setCoords] = useState<{ lat: number; lon: number } | null>(null);
  const [flow, setFlow] = useState<FlowData | null>(null);
  const [updatedAt, setUpdatedAt] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [hasInitialized, setHasInitialized] = useState(false);
  const intervalRef = useRef<number | null>(null);
  const fetchAbortRef = useRef<AbortController | null>(null);

  const level = useMemo(() => levelFrom(flow || undefined), [flow]);

  const fetchFlow = useCallback(async (lat: number, lon: number) => {
    // Cancelar fetch anterior si existe
    if (fetchAbortRef.current) {
      fetchAbortRef.current.abort();
    }
    fetchAbortRef.current = new AbortController();

    try {
      setLoading(true);
      setError(null);
      const base = (backendUrl || getBackendUrl()).replace(/\/$/, "");
      const url = `${base}/api/v1/traffic/status?lat=${lat}&lon=${lon}`;
      const res = await fetch(url, { signal: fetchAbortRef.current.signal });
      
      if (!res.ok) {
        const text = await res.text();
        throw new Error(text || `HTTP ${res.status}`);
      }
      
      const data = await res.json();
      const f: FlowData = {
        currentSpeed: data?.currentSpeed,
        freeFlowSpeed: data?.freeFlowSpeed,
        confidence: data?.confidence,
        frc: undefined,
      };
      
      setFlow(f);
      setUpdatedAt(new Date().toISOString());
      onUpdate?.({ level: levelFrom(f), flow: f, lat, lon });

      // Persistir en backend (sin bloquear)
      const persistUrl = `${base}/api/v1/traffic/data`;
      fetch(persistUrl, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          road_segment_id: null,
          lat,
          lon,
          speed_kmh: f.currentSpeed ?? 0,
          traffic_level: (() => {
            const lv = data?.congestionLevel as any;
            if (lv === "free") return 1;
            if (lv === "moderate") return 2;
            if (lv === "heavy") return 3;
            if (lv === "severe") return 4;
            return 2;
          })(),
          vehicle_count: 0,
          congestion_factor: f.freeFlowSpeed ? Math.max(0, Math.min(1, 1 - (f.currentSpeed ?? 0) / f.freeFlowSpeed)) : 0,
          data_source: "tomtom",
        }),
      }).catch(() => {
        // No bloquear UI si falla persistencia
      });
    } catch (e: any) {
      // Ignorar errores de abortController
      if (e.name !== 'AbortError') {
        setError(e?.message || "Error de red");
      }
    } finally {
      setLoading(false);
    }
  }, [backendUrl, onUpdate]);

  const getLocation = useCallback(() => {
    if (!navigator.geolocation) {
      // Fallback a Manta, Ecuador si no hay geolocalización
      const mantaCoords = { lat: -0.95, lon: -80.72 };
      setCoords(mantaCoords);
      fetchFlow(mantaCoords.lat, mantaCoords.lon);
      return;
    }
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        const { latitude, longitude } = pos.coords;
        setCoords({ lat: latitude, lon: longitude });
        fetchFlow(latitude, longitude);
      },
      () => {
        // Si falla geolocalización, usar Manta, Ecuador por defecto
        const mantaCoords = { lat: -0.95, lon: -80.72 };
        setCoords(mantaCoords);
        fetchFlow(mantaCoords.lat, mantaCoords.lon);
        setError("Usando ubicación de Manta, Ecuador");
      },
      { enableHighAccuracy: true, timeout: 10000 }
    );
  }, [fetchFlow]);

  // Obtener ubicación inicial una sola vez
  useEffect(() => {
    if (!hasInitialized) {
      getLocation();
      setHasInitialized(true);
    }
  }, [hasInitialized, getLocation]);

  // Configurar intervalo de actualización
  useEffect(() => {
    if (!coords) return;
    
    // Actualizar cada 60 segundos si tenemos coordenadas
    intervalRef.current = window.setInterval(() => {
      fetchFlow(coords.lat, coords.lon);
    }, 60000);

    return () => {
      if (intervalRef.current) window.clearInterval(intervalRef.current);
    };
  }, [coords, fetchFlow]);

  const info = (() => {
    switch (level) {
      case "free":
        return { label: "Fluido", color: "bg-green-500", ring: "ring-green-300" };
      case "moderate":
        return { label: "Moderado", color: "bg-yellow-500", ring: "ring-yellow-300" };
      case "heavy":
        return { label: "Pesado", color: "bg-orange-500", ring: "ring-orange-300" };
      case "severe":
        return { label: "Severo", color: "bg-red-600", ring: "ring-red-400" };
      default:
        return { label: "N/D", color: "bg-gray-400", ring: "ring-gray-300" };
    }
  })();

  const speedPct = useMemo(() => {
    if (!flow?.currentSpeed || !flow?.freeFlowSpeed || flow.freeFlowSpeed <= 0) return 0;
    return Math.round((flow.currentSpeed / flow.freeFlowSpeed) * 100);
  }, [flow]);

  // Cleanup: cancelar requests pendientes al desmontar
  useEffect(() => {
    return () => {
      if (fetchAbortRef.current) {
        fetchAbortRef.current.abort();
      }
      if (intervalRef.current) {
        window.clearInterval(intervalRef.current);
      }
    };
  }, []);

  return (
    <div className={`rounded-xl shadow-lg p-5 bg-white dark:bg-gray-800 border-2 transition-all ${
      level === "severe" 
        ? "border-red-500 dark:border-red-400 animate-[pulse_2s_ease-in-out_infinite]" 
        : "border-gray-200 dark:border-gray-700"
    }`}>
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-3">
          <h3 className="text-base font-bold text-gray-800 dark:text-gray-100">🚦 Tráfico cercano</h3>
          <span className={`inline-flex items-center gap-2 rounded-full px-3 py-1.5 text-xs font-semibold shadow-sm ${
            level === "free" ? "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300" :
            level === "moderate" ? "bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-300" :
            level === "heavy" ? "bg-orange-100 text-orange-800 dark:bg-orange-900/30 dark:text-orange-300" :
            "bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-300"
          }`}>
            <span className={`inline-block h-2.5 w-2.5 rounded-full ${info.color} shadow-sm`}></span>
            {info.label}
          </span>
        </div>
        <button
          onClick={() => coords && fetchFlow(coords.lat, coords.lon)}
          className="text-xs px-3 py-1.5 rounded-lg border-2 border-gray-300 dark:border-gray-600 font-medium text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors shadow-sm"
          disabled={loading}
        >
          {loading ? "..." : "Actualizar"}
        </button>
      </div>

      {loading && (
        <div className="mt-3 animate-pulse space-y-3">
          <div className="h-4 rounded-lg bg-gray-200 dark:bg-gray-700 w-2/3"></div>
          <div className="h-3 rounded-lg bg-gray-200 dark:bg-gray-700 w-full"></div>
          <div className="h-3 rounded-lg bg-gray-200 dark:bg-gray-700 w-4/5"></div>
        </div>
      )}
      {!loading && error && (
        <div className="mt-3 p-4 rounded-lg bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800">
          <div className="text-sm text-red-700 dark:text-red-300 font-semibold flex items-start gap-2">
            <span className="text-lg">⚠️</span>
            <span>
              {error.includes('Point too far') || error.includes('nearest existing segment')
                ? 'Sin cobertura de tráfico en esta zona'
                : error}
            </span>
          </div>
          {(error.includes('Point too far') || error.includes('nearest existing segment')) && (
            <div className="mt-3 text-xs text-red-600 dark:text-red-400 space-y-1 pl-7">
              <p>• Sin datos de tráfico disponibles en esta ubicación específica.</p>
              <p>• TomTom tiene mejor cobertura en carreteras principales y avenidas.</p>
              <p>• Intenta con otra ubicación o espera unos minutos.</p>
            </div>
          )}
        </div>
      )}
      {!loading && !error && (
        <div className="mt-4 space-y-4">
          <div className="bg-gray-50 dark:bg-gray-900/50 rounded-lg p-3">
            <div className="flex justify-between items-center text-sm mb-2">
              <span className="font-medium text-gray-700 dark:text-gray-300">Velocidad actual</span>
              <span className="font-bold text-gray-900 dark:text-gray-100">
                {flow?.currentSpeed?.toFixed?.(0)} km/h
              </span>
            </div>
            <div className="flex justify-between items-center text-xs text-gray-500 dark:text-gray-400">
              <span>Flujo libre</span>
              <span>{flow?.freeFlowSpeed?.toFixed?.(0)} km/h</span>
            </div>
            <div className="mt-3 h-3 w-full rounded-full bg-gray-200 dark:bg-gray-700 overflow-hidden shadow-inner">
              <div 
                className={`h-full ${info.color} transition-all duration-700 ease-out shadow-sm`} 
                style={{ width: `${speedPct}%` }} 
              />
            </div>
            <div className="mt-2 text-center text-xs font-semibold text-gray-600 dark:text-gray-400">
              {speedPct}% del flujo libre
            </div>
          </div>

          <div className="flex justify-between items-center pt-3 border-t border-gray-200 dark:border-gray-700">
            <span className="text-xs text-gray-500 dark:text-gray-400">
              🕐 Actualizado: {updatedAt ? new Date(updatedAt).toLocaleTimeString('es-ES', { hour: '2-digit', minute: '2-digit' }) : "—"}
            </span>
            <span className="text-[10px] text-gray-400 dark:text-gray-500">© TomTom © OSM</span>
          </div>
        </div>
      )}
    </div>
  );
}
