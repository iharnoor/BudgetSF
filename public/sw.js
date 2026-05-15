// BudgetSF service worker.
// Caches the app shell only. Tile providers and analytics always hit the network
// to keep map data fresh and avoid blowing up user storage with cached imagery.
//
// Bump CACHE_VERSION when shipping changes to any URL in APP_SHELL so users get
// the new shell on next visit. Old caches are deleted in activate.

const CACHE_VERSION = "v1-2026-05-13";
const CACHE_NAME = `budgetsf-shell-${CACHE_VERSION}`;

// Same-origin paths that make up the offline-capable shell.
// Next.js JS chunks are content-hashed so they're handled by the fetch handler's
// stale-while-revalidate path, not pre-cached here.
const APP_SHELL = ["/", "/manifest.json", "/icon.svg", "/icon-maskable.svg"];

// Network-only hostnames: tile providers, analytics, dynamic OG. Never cache.
const NETWORK_ONLY_HOSTS = [
  "tiles.stadiamaps.com",
  "tile.openstreetmap.fr",
  "tile.openstreetmap.org",
  "vitals.vercel-insights.com",
  "vercel.live",
];

// Network-only path prefixes (same-origin). Keep API + OG dynamic.
const NETWORK_ONLY_PATHS = ["/api/", "/_next/image"];

function isNetworkOnly(url) {
  if (NETWORK_ONLY_HOSTS.some((h) => url.hostname.endsWith(h))) return true;
  if (NETWORK_ONLY_PATHS.some((p) => url.pathname.startsWith(p))) return true;
  return false;
}

self.addEventListener("install", (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => cache.addAll(APP_SHELL))
  );
  // Take over from any older SW on next load
  self.skipWaiting();
});

self.addEventListener("activate", (event) => {
  event.waitUntil(
    (async () => {
      const keys = await caches.keys();
      await Promise.all(
        keys
          .filter((k) => k.startsWith("budgetsf-shell-") && k !== CACHE_NAME)
          .map((k) => caches.delete(k))
      );
      await self.clients.claim();
    })()
  );
});

self.addEventListener("fetch", (event) => {
  const req = event.request;

  // Only handle GET. Let POST/PUT/etc fall through to the network untouched.
  if (req.method !== "GET") return;

  const url = new URL(req.url);

  // Hard exclusion: tile providers, APIs, analytics.
  if (isNetworkOnly(url)) return;

  // For navigations (HTML), use network-first with a cache fallback so users
  // see fresh content when online and a usable shell when offline.
  if (req.mode === "navigate") {
    event.respondWith(
      (async () => {
        try {
          const fresh = await fetch(req);
          const cache = await caches.open(CACHE_NAME);
          cache.put("/", fresh.clone()).catch(() => {});
          return fresh;
        } catch {
          const cache = await caches.open(CACHE_NAME);
          const cached = await cache.match("/");
          return cached || Response.error();
        }
      })()
    );
    return;
  }

  // For same-origin static assets, stale-while-revalidate.
  if (url.origin === self.location.origin) {
    event.respondWith(
      (async () => {
        const cache = await caches.open(CACHE_NAME);
        const cached = await cache.match(req);
        const fetchPromise = fetch(req)
          .then((res) => {
            if (res.ok) cache.put(req, res.clone()).catch(() => {});
            return res;
          })
          .catch(() => cached);
        return cached || fetchPromise;
      })()
    );
    return;
  }

  // Cross-origin (Leaflet CSS on unpkg, fonts on Google): network with cache fallback.
  event.respondWith(
    fetch(req).catch(() => caches.match(req).then((r) => r || Response.error()))
  );
});
