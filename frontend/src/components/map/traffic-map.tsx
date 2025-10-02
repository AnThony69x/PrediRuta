"use client";
import dynamic from "next/dynamic";
import type { Map as LeafletMap } from "leaflet";

const TrafficMapInner = dynamic(() => import("./traffic-map-inner").then(m => m.TrafficMapInner), {
  ssr: false
});

type TrafficMapProps = {
  center?: [number, number];
  zoom?: number;
  className?: string;
  onReady?: (map: LeafletMap) => void;
};

export function TrafficMap(props: TrafficMapProps) {
  return <TrafficMapInner {...props} />;
}

export default TrafficMap;
