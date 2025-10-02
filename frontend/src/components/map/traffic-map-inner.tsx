"use client";
import { MapContainer, TileLayer, ZoomControl, ScaleControl, useMap, LayersControl, useMapEvent } from "react-leaflet";
import type { Map as LeafletMap } from "leaflet";
import { useCallback } from "react";

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
      className="absolute z-[1000] right-3 bottom-24 md:bottom-28 rounded-md bg-white/90 px-3 py-2 text-sm font-medium text-gray-700 shadow hover:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-800/90 dark:text-gray-100"
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
  center = [-0.1807, -78.4678],
  zoom = 12,
  className,
  onReady,
  onViewportChange
}: TrafficMapInnerProps) {
  const trafficTileUrl = process.env.NEXT_PUBLIC_TRAFFIC_TILE_URL;
  const trafficAttribution = process.env.NEXT_PUBLIC_TRAFFIC_ATTR || "Datos de tráfico";

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
        <ViewportWatcher onChange={onViewportChange} />
        <LayersControl position="topright">
          <LayersControl.BaseLayer checked name="Carto Light">
            <TileLayer
              attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OSM</a> &copy; <a href="https://carto.com/attributions">CARTO</a>'
              url="https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png"
            />
          </LayersControl.BaseLayer>
          <LayersControl.BaseLayer name="OSM Standard">
            <TileLayer
              attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
              url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            />
          </LayersControl.BaseLayer>
          <LayersControl.BaseLayer name="Carto Dark">
            <TileLayer
              attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OSM</a> &copy; <a href="https://carto.com/attributions">CARTO</a>'
              url="https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png"
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
        <ZoomControl position="bottomright" />
        <ScaleControl position="bottomleft" />
        <FitToLocation />

        {!trafficTileUrl && (
          <div className="absolute left-3 top-3 z-[1000] rounded-md bg-white/90 px-3 py-2 text-xs text-gray-700 shadow dark:bg-gray-800/90 dark:text-gray-100">
            <span className="font-semibold">Capa tráfico</span>: Configura NEXT_PUBLIC_TRAFFIC_TILE_URL para activar.
          </div>
        )}
      </MapContainer>
    </div>
  );
}

export default TrafficMapInner;
