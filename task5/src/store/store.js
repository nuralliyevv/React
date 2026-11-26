import { configureStore } from "@reduxjs/toolkit";
import inventory from "./inventorySlice.js";
import itemDetails from "./itemDetailsSlice.js";
import pwa from "./pwaSlice.js";

export const store = configureStore({ reducer: { inventory, itemDetails, pwa } });
