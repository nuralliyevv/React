import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link, useNavigate, useParams } from "react-router-dom";
import Loading from "../components/Loading.jsx";
import { fetchItemDetails } from "../store/itemDetailsSlice.js";
import { updateInventoryStatus } from "../store/inventorySlice.js";

export default function ItemDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const detail = useSelector((state) => state.itemDetails);
  const item = detail.currentId === String(id) ? detail.item : null;
  const loading = detail.currentId !== String(id) || detail.status === "pending";
  const error = detail.currentId === String(id) ? detail.error || "" : "";
  const [updating, setUpdating] = useState(false);
  const [mutationError, setMutationError] = useState("");

  useEffect(() => {
    if (!/^\d+$/.test(id)) {
      return;
    }
    dispatch(fetchItemDetails(id));
  }, [dispatch, id]);

  if (!/^\d+$/.test(id)) {
    return <section className="page-wrap"><div className="state-card"><h1>Item unavailable</h1><p>This item ID is not valid.</p><Link className="button button-primary" to="/items">← All items</Link></div></section>;
  }

  if (loading) {
    return (
      <section className="page-wrap">
        <Loading label="Loading item details…" />
      </section>
    );
  }

  if (error || !item) {
    return (
      <section className="page-wrap">
        <div className="state-card">
          <span className="eyebrow">ITEM / {id}</span>
          <h1>{error.includes("not found") ? "Item not found" : "Item unavailable"}</h1>
          <p>{error}</p>
          <Link className="button button-primary" to="/items">
            ← All items
          </Link>
        </div>
      </section>
    );
  }

  const fields = [
    ["Category", item.category],
    ["Availability", item.status],
    ["Manufacturer", item.manufacturer],
    ["Unit price", `${Number(item.price || 0).toLocaleString()} ₸`],
    ["In stock", `${item.stock ?? 0} units`],
    ["Customer rating", `★ ${Number(item.rating || 0).toFixed(1)} / 5`],
    ["Item ID", `#${item.id}`],
  ];

  async function toggleStatus() {
    setUpdating(true);
    setMutationError("");

    try {
      const status = item.status === "Available" ? "Unavailable" : "Available";
      const updated = await dispatch(updateInventoryStatus({ id: item.id, status })).unwrap();
      dispatch(fetchItemDetails(item.id));
      return updated;
    } catch (err) {
      setMutationError(err.message || "Unable to update availability.");
    } finally {
      setUpdating(false);
    }
  }

  return (
    <section className="page-wrap detail-page">
      <div className="breadcrumbs">
        <button onClick={() => navigate(-1)}>← Back</button>
        <span>/</span>
        <Link to="/items">All items</Link>
        <span>/</span>
        <span>{item.name}</span>
      </div>

      <div className="detail-layout">
        <div className="detail-art">
          <span>{item.category?.slice(0, 1) || "I"}</span>
          <small>ITEMFLOW / OBJECT {String(item.id).padStart(2, "0")}</small>
        </div>

        <div className="detail-copy">
          <span className="eyebrow">PRODUCT DETAILS</span>
          <span
            className={`status ${item.status === "Available" ? "available" : "unavailable"}`}
          >
            {item.status}
          </span>
          <h1>{item.name}</h1>
          <p className="lead">{item.description}</p>

          <div className="detail-facts">
            {fields.map(([label, value]) => (
              <div key={label}>
                <span>{label}</span>
                <strong>{value || "—"}</strong>
              </div>
            ))}
          </div>

          {mutationError && <p className="inline-message" role="alert">{mutationError}</p>}

          <button
            className="button button-quiet detail-toggle"
            onClick={toggleStatus}
            disabled={updating}
          >
            {updating
              ? "Updating…"
              : `Set ${item.status === "Available" ? "Unavailable" : "Available"}`}
          </button>
          <Link className="button button-primary" to="/items">
            Browse all items →
          </Link>
        </div>
      </div>
    </section>
  );
}
