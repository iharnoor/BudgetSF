"use client";

import { useState, useMemo, useCallback } from "react";
import dynamic from "next/dynamic";
import { Category, Place } from "@/lib/types";
import { SAMPLE_PLACES } from "@/lib/sample-data";
import CategoryFilter from "@/components/CategoryFilter";
import PlaceCard from "@/components/PlaceCard";
import PlaceDetail from "@/components/PlaceDetail";
import Header from "@/components/Header";
import MapLegend from "@/components/MapLegend";
import ChatBubble from "@/components/ChatBubble";

const Map = dynamic(() => import("@/components/Map"), { ssr: false });

function getDistanceKm(
  lat1: number,
  lng1: number,
  lat2: number,
  lng2: number
): number {
  const R = 6371;
  const dLat = ((lat2 - lat1) * Math.PI) / 180;
  const dLng = ((lng2 - lng1) * Math.PI) / 180;
  const a =
    Math.sin(dLat / 2) ** 2 +
    Math.cos((lat1 * Math.PI) / 180) *
      Math.cos((lat2 * Math.PI) / 180) *
      Math.sin(dLng / 2) ** 2;
  return R * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
}

function formatDistance(km: number): string {
  const miles = km * 0.621371;
  if (miles < 0.1) return `${Math.round(miles * 5280)} ft`;
  return `${miles.toFixed(1)} mi`;
}

export default function HomePage() {
  const [selectedCategory, setSelectedCategory] = useState<Category | "all">(
    "all"
  );
  const [search, setSearch] = useState("");
  const [selectedPlace, setSelectedPlace] = useState<Place | null>(null);
  const [panelOpen, setPanelOpen] = useState(false);
  const [searchLoading, setSearchLoading] = useState(false);
  const [hydraResults, setHydraResults] = useState<Place[] | null>(null);
  const [mobileSheet, setMobileSheet] = useState<"peek" | "half" | "full">(
    "peek"
  );
  const [userLocation, setUserLocation] = useState<{
    lat: number;
    lng: number;
  } | null>(null);
  const [locatingUser, setLocatingUser] = useState(false);

  const approvedPlaces = SAMPLE_PLACES.filter((p) => p.status === "approved");

  const filteredPlaces = useMemo(() => {
    const source = hydraResults || approvedPlaces;
    const filtered = source.filter((place) => {
      const matchesCategory =
        selectedCategory === "all" || place.category === selectedCategory;
      if (hydraResults) return matchesCategory;
      const matchesSearch =
        search === "" ||
        place.name.toLowerCase().includes(search.toLowerCase()) ||
        place.neighborhood.toLowerCase().includes(search.toLowerCase()) ||
        place.tags.some((t) =>
          t.toLowerCase().includes(search.toLowerCase())
        );
      return matchesCategory && matchesSearch;
    });
    if (userLocation) {
      filtered.sort(
        (a, b) =>
          getDistanceKm(userLocation.lat, userLocation.lng, a.lat, a.lng) -
          getDistanceKm(userLocation.lat, userLocation.lng, b.lat, b.lng)
      );
    }
    return filtered;
  }, [approvedPlaces, hydraResults, selectedCategory, search, userLocation]);

  const distanceMap = useMemo(() => {
    if (!userLocation) return null;
    const map = new window.Map<string, string>();
    filteredPlaces.forEach((p) => {
      const km = getDistanceKm(userLocation.lat, userLocation.lng, p.lat, p.lng);
      map.set(p.id, formatDistance(km));
    });
    return map;
  }, [filteredPlaces, userLocation]);

  const handleSearch = useCallback(async (query: string) => {
    setSearch(query);
    if (query.trim().length < 3) {
      setHydraResults(null);
      return;
    }
    setSearchLoading(true);
    try {
      const res = await fetch(
        `/api/search?q=${encodeURIComponent(query.trim())}`
      );
      const data = await res.json();
      if (data.results && data.results.length > 0) {
        const places: Place[] = data.results.map(
          (
            r: { venue: Record<string, unknown>; score: number },
            i: number
          ) => ({
            id: `hydra_${i}`,
            name: r.venue.name,
            category: r.venue.category || "other",
            subcategory: r.venue.subcategory || undefined,
            address: r.venue.address || "",
            neighborhood: r.venue.neighborhood || "",
            description: r.venue.description || "",
            price_tier: r.venue.price_tier || 1,
            avg_price: r.venue.avg_price || undefined,
            tags: (r.venue.tags as string[]) || [],
            lat: (r.venue.lat as number) || 37.7749,
            lng: (r.venue.lng as number) || -122.4194,
            status: "approved" as const,
            vote_count: 0,
            votes_needed: 5,
            submitted_by: "hydra",
            created_at: new Date().toISOString(),
            updated_at: new Date().toISOString(),
          })
        );
        setHydraResults(places);
      } else {
        setHydraResults(null);
      }
    } catch {
      setHydraResults(null);
    } finally {
      setSearchLoading(false);
    }
  }, []);

  const handlePlaceClick = useCallback((place: Place) => {
    setSelectedPlace(place);
    setMobileSheet("half");
  }, []);

  const handleNearMe = useCallback(() => {
    if (userLocation) {
      setUserLocation(null);
      return;
    }
    setLocatingUser(true);
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        setUserLocation({ lat: pos.coords.latitude, lng: pos.coords.longitude });
        setLocatingUser(false);
      },
      () => {
        setLocatingUser(false);
      },
      { enableHighAccuracy: true, timeout: 10000 }
    );
  }, [userLocation]);

  return (
    <div className="map-page h-full relative overflow-hidden">
      {/* Top nav bar */}
      <Header />

      {/* Map - full screen below header, isolate keeps Leaflet z-indices contained */}
      <div className="absolute inset-0 top-[52px] isolate">
        <Map
          places={filteredPlaces}
          onPlaceClick={handlePlaceClick}
          selectedPlace={selectedPlace}
          userLocation={userLocation}
          className="absolute inset-0"
        />
      </div>

      {/* === MAP OVERLAYS === */}

      {/* Top-left: spots count + search */}
      <div className="absolute top-[68px] left-4 z-30 flex flex-col gap-2.5">
        <div className="glass rounded-xl shadow-lg shadow-black/[0.04] border border-border/60 px-3.5 py-2">
          <span className="text-[12px] font-semibold text-foreground tracking-wide">
            {filteredPlaces.length} spots
          </span>
        </div>

        {/* Search */}
        <div className="relative">
          <svg
            className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
            />
          </svg>
          <input
            type="text"
            value={search}
            onChange={(e) => handleSearch(e.target.value)}
            onFocus={() => {
              setPanelOpen(true);
              setMobileSheet("full");
            }}
            placeholder="Search spots..."
            className="w-[240px] sm:w-[300px] pl-9 pr-9 py-2.5 glass border border-border/60 rounded-xl text-[12px] font-medium placeholder:text-muted/40 shadow-lg shadow-black/[0.04] transition-all"
          />
          {searchLoading && (
            <div className="absolute right-3 top-1/2 -translate-y-1/2">
              <div className="w-3.5 h-3.5 border-2 border-accent border-t-transparent rounded-full animate-spin" />
            </div>
          )}
          {!searchLoading && search.length > 0 && (
            <button
              onClick={() => {
                setSearch("");
                setHydraResults(null);
              }}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-muted hover:text-foreground transition-colors"
            >
              <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          )}
        </div>

        {/* Near Me + Category filter pills */}
        <div className="flex items-center gap-2">
          <button
            onClick={handleNearMe}
            disabled={locatingUser}
            className={`shrink-0 flex items-center gap-1.5 px-3 py-2 rounded-xl text-[12px] font-semibold shadow-lg shadow-black/[0.04] border transition-all press ${
              userLocation
                ? "bg-[#4285f4] text-white border-[#4285f4]"
                : "glass border-border/60 text-foreground"
            }`}
          >
            {locatingUser ? (
              <div className="w-3.5 h-3.5 border-2 border-current border-t-transparent rounded-full animate-spin" />
            ) : (
              <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 2a10 10 0 110 20 10 10 0 010-20z" />
                <circle cx="12" cy="12" r="3" fill="currentColor" stroke="none" />
                <path strokeLinecap="round" d="M12 2v3M12 19v3M2 12h3M19 12h3" />
              </svg>
            )}
            {userLocation ? "Near Me" : "Near Me"}
          </button>
        </div>
        <div className="max-w-[340px]">
          <CategoryFilter
            selected={selectedCategory}
            onChange={setSelectedCategory}
          />
        </div>
      </div>

      {/* Top-right: category legend */}
      <div className="hidden sm:block absolute top-[68px] right-4 z-30">
        <MapLegend />
      </div>

      {/* Bottom-left: chat bubble */}
      <ChatBubble onPlaceClick={handlePlaceClick} />

      {/* Bottom-right: list toggle */}
      <button
        onClick={() => {
          setPanelOpen(!panelOpen);
          setMobileSheet(panelOpen ? "peek" : "half");
        }}
        className="absolute bottom-6 right-4 z-30 glass px-5 py-3 rounded-2xl shadow-lg shadow-black/[0.06] border border-border/60 hover:shadow-xl transition-all flex items-center gap-2.5 text-[13px] font-semibold text-foreground press"
      >
        <svg
          className="w-4 h-4"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d={
              panelOpen
                ? "M6 18L18 6M6 6l12 12"
                : "M4 6h16M4 10h16M4 14h16M4 18h16"
            }
          />
        </svg>
        {panelOpen ? "Close" : "Spots"}
      </button>

      {/* === SELECTED PLACE POPUP (floating card) === */}
      {selectedPlace && !panelOpen && (
        <div className="absolute bottom-20 left-4 right-4 sm:left-4 sm:right-auto sm:w-[360px] z-30 animate-in">
          <PlaceDetail
            place={selectedPlace}
            onClose={() => setSelectedPlace(null)}
          />
        </div>
      )}

      {/* === DESKTOP SIDEBAR (slides in from right) === */}
      <div
        className={`hidden sm:block absolute top-[52px] right-0 bottom-0 z-30 w-[400px] glass border-l border-border/60 transition-transform duration-300 ease-[cubic-bezier(0.22,1,0.36,1)] ${
          panelOpen ? "translate-x-0" : "translate-x-full"
        }`}
      >
        <div className="h-full flex flex-col">
          <div className="px-5 py-4 border-b border-border/60 flex items-center justify-between">
            <h2
              className="text-[15px] text-foreground"
              style={{ fontFamily: "var(--font-dm-serif)" }}
            >
              {filteredPlaces.length} Spots
            </h2>
            <button
              onClick={() => setPanelOpen(false)}
              className="text-muted hover:text-foreground p-1.5 rounded-lg hover:bg-warm transition-colors"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>

          {/* Selected detail */}
          {selectedPlace && (
            <div className="px-5 pt-4">
              <PlaceDetail
                place={selectedPlace}
                onClose={() => setSelectedPlace(null)}
              />
            </div>
          )}

          <div className="flex-1 px-5 pb-5 sidebar-scroll">
            <div className="space-y-2.5 pt-2">
              {filteredPlaces.map((place) => (
                <PlaceCard
                  key={place.id}
                  place={place}
                  isSelected={selectedPlace?.id === place.id}
                  onClick={() => handlePlaceClick(place)}
                  distance={distanceMap?.get(place.id)}
                  compact
                />
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* === MOBILE BOTTOM SHEET === */}
      <div
        className={`sm:hidden absolute left-0 right-0 bottom-0 z-30 bg-surface-warm rounded-t-3xl shadow-[0_-8px_30px_rgba(0,0,0,0.08)] transition-all duration-300 ease-[cubic-bezier(0.22,1,0.36,1)] ${
          mobileSheet === "full"
            ? "top-[52px]"
            : mobileSheet === "half"
              ? "top-[50%]"
              : "top-[calc(100%-72px)]"
        }`}
      >
        <button
          className="w-full flex justify-center pt-3 pb-2"
          onClick={() =>
            setMobileSheet((s) =>
              s === "peek" ? "half" : s === "half" ? "full" : "peek"
            )
          }
        >
          <div className="w-10 h-1 bg-warm-dark/60 rounded-full" />
        </button>

        <div className="flex flex-col h-full">
          {mobileSheet === "peek" && (
            <div className="px-5 pb-4 text-center">
              <span
                className="text-[13px] font-medium text-foreground"
                style={{ fontFamily: "var(--font-dm-serif)" }}
              >
                {filteredPlaces.length} spots found
              </span>
              <p className="text-[11px] text-muted mt-0.5">Swipe up to explore</p>
            </div>
          )}

          {mobileSheet !== "peek" && selectedPlace && (
            <div className="px-5">
              <PlaceDetail
                place={selectedPlace}
                onClose={() => setSelectedPlace(null)}
              />
            </div>
          )}

          {mobileSheet !== "peek" && (
            <div className="flex-1 px-5 pb-24 sidebar-scroll overflow-y-auto">
              <div className="space-y-2.5">
                {filteredPlaces.map((place) => (
                  <PlaceCard
                    key={place.id}
                    place={place}
                    isSelected={selectedPlace?.id === place.id}
                    onClick={() => handlePlaceClick(place)}
                    distance={distanceMap?.get(place.id)}
                    compact
                  />
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
