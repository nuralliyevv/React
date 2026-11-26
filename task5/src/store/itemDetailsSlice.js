import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { loadItemDetails } from "../services/itemService.js";

export const fetchItemDetails = createAsyncThunk("itemDetails/fetch", async (id) => loadItemDetails(id));
const itemDetailsSlice = createSlice({
  name: "itemDetails", initialState: { item: null, status: "idle", error: null, currentId: null }, reducers: {},
  extraReducers(builder) {
    builder.addCase(fetchItemDetails.pending, (state, action) => { state.status = "pending"; state.error = null; state.currentId = String(action.meta.arg); state.requestId = action.meta.requestId; })
      .addCase(fetchItemDetails.fulfilled, (state, action) => { if (state.requestId !== action.meta.requestId) return; state.status = "fulfilled"; state.item = action.payload; })
      .addCase(fetchItemDetails.rejected, (state, action) => { if (state.requestId !== action.meta.requestId) return; state.status = "rejected"; state.error = action.error.message || "Unable to load this item."; });
  },
});
export default itemDetailsSlice.reducer;
