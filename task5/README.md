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

## Run locally

```sh
npm install
cp .env.example .env.local
# Fill in the Firebase values, then:
npm run dev
```

Build with `npm run build`. Deploy the generated `dist` directory to a static host configured to serve the SPA fallback. Add the deployed hostname to Firebase Authentication's authorized domains.
