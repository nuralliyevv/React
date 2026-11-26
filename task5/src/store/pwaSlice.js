import { createSlice } from "@reduxjs/toolkit";
const pwaSlice = createSlice({ name: "pwa", initialState: { online: navigator.onLine, updateAvailable: false }, reducers: {
  setOnline(state, action) { state.online = action.payload; },
  setUpdateAvailable(state, action) { state.updateAvailable = action.payload; },
} });
export const { setOnline, setUpdateAvailable } = pwaSlice.actions;
export default pwaSlice.reducer;
