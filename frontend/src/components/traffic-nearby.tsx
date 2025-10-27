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
  const intervalRef = useRef<number | null>(null);

  const level = useMemo(() => levelFrom(flow || undefined), [flow]);

  const fetchFlow = useCallback(async (lat: number, lon: number) => {
    try {
      setLoading(true);
      setError(null);
  const base = (backendUrl || getBackendUrl()).replace(/\/$/, "");
  const url = `${base}/api/v1/traffic/status?lat=${lat}&lon=${lon}`;
      const res = await fetch(url);
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

      // Persistir en backend
      try {
  await fetch(`${(backendUrl || getBackendUrl()).replace(/\/$/, "")}/api/v1/traffic/data`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            road_segment_id: null,
            lat,
            lon,
            speed_kmh: f.currentSpeed ?? 0,
            traffic_level: (() => {
              const lv = data?.congestionLevel as any;
              // Mapear del backend (free/moderate/heavy/severe) a 1..4
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
        });
      } catch (e) {
        // No bloquear UI si falla persistencia
      }
    } catch (e: any) {
      setError(e?.message || "Error de red");
    } finally {
      setLoading(false);
    }
  }, [backendUrl, onUpdate]);

  const getLocation = useCallback(() => {
    if (!navigator.geolocation) {
      setError("Geolocalización no disponible");
      return;
    }
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        const { latitude, longitude } = pos.coords;
        setCoords({ lat: latitude, lon: longitude });
        fetchFlow(latitude, longitude);
      },
      () => setError("No se pudo obtener ubicación"),
      { enableHighAccuracy: true, timeout: 10000 }
    );
  }, [fetchFlow]);

  useEffect(() => {
    getLocation();
    intervalRef.current = window.setInterval(() => {
      if (coords) fetchFlow(coords.lat, coords.lon);
      else getLocation();
    }, 60000);
    return () => {
      if (intervalRef.current) window.clearInterval(intervalRef.current);
    };
  }, [coords, fetchFlow, getLocation]);

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

  return (
    <div className={`rounded-2xl shadow-md p-4 bg-white/80 dark:bg-gray-900/80 backdrop-blur-sm text-gray-800 dark:text-gray-100 transition-all ${
      level === "severe" ? "ring-2 ring-red-500 animate-[pulse_2s_ease-in-out_infinite]" : "ring-1 ring-gray-200 dark:ring-gray-700"
    }`}>
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <span className="text-sm font-semibold">Tráfico cercano</span>
          <span className={`inline-flex items-center gap-2 rounded-full px-2.5 py-1 text-xs font-semibold bg-gray-100 dark:bg-gray-800`}>
            <span className={`inline-block h-2.5 w-2.5 rounded-full ${info.color}`}></span>
            {info.label}
          </span>
        </div>
        <button
          onClick={() => coords && fetchFlow(coords.lat, coords.lon)}
          className="text-[11px] px-2 py-1 rounded-md border border-gray-300 hover:bg-gray-50 dark:border-gray-700 dark:hover:bg-gray-800"
        >
          Actualizar
        </button>
      </div>

      {loading && (
        <div className="mt-3 animate-pulse space-y-2">
          <div className="h-3 rounded bg-gray-200 dark:bg-gray-700 w-2/3"></div>
          <div className="h-2.5 rounded bg-gray-200 dark:bg-gray-700 w-full"></div>
        </div>
      )}
      {!loading && error && (
        <div className="mt-3">
          <div className="text-sm text-red-600 dark:text-red-400 font-medium">
            {error.includes('Point too far') || error.includes('nearest existing segment')
              ? '⚠️ Sin cobertura de tráfico en esta zona'
              : error}
          </div>
          {(error.includes('Point too far') || error.includes('nearest existing segment')) && (
            <div className="mt-2 text-xs text-gray-600 dark:text-gray-400">
              <p>TomTom no tiene datos de tráfico vehicular en Ecuador.</p>
              <p className="mt-1">Prueba con una ubicación en Europa o USA para ver datos en vivo.</p>
            </div>
          )}
        </div>
      )}
      {!loading && !error && (
        <div className="mt-3 space-y-3">
          <div className="flex justify-between text-[11px] text-gray-500">
            <span>Velocidad</span>
            <span>
              {flow?.currentSpeed?.toFixed?.(0)} / {flow?.freeFlowSpeed?.toFixed?.(0)} km/h
            </span>
          </div>
          <div className="mt-1 h-2.5 w-full rounded-full bg-gray-200 dark:bg-gray-700 overflow-hidden">
            <div className={`h-full ${info.color} transition-all duration-700 ease-out`} style={{ width: `${speedPct}%` }} />
          </div>

          <div className="flex justify-between items-center text-[11px] text-gray-500">
            <span>
              Última actualización: {updatedAt ? new Date(updatedAt).toLocaleTimeString() : "—"}
            </span>
            <span className="opacity-80">© TomTom © OpenStreetMap contributors</span>
          </div>
        </div>
      )}
    </div>
  );
}
