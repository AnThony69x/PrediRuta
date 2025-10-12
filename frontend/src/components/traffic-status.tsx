"use client";
import { useEffect, useMemo, useRef, useState } from "react";
import { getBackendUrl } from "@/lib/backend-url";

type Viewport = {
  center: [number, number];
  zoom: number;
  bbox: { west: number; south: number; east: number; north: number };
};

type Status = {
  provider?: string;
  currentSpeed?: number;
  freeFlowSpeed?: number;
  confidence?: number;
  hasTraffic?: boolean;
  congestionLevel?: "free" | "moderate" | "heavy" | "severe";
  error?: string;
  updatedAt?: string;
};

export function TrafficStatus({ viewport, backendUrl }: { viewport: Viewport | null; backendUrl?: string }) {
  const [status, setStatus] = useState<Status | null>(null);
  const [loading, setLoading] = useState(false);
  const timer = useRef<number | undefined>(undefined);
  const [fetchId, setFetchId] = useState(0);

  const bboxStr = useMemo(() => {
    if (!viewport) return null;
    const b = viewport.bbox;
    return `${b.west},${b.south},${b.east},${b.north}`;
  }, [viewport]);

  useEffect(() => {
    if (!bboxStr) return;
    if (timer.current) window.clearTimeout(timer.current);
    // Debounce de 500ms
    timer.current = window.setTimeout(async () => {
      try {
        setLoading(true);
  const base = (backendUrl || getBackendUrl()).replace(/\/$/, "");
  const url = `${base}/api/v1/traffic/status?bbox=${encodeURIComponent(bboxStr)}`;
        const res = await fetch(url);
        if (!res.ok) {
          const text = await res.text();
          throw new Error(text || `HTTP ${res.status}`);
        }
        const data = await res.json();
        setStatus({
          provider: data.provider,
          currentSpeed: data.currentSpeed,
          freeFlowSpeed: data.freeFlowSpeed,
          confidence: data.confidence,
          hasTraffic: data.hasTraffic,
          congestionLevel: data.congestionLevel,
          updatedAt: new Date().toISOString(),
        });
      } catch (e: any) {
        setStatus({ error: e?.message || "Error desconocido" });
      } finally {
        setLoading(false);
      }
    }, 500);

    return () => {
      if (timer.current) window.clearTimeout(timer.current);
    };
  }, [bboxStr, backendUrl, fetchId]);

  const refreshNow = async () => {
    if (!bboxStr) return;
    if (timer.current) window.clearTimeout(timer.current);
    setFetchId((n) => n + 1);
  };

  const levelInfo = (level?: Status["congestionLevel"]) => {
    switch (level) {
      case "free":
        return { label: "Fluido", color: "bg-green-500", text: "text-green-700", ring: "ring-green-300" };
      case "moderate":
        return { label: "Moderado", color: "bg-yellow-500", text: "text-yellow-700", ring: "ring-yellow-300" };
      case "heavy":
        return { label: "Pesado", color: "bg-orange-500", text: "text-orange-700", ring: "ring-orange-300" };
      case "severe":
        return { label: "Severo", color: "bg-red-600", text: "text-red-700", ring: "ring-red-400" };
      default:
        return { label: "N/D", color: "bg-gray-400", text: "text-gray-700", ring: "ring-gray-300" };
    }
  };

  const pct = (num?: number, den?: number) => {
    if (!num || !den || den <= 0) return 0;
    const v = Math.max(0, Math.min(1, num / den));
    return Math.round(v * 100);
  };

  if (!viewport) return null;

  const info = levelInfo(status?.congestionLevel);
  const severe = status?.congestionLevel === "severe";
  const speedPct = pct(status?.currentSpeed, status?.freeFlowSpeed);
  const confidencePct = status?.confidence ? Math.round(Math.max(0, Math.min(100, status.confidence * 100))) : 0;

  return (
    <div
      className={`rounded-2xl shadow-md p-4 bg-white/80 dark:bg-gray-900/80 backdrop-blur-sm text-gray-800 dark:text-gray-100 transition-all ${
        severe ? "ring-2 ring-red-500 animate-[pulse_2s_ease-in-out_infinite]" : "ring-1 ring-gray-200 dark:ring-gray-700"
      }`}
    >
      {/* Encabezado */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <span className={`inline-flex items-center gap-2 rounded-full px-2.5 py-1 text-xs font-semibold ${info.text} bg-gray-100 dark:bg-gray-800`}>
            <span className={`inline-block h-2.5 w-2.5 rounded-full ${info.color}`}></span>
            {info.label}
          </span>
          {status?.provider && <span className="text-[11px] text-gray-500">Fuente: {status.provider}</span>}
        </div>
        <button
          onClick={refreshNow}
          className="text-[11px] px-2 py-1 rounded-md border border-gray-300 hover:bg-gray-50 dark:border-gray-700 dark:hover:bg-gray-800"
          title="Actualizar ahora"
        >
          Actualizar
        </button>
      </div>

      {/* Loading */}
      {loading && (
        <div className="mt-3 animate-pulse space-y-2">
          <div className="h-3 rounded bg-gray-200 dark:bg-gray-700 w-2/3"></div>
          <div className="h-2.5 rounded bg-gray-200 dark:bg-gray-700 w-full"></div>
          <div className="h-2.5 rounded bg-gray-200 dark:bg-gray-700 w-5/6"></div>
        </div>
      )}

      {/* Error */}
      {!loading && status?.error && (
        <div className="mt-3 text-sm text-red-600 dark:text-red-400">
          No se pudo obtener el tráfico actual.
        </div>
      )}

      {/* Datos */}
      {!loading && status && !status.error && (
        <div className="mt-3 space-y-3">
          {/* Velocidad actual vs flujo libre */}
          <div>
            <div className="flex justify-between text-[11px] text-gray-500">
              <span>Velocidad</span>
              <span>
                {status.currentSpeed?.toFixed?.(0)} / {status.freeFlowSpeed?.toFixed?.(0)} km/h
              </span>
            </div>
            <div className="mt-1 h-2.5 w-full rounded-full bg-gray-200 dark:bg-gray-700 overflow-hidden">
              <div
                className={`h-full ${info.color} transition-all duration-700 ease-out`}
                style={{ width: `${speedPct}%` }}
              />
            </div>
          </div>

          {/* Confianza */}
          <div>
            <div className="flex justify-between text-[11px] text-gray-500">
              <span>Confianza</span>
              <span>{confidencePct}%</span>
            </div>
            <div className="mt-1 h-2 w-full rounded-full bg-gray-200 dark:bg-gray-700 overflow-hidden">
              <div
                className={`h-full bg-[#C8102E] transition-all duration-700 ease-out`}
                style={{ width: `${confidencePct}%` }}
              />
            </div>
          </div>

          {/* Timestamp */}
          <div className="flex justify-between items-center text-[11px] text-gray-500">
            <span>
              Última actualización: {status.updatedAt ? new Date(status.updatedAt).toLocaleTimeString() : "—"}
            </span>
            <span className="opacity-80">© TomTom © OpenStreetMap contributors</span>
          </div>
        </div>
      )}
    </div>
  );
}
