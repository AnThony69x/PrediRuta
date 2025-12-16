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
      className="absolute z-[1000] right-3 bottom-20 rounded-lg bg-white/95 backdrop-blur-sm px-4 py-2.5 text-sm font-semibold text-blue-600 shadow-lg hover:bg-white hover:shadow-xl focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-800/95 dark:text-blue-400 dark:hover:bg-gray-800 transition-all flex items-center gap-2 border border-blue-200 dark:border-blue-800"
    >
      <span className="text-lg">📍</span>
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
  center = [-0.95, -80.72], // Manta, Ecuador por defecto
  zoom = 15, // Zoom más cercano por defecto
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

        {/* Marcador de ubicación del usuario - círculo azul con pulso */}
        {userLocation && (
          <>
            <CircleMarker 
              center={userLocation} 
              radius={12} 
              pathOptions={{ 
                color: "#2563eb", 
                fillColor: "#3b82f6", 
                fillOpacity: 0.3,
                weight: 2
              }} 
            />
            <CircleMarker 
              center={userLocation} 
              radius={6} 
              pathOptions={{ 
                color: "#1e40af", 
                fillColor: "#3b82f6", 
                fillOpacity: 1,
                weight: 2
              }} 
            />
          </>
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
    // Usar zoom 16 para vista más cercana
    map.setView(center, 16, { animate: true, duration: 1 });
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
