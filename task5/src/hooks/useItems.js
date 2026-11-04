import { useEffect, useState } from "react";
import { loadItems } from "../services/itemService.js";
export default function useItems() {
  const [items, setItems] = useState([]); const [loading, setLoading] = useState(true); const [error, setError] = useState(""); const [reload, setReload] = useState(0);
  useEffect(() => { let active = true; setLoading(true); setError(""); loadItems().then(data => { if (active) setItems(data); }).catch(err => { if (active) setError(err.message || "Unable to load inventory."); }).finally(() => { if (active) setLoading(false); }); return () => { active = false; }; }, [reload]);
  return { items, loading, error, retry: () => setReload(x => x + 1) };
}
