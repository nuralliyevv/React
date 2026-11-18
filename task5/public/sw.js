const CACHE_VERSION = "__CACHE_VERSION__";
const PRECACHE_URLS = __PRECACHE_URLS__;
const SHELL_CACHE = `itemflow-shell-${CACHE_VERSION}`;
const API_CACHE = "itemflow-api-v1";
const SCOPE_URL = new URL(self.registration.scope);
const SCOPE_PATH = SCOPE_URL.pathname;
const OFFLINE_URL = new URL("offline.html", SCOPE_URL).href;
const APP_URL = SCOPE_URL.href;
const MAX_RUNTIME_ENTRIES = 50;
const MAX_STATIC_ENTRIES = 100;
const API_MAX_AGE = 7 * 24 * 60 * 60 * 1000;

self.addEventListener("install", (event) => {
  event.waitUntil((async () => {
    const shell = await caches.open(SHELL_CACHE);
    await shell.addAll(PRECACHE_URLS);
    if (!self.registration.active) await self.skipWaiting();
  })());
});

self.addEventListener("activate", (event) => {
  event.waitUntil((async () => {
    const names = await caches.keys();
    await Promise.all(names
      .filter((name) => name.startsWith("itemflow-") && name !== SHELL_CACHE && name !== API_CACHE)
      .map((name) => caches.delete(name)));
    await self.clients.claim();
  })());
});

self.addEventListener("message", (event) => {
  if (event.data?.type === "ACTIVATE_UPDATE") self.skipWaiting();
});

self.addEventListener("fetch", (event) => {
  const request = event.request;
  if (request.method !== "GET" || request.headers.has("authorization")) return;

  const url = new URL(request.url);
  const isFontHost = url.hostname === "fonts.googleapis.com" || url.hostname === "fonts.gstatic.com";
  const isFirebaseHost = /firebase|identitytoolkit|securetoken|googleapis\.com/i.test(url.hostname)
    && !isFontHost;
  const isAuthPath = /\/accounts:|\/token(?:\?|$)|\/oauth/i.test(url.pathname);
  if (isFirebaseHost || isAuthPath) return;

  if (request.mode === "navigate" && url.origin === self.location.origin && url.pathname.startsWith(SCOPE_PATH)) {
    event.respondWith(navigateRequest(request, url));
    return;
  }

  const isStatic = ["style", "script", "image", "font"].includes(request.destination);
  const isBundledAsset = url.origin === self.location.origin
    && (url.pathname.startsWith(`${SCOPE_PATH}assets/`)
      || url.pathname.startsWith(`${SCOPE_PATH}icons/`)
      || url.pathname === `${SCOPE_PATH}favicon.svg`);
  if (isStatic && (isBundledAsset || isFontHost)) {
    event.respondWith(cacheFirst(request));
    return;
  }

  const publicItemsApi = url.origin === self.location.origin && request.credentials === "omit"
    && new RegExp(`^${escapeRegExp(SCOPE_PATH)}api/(?:public/)?(?:items|products)(?:/|$)`).test(url.pathname);
  if (publicItemsApi) event.respondWith(networkFirstApi(request));
});

async function navigateRequest(request, url) {
  const isOfflinePage = url.pathname === `${SCOPE_PATH}offline` || url.pathname === `${SCOPE_PATH}offline/`;
  if (isOfflinePage && !self.navigator.onLine) {
    const offlinePage = await caches.match(OFFLINE_URL);
    if (offlinePage) return offlinePage;
  }
  try {
    return await fetch(request);
  } catch {
    if (isOfflinePage) {
      const offlinePage = await caches.match(OFFLINE_URL);
      if (offlinePage) return offlinePage;
    }
    const shell = await caches.open(SHELL_CACHE);
    const appShell = (await shell.match(APP_URL))
      || (await shell.match(new URL("index.html", SCOPE_URL).href));
    if (isKnownAppRoute(url.pathname)) {
      return appShell || (await caches.match(OFFLINE_URL));
    }
    return (await caches.match(OFFLINE_URL)) || appShell;
  }
}

function isKnownAppRoute(pathname) {
  const route = pathname.slice(SCOPE_PATH.length).replace(/^\/+|\/+$/g, "");
  return route === ""
    || route === "about"
    || route === "dashboard"
    || route === "login"
    || route === "signup"
    || route === "profile"
    || route === "offline"
    || /^items(?:\/[^/]+)?$/.test(route);
}

async function cacheFirst(request) {
  const cached = await caches.match(request);
  if (cached) return cached;
  try {
    const response = await fetch(request);
    if (response.ok || response.type === "opaque") {
      try {
        await putBounded(SHELL_CACHE, request, response.clone(), MAX_STATIC_ENTRIES);
      } catch {
        // Keep the successful network response even when the browser rejects caching it.
      }
    }
    return response;
  } catch {
    return new Response("Offline asset unavailable", { status: 503, statusText: "Offline" });
  }
}

async function networkFirstApi(request) {
  try {
    const response = await fetch(request);
    if (response.ok && response.type !== "opaque") {
      const headers = new Headers(response.headers);
      headers.set("X-ItemFlow-Cached-At", String(Date.now()));
      const body = await response.clone().arrayBuffer();
      await putBounded(
        API_CACHE,
        request,
        new Response(body, { status: response.status, statusText: response.statusText, headers }),
        MAX_RUNTIME_ENTRIES,
      );
    }
    return response;
  } catch {
    const cache = await caches.open(API_CACHE);
    const cached = await cache.match(request);
    if (!cached) {
      return new Response(JSON.stringify({ error: "Offline and no saved public data is available." }), {
        status: 503,
        headers: { "Content-Type": "application/json" },
      });
    }
    const cachedAt = Number(cached.headers.get("X-ItemFlow-Cached-At") || 0);
    if (!cachedAt || Date.now() - cachedAt > API_MAX_AGE) {
      await cache.delete(request);
      return new Response(JSON.stringify({ error: "Saved public data has expired." }), {
        status: 503,
        headers: { "Content-Type": "application/json" },
      });
    }
    const headers = new Headers(cached.headers);
    headers.set("X-ItemFlow-Cache", "offline");
    return new Response(await cached.arrayBuffer(), {
      status: cached.status,
      statusText: cached.statusText,
      headers,
    });
  }
}

async function putBounded(cacheName, request, response, limit) {
  const cache = await caches.open(cacheName);
  await cache.put(request, response);
  const keys = await cache.keys();
  for (const oldRequest of keys.slice(0, Math.max(0, keys.length - limit))) {
    await cache.delete(oldRequest);
  }
}

function escapeRegExp(value) {
  return value.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}
