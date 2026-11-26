# ItemFlow

React Router inventory app with Firebase Authentication and a cached inventory service.

## Firebase setup

1. Create a Firebase project and register a Web app.
2. In **Authentication → Sign-in method**, enable **Email/Password** and **Google**. Add your local and deployed hostnames under **Authorized domains**.
3. Copy `.env.example` to `.env.local` and fill in the Web app config values. Vite exposes only variables prefixed with `VITE_`; never put private server credentials in these variables.
4. Restart the Vite dev server after changing environment variables.

Firebase initialization is in `src/firebase.js`. Auth state is observed through `onAuthStateChanged`, persisted in browser local persistence, and exposed through `useAuth`. `/profile` is protected and redirects signed-out visitors to `/login`.

## Server data caching

`src/services/itemService.js` caches the inventory list under the `items:list` key for 30 seconds. Concurrent requests share one in-flight request. A request started before an invalidation cannot repopulate the cache afterward. Successful create, edit, status-change, and delete operations invalidate the list cache; the next read fetches fresh data. The Inventory and Dashboard views use the shared `useItems` hook and can force a refresh after a load error.

The current homework API is simulated in `src/api/fakeApi.js` and persists its sample inventory in browser local storage. Replace that adapter with a real API while keeping the service and cache interface when connecting a backend.

## Redux Toolkit state management

The app uses Redux Toolkit for shared catalogue and PWA state. `src/store/store.js` configures the store and `src/main.jsx` exposes it through React Redux's `Provider`.

- `inventorySlice.js` owns the shared inventory list and its request/mutation states. Its `createAsyncThunk` operations fetch the list and create, edit, delete, or change item availability. Each operation uses `pending`/`fulfilled`/`rejected` reducers. Successful writes invalidate the service cache and refetch the list.
- `itemDetailsSlice.js` owns the current details request. A request ID check ignores stale responses when navigation changes to another item before an earlier request completes.
- `pwaSlice.js` owns online/offline status and whether a service-worker update is waiting. `RootLayout` dispatches browser connectivity and PWA update events into this slice.
- `selectors.js` exports reusable state selectors and two memoized `createSelector` selectors: `selectFilteredItems` for search/category/status/sort and `selectDashboardStats` for dashboard calculations.

`useItems` is the UI-facing hook for the inventory thunk and status selectors. URL query parameters remain the source of truth for inventory search, filters, sorting, and pagination; search is written to the URL after a 250 ms debounce. Form visibility, form values, and transient success/error messages remain local UI state. Authentication remains in `AuthContext`, because it is managed by Firebase's auth-state listener.

## Progressive Web App

The manifest is `public/manifest.json`; the 192×192 and 512×512 PNG icons are in `public/icons/`. The production build generates `dist/sw.js` from `public/sw.js` after Vite has hashed the JavaScript and CSS bundles, then precaches the complete app shell and the standalone offline page. The service worker uses cache-first for bundled static assets and fonts, and network-first for explicitly public, credential-free same-origin `/api/items`, `/api/products`, and their detail routes. API entries expire after seven days and the cache is capped at 50 entries; static runtime entries are capped at 100. Old versioned shell caches are deleted on activation. Firebase/auth endpoints are excluded.

The current fake API does not make HTTP requests; it reads the local inventory store, so the catalogue remains available offline from that store. The online/offline indicator reports when the app is offline, and the service worker provides the cached app shell or standalone offline page when navigation cannot reach the network. A waiting worker is activated only after the user selects **Update now**.

The main navigation collapses into a touch-friendly menu on narrow screens. Local development does not register the production service worker; check installation and offline behavior with a production build (`npm run build`) served over localhost or HTTPS.

For GitHub Pages deployment, add the six `VITE_FIREBASE_*` values as repository Actions variables. The repository workflow passes those variables into the task5 build step; changing them requires a new deployment run.

## Run locally

```sh
npm install
cp .env.example .env.local
# Fill in the Firebase values, then:
npm run dev
```

Build with `npm run build`. Deploy the generated `dist` directory to a static host configured to serve the SPA fallback. Add the deployed hostname to Firebase Authentication's authorized domains.
