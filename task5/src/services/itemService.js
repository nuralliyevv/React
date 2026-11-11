import {
  getItemsList,
  getItem,
  createItem,
  updateItem,
  deleteItem,
} from "../api/fakeApi.js";
import { cachedRequest, invalidateCache, ITEM_LIST_KEY } from "./cache.js";

export async function loadItems({ force = false } = {}) {
  return cachedRequest(ITEM_LIST_KEY, async () => {
  const response = await getItemsList("limit=100&page=1");

  return response.data;
  }, { staleTime: 30_000, force });
}

export async function loadItemDetails(id) {
  return await getItem(id);
}

export async function addItem(data) {
  const createdItem = await createItem({
    name: data.name,
    description: data.description,
  });
  invalidateCache(ITEM_LIST_KEY);

  const completeItem = await updateItem(createdItem.id, {
    category: data.category,
    price: Number(data.price),
    stock: Number(data.stock),
    status: data.status,
    manufacturer: data.manufacturer,
    rating: Number(data.rating),
  });

  invalidateCache(ITEM_LIST_KEY);
  return completeItem;
}

export async function editItem(id, changes) {
  const item = await updateItem(id, {
    ...changes,
    price: Number(changes.price),
    stock: Number(changes.stock),
    rating: Number(changes.rating),
  });
  invalidateCache(ITEM_LIST_KEY);
  return item;
}

export async function removeItem(id) {
  const result = await deleteItem(id);
  invalidateCache(ITEM_LIST_KEY);
  return result;
}

export async function changeItemStatus(id, status) {
  const item = await updateItem(id, {
    status,
  });
  invalidateCache(ITEM_LIST_KEY);
  return item;
}
