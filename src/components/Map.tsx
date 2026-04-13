"use client";

import { useEffect, useRef, useState, useCallback } from "react";
import { Place, CATEGORIES } from "@/lib/types";
import { escapeHtml } from "@/lib/sanitize";

interface MapProps {
  places: Place[];
  onPlaceClick?: (place: Place) => void;
  selectedPlace?: Place | null;
  userLocation?: { lat: number; lng: number } | null;
  className?: string;
}

const CATEGORY_COLORS: Record<string, string> = {
  food: "#e63946",
  grocery: "#2a9d8f",
  gym: "#1a1a2e",
  bars: "#264653",
  coffee: "#f4845f",
  workspace: "#0ea5e9",
  housing: "#10b981",
  entertainment: "#7209b7",
  services: "#4895ef",
  other: "#6c757d",
};

export default function Map({
  places,
  onPlaceClick,
  selectedPlace,
  userLocation,
  className = "",
}: MapProps) {
  const mapRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<L.Map | null>(null);
  const markersRef = useRef<L.Marker[]>([]);
  const userMarkerRef = useRef<L.Marker | null>(null);
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const leafletRef = useRef<any>(null);
  const [mapReady, setMapReady] = useState(false);

  // Initialize map once
  useEffect(() => {
    if (!mapRef.current) return;

    let cancelled = false;

    const initMap = async () => {
      const L = (await import("leaflet")).default;
      if (cancelled) return;

      leafletRef.current = L;

      if (mapInstanceRef.current) {
        mapInstanceRef.current.remove();
      }

      const map = L.map(mapRef.current!, {
        center: [37.7749, -122.4194],
        zoom: 13,
        zoomControl: false,
      });

      L.control.zoom({ position: "bottomright" }).addTo(map);

      // Stamen Watercolor tiles via Stadia Maps (same as desk-mate.ai)
      const stadiaKey = process.env.NEXT_PUBLIC_STADIA_API_KEY;
      const watercolorUrl = stadiaKey
        ? `https://tiles.stadiamaps.com/tiles/stamen_watercolor/{z}/{x}/{y}.jpg?api_key=${stadiaKey}`
        : "https://{s}.tile.openstreetmap.fr/hot/{z}/{x}/{y}.png";
      const labelsUrl = stadiaKey
        ? `https://tiles.stadiamaps.com/tiles/stamen_terrain_labels/{z}/{x}/{y}{r}.png?api_key=${stadiaKey}`
        : null;

      L.tileLayer(watercolorUrl, {
        attribution:
          'Map tiles by <a href="https://stamen.com">Stamen Design</a>, under CC BY 3.0. Data by <a href="https://www.openstreetmap.org/copyright">OSM</a>',
        maxZoom: 18,
      }).addTo(map);

      // Add road/place labels on top for readability (only with Stadia key)
      if (labelsUrl) {
        L.tileLayer(labelsUrl, {
          maxZoom: 18,
          pane: "overlayPane",
        }).addTo(map);
      }

      mapInstanceRef.current = map;
      setMapReady(true);
    };

    initMap();

    return () => {
      cancelled = true;
      if (mapInstanceRef.current) {
        mapInstanceRef.current.remove();
        mapInstanceRef.current = null;
      }
      setMapReady(false);
    };
  }, []);

  // Update markers whenever places change AND map is ready
  const updateMarkers = useCallback(() => {
    const L = leafletRef.current;
    const map = mapInstanceRef.current;
    if (!L || !map) return;

    markersRef.current.forEach((m) => m.remove());
    markersRef.current = [];

    places.forEach((place) => {
      const cat = CATEGORIES.find((c) => c.value === place.category);
      const color = CATEGORY_COLORS[place.category] || "#6c757d";
      const isSelected = selectedPlace?.id === place.id;

      const icon = L.divIcon({
        className: "custom-marker",
        html: `<div class="map-marker ${isSelected ? "selected" : ""}" style="--marker-color: ${color}">
          <span class="map-marker-icon">${cat?.icon || "📍"}</span>
        </div>`,
        iconSize: [32, 32],
        iconAnchor: [16, 16],
      });

      const marker = L.marker([place.lat, place.lng], { icon }).addTo(map);

      marker.bindPopup(
        `<div style="font-family: system-ui; min-width: 160px; padding: 2px 0;">
          <strong style="font-size: 13px; color: #1a1a2e;">${escapeHtml(place.name)}</strong><br/>
          <span style="color: #6c757d; font-size: 11px;">${escapeHtml(place.neighborhood)} · ${"$".repeat(Math.min(Math.max(place.price_tier, 1), 4))}</span><br/>
          <span style="color: #6c757d; font-size: 11px;">${escapeHtml(place.subcategory || place.category)}</span>
        </div>`,
        { closeButton: false, offset: [0, -12] }
      );

      marker.on("click", () => {
        if (onPlaceClick) onPlaceClick(place);
      });

      markersRef.current.push(marker);
    });

    if (places.length > 0) {
      const bounds = L.latLngBounds(
        places.map((p) => [p.lat, p.lng] as [number, number])
      );
      map.fitBounds(bounds, { padding: [60, 60], maxZoom: 14 });
    }
  }, [places, selectedPlace, onPlaceClick]);

  // Trigger marker update when map becomes ready or places change
  useEffect(() => {
    if (mapReady) {
      updateMarkers();
    }
  }, [mapReady, updateMarkers]);

  // Pan to selected
  useEffect(() => {
    if (selectedPlace && mapInstanceRef.current) {
      mapInstanceRef.current.setView(
        [selectedPlace.lat, selectedPlace.lng],
        15,
        { animate: true }
      );
    }
  }, [selectedPlace]);

  // Show user location marker
  useEffect(() => {
    const L = leafletRef.current;
    const map = mapInstanceRef.current;
    if (!L || !map || !mapReady) return;

    if (userMarkerRef.current) {
      userMarkerRef.current.remove();
      userMarkerRef.current = null;
    }

    if (userLocation) {
      const icon = L.divIcon({
        className: "custom-marker",
        html: '<div class="user-location-dot"></div>',
        iconSize: [16, 16],
        iconAnchor: [8, 8],
      });
      userMarkerRef.current = L.marker([userLocation.lat, userLocation.lng], {
        icon,
        zIndexOffset: 1000,
      }).addTo(map);
    }
  }, [userLocation, mapReady]);

  return (
    <>
      <div ref={mapRef} className={className} />
      {!mapReady && (
        <div
          className={`absolute inset-0 bg-gray-100 flex items-center justify-center ${className}`}
        >
          <div className="text-center">
            <div className="w-8 h-8 border-2 border-accent border-t-transparent rounded-full animate-spin mx-auto mb-2" />
            <span className="text-muted text-xs">Loading map...</span>
          </div>
        </div>
      )}
    </>
  );
}
