import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import {
  addItem as addItemService,
  changeItemStatus,
  editItem as editItemService,
  loadItems,
  removeItem as removeItemService,
} from "../services/itemService.js";

export const fetchItems = createAsyncThunk("inventory/fetchItems", async ({ force = false } = {}) => loadItems({ force }));
export const createInventoryItem = createAsyncThunk("inventory/createItem", async (data, { dispatch }) => {
  const item = await addItemService(data);
  await dispatch(fetchItems({ force: true }));
  return item;
});
export const updateInventoryItem = createAsyncThunk("inventory/updateItem", async ({ id, changes }, { dispatch }) => {
  const item = await editItemService(id, changes);
  await dispatch(fetchItems({ force: true }));
  return item;
});
export const deleteInventoryItem = createAsyncThunk("inventory/deleteItem", async (id, { dispatch }) => {
  await removeItemService(id);
  await dispatch(fetchItems({ force: true }));
  return id;
});
export const updateInventoryStatus = createAsyncThunk("inventory/updateStatus", async ({ id, status }, { dispatch }) => {
  const item = await changeItemStatus(id, status);
  await dispatch(fetchItems({ force: true }));
  return item;
});

const initialState = { items: [], status: "idle", error: null, loadedAt: null, mutationStatus: "idle" };
const inventorySlice = createSlice({
  name: "inventory",
  initialState,
  reducers: {},
  extraReducers(builder) {
    builder
      .addCase(fetchItems.pending, (state, action) => {
        state.status = "pending"; state.error = null; state.fetchRequestId = action.meta.requestId;
      })
      .addCase(fetchItems.fulfilled, (state, action) => {
        if (state.fetchRequestId !== action.meta.requestId) return;
        state.status = "fulfilled"; state.items = action.payload; state.loadedAt = Date.now(); state.error = null;
      })
      .addCase(fetchItems.rejected, (state, action) => {
        if (state.fetchRequestId !== action.meta.requestId) return;
        state.status = "rejected"; state.error = action.error.message || "Unable to load inventory.";
      })
      .addCase(createInventoryItem.pending, (state) => { state.mutationStatus = "pending"; })
      .addCase(createInventoryItem.fulfilled, (state, action) => { state.mutationStatus = "fulfilled"; if (!state.items.some((item) => item.id === action.payload.id)) state.items.push(action.payload); state.loadedAt = Date.now(); })
      .addCase(createInventoryItem.rejected, (state) => { state.mutationStatus = "rejected"; })
      .addCase(updateInventoryItem.pending, (state) => { state.mutationStatus = "pending"; })
      .addCase(updateInventoryItem.fulfilled, (state, action) => { state.mutationStatus = "fulfilled"; state.items = state.items.map((item) => item.id === action.payload.id ? action.payload : item); state.loadedAt = Date.now(); })
      .addCase(updateInventoryItem.rejected, (state) => { state.mutationStatus = "rejected"; })
      .addCase(deleteInventoryItem.pending, (state) => { state.mutationStatus = "pending"; })
      .addCase(deleteInventoryItem.fulfilled, (state, action) => { state.mutationStatus = "fulfilled"; state.items = state.items.filter((item) => item.id !== action.payload); state.loadedAt = Date.now(); })
      .addCase(deleteInventoryItem.rejected, (state) => { state.mutationStatus = "rejected"; })
      .addCase(updateInventoryStatus.pending, (state) => { state.mutationStatus = "pending"; })
      .addCase(updateInventoryStatus.fulfilled, (state, action) => { state.mutationStatus = "fulfilled"; state.items = state.items.map((item) => item.id === action.payload.id ? action.payload : item); state.loadedAt = Date.now(); });
    builder.addCase(updateInventoryStatus.rejected, (state) => { state.mutationStatus = "rejected"; });
  },
});
export default inventorySlice.reducer;
