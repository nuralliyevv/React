const UPDATE_EVENT = "itemflow:update-available";

export async function registerPwaServiceWorker() {
  if (!import.meta.env.PROD || !("serviceWorker" in navigator)) return;

  try {
    const base = import.meta.env.BASE_URL;
    const registration = await navigator.serviceWorker.register(`${base}sw.js`, { scope: base });
    const announceUpdate = () => window.dispatchEvent(new Event(UPDATE_EVENT));

    if (registration.waiting) announceUpdate();
    registration.addEventListener("updatefound", () => {
      const installing = registration.installing;
      installing?.addEventListener("statechange", () => {
        if (installing.state === "installed" && navigator.serviceWorker.controller) {
          announceUpdate();
        }
      });
    });

    navigator.serviceWorker.addEventListener("controllerchange", () => {
      window.location.reload();
    }, { once: true });

    await registration.update();
  } catch (error) {
    console.error("Unable to register the ItemFlow service worker:", error);
  }
}

export function subscribeToPwaUpdate(callback) {
  window.addEventListener(UPDATE_EVENT, callback);
  return () => window.removeEventListener(UPDATE_EVENT, callback);
}

export function activateWaitingPwaUpdate() {
  navigator.serviceWorker?.getRegistration(import.meta.env.BASE_URL)
    .then((registration) => registration?.waiting?.postMessage({ type: "ACTIVATE_UPDATE" }))
    .catch((error) => console.error("Unable to activate the update:", error));
}
