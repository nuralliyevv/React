const cache = new Map();
const pending = new Map();
const generations = new Map();
const requestVersions = new Map();

export const ITEM_LIST_KEY = "items:list";

export function invalidateCache(key) {
  generations.set(key, (generations.get(key) || 0) + 1);
  cache.delete(key);
  pending.delete(key);
}

export async function cachedRequest(key, request, { staleTime = 30_000, force = false } = {}) {
  const current = cache.get(key);
  if (!force && current && Date.now() - current.savedAt < staleTime) {
    return current.value;
  }
  if (!force && pending.has(key)) return pending.get(key);

  const generation = generations.get(key) || 0;
  const requestVersion = (requestVersions.get(key) || 0) + 1;
  requestVersions.set(key, requestVersion);
  const promise = request().then((value) => {
    if ((generations.get(key) || 0) === generation && requestVersions.get(key) === requestVersion) {
      cache.set(key, { value, savedAt: Date.now() });
    }
    return value;
  }).finally(() => {
    if (pending.get(key) === promise) pending.delete(key);
  });
  pending.set(key, promise);
  return promise;
}
