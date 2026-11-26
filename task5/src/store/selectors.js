import { createSelector } from "@reduxjs/toolkit";

export const selectItems = (state) => state.inventory.items;
export const selectInventoryStatus = (state) => state.inventory.status;
export const selectInventoryError = (state) => state.inventory.error;
export const selectFilteredItems = createSelector(
  [selectItems, (_state, filters) => filters],
  (items, { search = "", category = "all", status = "all", sort = "name" }) => {
    const query = search.trim().toLowerCase();
    return items.filter((item) => (!query || `${item.name} ${item.description} ${item.manufacturer}`.toLowerCase().includes(query)) && (category === "all" || item.category === category) && (status === "all" || item.status === status))
      .sort((a, b) => sort === "price-low" ? Number(a.price) - Number(b.price) : sort === "rating" ? Number(b.rating) - Number(a.rating) : sort === "name-desc" ? b.name.localeCompare(a.name) : a.name.localeCompare(b.name));
  },
);
export const selectDashboardStats = createSelector(
  [selectItems, (_state, status) => status],
  (items, status) => {
    const scoped = items.filter((item) => status === "all" || item.status === status);
    const availableCount = scoped.filter((item) => item.status === "Available").length;
    return { scoped, availableCount,
      averageRating: scoped.length ? scoped.reduce((sum, item) => sum + Number(item.rating || 0), 0) / scoped.length : 0,
      stockValue: scoped.reduce((sum, item) => sum + Number(item.price || 0) * Number(item.stock || 0), 0),
      lowStockCount: scoped.filter((item) => Number(item.stock) < 10).length,
      categories: Object.entries(scoped.reduce((counts, item) => { const category = item.category || "Other"; counts[category] = (counts[category] || 0) + 1; return counts; }, {})).sort((a, b) => b[1] - a[1]),
      statuses: ["Available", "Unavailable"].map((name) => [name, scoped.filter((item) => item.status === name).length]),
    };
  },
);
