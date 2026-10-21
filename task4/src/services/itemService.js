import {
  getItemsList,
  getItem,
  createItem,
  updateItem,
  deleteItem,
} from "../api/fakeApi.js";

export async function loadItems() {
  const response = await getItemsList();

  return response.data;
}

export async function loadItemDetails(id) {
  return await getItem(id);
}

export async function addItem(data) {
  const createdItem = await createItem({
    name: data.name,
    description: data.description,
  });

  const completeItem = await updateItem(createdItem.id, {
    category: data.category,
    price: Number(data.price),
    stock: Number(data.stock),
    status: data.status,
    manufacturer: data.manufacturer,
    rating: Number(data.rating),
  });

  return completeItem;
}

export async function editItem(id, changes) {
  return await updateItem(id, {
    ...changes,
    price: Number(changes.price),
    stock: Number(changes.stock),
    rating: Number(changes.rating),
  });
}

export async function removeItem(id) {
  return await deleteItem(id);
}

export async function changeItemStatus(id, status) {
  return await updateItem(id, {
    status,
  });
}