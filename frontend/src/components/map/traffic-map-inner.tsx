"use client";
import { MapContainer, TileLayer, ZoomControl, ScaleControl, useMap, LayersControl, useMapEvent, Polyline, CircleMarker } from "react-leaflet";
import type { Map as LeafletMap } from "leaflet";
import { useCallback, useEffect } from "react";

type TrafficMapInnerProps = {
  center?: [number, number];
  zoom?: number;
  className?: string;
  onReady?: (map: L.Map) => void;
  onViewportChange?: (v: {
    center: [number, number];
    zoom: number;
    bbox: { west: number; south: number; east: number; north: number };
  }) => void;
  userLocation?: [number, number];
  segments?: Array<{ coords: [number, number][], level: "free" | "moderate" | "heavy" | "severe" }>;
  focusCenter?: [number, number];
};

function FitToLocation() {
  const map = useMap();
  const handleClick = useCallback(() => {
    if (!navigator.geolocation) return;
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        const { latitude, longitude } = pos.coords;
        map.setView([latitude, longitude], Math.max(map.getZoom(), 13), {
          animate: true
        });
      },
      () => {
        // Silencioso: sin permisos o error
      },
      { enableHighAccuracy: true, timeout: 10000 }
    );
  }, [map]);

  return (
    <button
      aria-label="Usar mi ubicación"
      onClick={handleClick}
      className="absolute z-[1000] right-3 bottom-3 rounded-md bg-white/90 px-3 py-2 text-sm font-medium text-gray-700 shadow hover:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-800/90 dark:text-gray-100"
    >
      Mi ubicación
    </button>
  );
}

function ViewportWatcher({ onChange }: { onChange?: TrafficMapInnerProps["onViewportChange"] }) {
  const map = useMap();
  useMapEvent("moveend", () => {
    if (!onChange) return;
    const c = map.getCenter();
    const z = map.getZoom();
    const b = map.getBounds();
    onChange({
      center: [c.lat, c.lng],
      zoom: z,
      bbox: { west: b.getWest(), south: b.getSouth(), east: b.getEast(), north: b.getNorth() },
    });
  });
  useMapEvent("zoomend", () => {
    if (!onChange) return;
    const c = map.getCenter();
    const z = map.getZoom();
    const b = map.getBounds();
    onChange({
      center: [c.lat, c.lng],
      zoom: z,
      bbox: { west: b.getWest(), south: b.getSouth(), east: b.getEast(), north: b.getNorth() },
    });
  });
  return null;
}

export function TrafficMapInner({
  center = [40.4168, -3.7038], // Madrid por defecto en lugar de Quito
  zoom = 12,
  className,
  onReady,
  onViewportChange,
  userLocation,
  segments,
  focusCenter
}: TrafficMapInnerProps) {
  const trafficTileUrl = process.env.NEXT_PUBLIC_TRAFFIC_TILE_URL;
  const trafficAttribution = process.env.NEXT_PUBLIC_TRAFFIC_ATTR || "Datos de tráfico";
  const tomtomBase = process.env.NEXT_PUBLIC_MAP_BASE_URL || "https://api.tomtom.com/map/1/tile/basic/main/{z}/{x}/{y}.png";
  const tomtomKey = process.env.NEXT_PUBLIC_TOMTOM_MAP_KEY;
  const tomtomUrl = tomtomKey ? `${tomtomBase}?key=${tomtomKey}` : tomtomBase;

  return (
    <div className={className}>
      <MapContainer
        center={center}
        zoom={zoom}
        zoomControl={false}
        className="h-full w-full rounded-md"
        style={{ height: "100%", width: "100%" }}
        ref={(instance) => {
          if (instance && onReady) onReady(instance as unknown as LeafletMap);
        }}
      >
        {/* Enfocar a centro cuando cambia */}
        <FocusOnCenter center={focusCenter} />
        <ViewportWatcher onChange={onViewportChange} />
        <LayersControl position="topright">
          <LayersControl.BaseLayer checked name="TomTom Basic">
            <TileLayer
              attribution='&copy; TomTom &copy; OpenStreetMap contributors'
              url={tomtomUrl}
            />
          </LayersControl.BaseLayer>
          <LayersControl.BaseLayer name="OSM Standard">
            <TileLayer
              attribution='&copy; OpenStreetMap contributors'
              url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            />
          </LayersControl.BaseLayer>

          {trafficTileUrl && (
            <LayersControl.Overlay checked name="Tráfico en tiempo real">
              <TileLayer
                url={trafficTileUrl}
                attribution={trafficAttribution}
                opacity={0.85}
              />
            </LayersControl.Overlay>
          )}
        </LayersControl>
        <ZoomControl position="topleft" />
        <ScaleControl position="bottomleft" />
        <FitToLocation />

        {/* Marcador de ubicación del usuario como círculo para evitar issues de assets */}
        {userLocation && (
          <CircleMarker center={userLocation} radius={8} pathOptions={{ color: "#2563eb", fillColor: "#3b82f6", fillOpacity: 0.9 }} />
        )}

        {/* Segmentos de tráfico coloreados */}
        {segments?.map((s, idx) => (
          <Polyline key={idx} positions={s.coords} pathOptions={{ color: levelToColor(s.level), weight: 6, opacity: 0.9 }} />
        ))}

        {!trafficTileUrl && (
          <div className="absolute left-3 top-3 z-[1000] rounded-md bg-white/90 px-3 py-2 text-xs text-gray-700 shadow dark:bg-gray-800/90 dark:text-gray-100">
            <span className="font-semibold">Capa tráfico</span>: Configura NEXT_PUBLIC_TRAFFIC_TILE_URL para activar. Base Map © TomTom © OpenStreetMap contributors.
          </div>
        )}
      </MapContainer>
    </div>
  );
}

export default TrafficMapInner;

function FocusOnCenter({ center }: { center?: [number, number] }) {
  const map = useMap();
  useEffect(() => {
    if (!center) return;
    map.setView(center, Math.max(map.getZoom(), 13), { animate: true });
  }, [center, map]);
  return null;
}

function levelToColor(level: "free" | "moderate" | "heavy" | "severe") {
  switch (level) {
    case "free":
      return "#22c55e"; // green-500
    case "moderate":
      return "#eab308"; // yellow-500
    case "heavy":
      return "#f97316"; // orange-500
    case "severe":
      return "#dc2626"; // red-600
    default:
      return "#64748b"; // slate-500
  }
}
