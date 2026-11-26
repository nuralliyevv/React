import { useCallback, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchItems } from "../store/inventorySlice.js";
import { selectInventoryError, selectInventoryStatus, selectItems } from "../store/selectors.js";

export default function useItems() {
  const dispatch = useDispatch();
  const items = useSelector(selectItems);
  const status = useSelector(selectInventoryStatus);
  const error = useSelector(selectInventoryError);
  const loadedAt = useSelector((state) => state.inventory.loadedAt);

  useEffect(() => {
    if (status === "idle" || (status === "fulfilled" && loadedAt && Date.now() - loadedAt >= 30_000)) dispatch(fetchItems());
  }, [dispatch, status, loadedAt]);

  const retry = useCallback(() => dispatch(fetchItems({ force: true })), [dispatch]);

  return {
    items,
    loading: status === "idle" || status === "pending",
    error: status === "rejected" ? error : "",
    retry,
  };
}
