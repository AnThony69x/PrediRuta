"use client";
import { MapContainer, TileLayer, ZoomControl, ScaleControl, useMap } from "react-leaflet";
import type { Map as LeafletMap } from "leaflet";
import "leaflet/dist/leaflet.css";
import { useCallback } from "react";

type TrafficMapInnerProps = {
  center?: [number, number];
  zoom?: number;
  className?: string;
  onReady?: (map: L.Map) => void;
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
      className="absolute z-[1000] right-3 top-3 rounded-md bg-white/90 px-3 py-2 text-sm font-medium text-gray-700 shadow hover:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-800/90 dark:text-gray-100"
    >
      Mi ubicación
    </button>
  );
}

export function TrafficMapInner({
  center = [-0.1807, -78.4678],
  zoom = 12,
  className,
  onReady
}: TrafficMapInnerProps) {
  return (
    <div className={className}>
      <MapContainer
        center={center}
        zoom={zoom}
        zoomControl={false}
        className="h-full w-full rounded-md"
        ref={(instance) => {
          if (instance && onReady) onReady(instance as unknown as LeafletMap);
        }}
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        <ZoomControl position="bottomright" />
        <ScaleControl position="bottomleft" />
        <FitToLocation />
      </MapContainer>
    </div>
  );
}

export default TrafficMapInner;
