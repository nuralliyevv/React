import { useMemo, useState } from "react";
import { Link, useSearchParams } from "react-router-dom";
import ItemCard from "../components/ItemCard.jsx";
import ItemForm from "../components/ItemForm.jsx";
import Loading from "../components/Loading.jsx";
import useItems from "../hooks/useItems.js";
import { addItem, editItem, removeItem } from "../services/itemService.js";

const PAGE_SIZE = 6;

export default function Items() {
  const { items, loading, error, retry } = useItems();
  const [params, setParams] = useSearchParams();
  const [formItem, setFormItem] = useState(undefined);
  const [saving, setSaving] = useState(false);
  const [actionMessage, setActionMessage] = useState("");

  const search = params.get("search") || "";
  const category = params.get("category") || "all";
  const status = params.get("status") || "all";
  const sort = params.get("sort") || "name";
  const page = Math.max(1, Number(params.get("page")) || 1);

  const categories = [...new Set(items.map((item) => item.category).filter(Boolean))].sort();

  const filtered = useMemo(() => {
    const query = search.trim().toLowerCase();

    return items
      .filter((item) => {
        const matchesSearch =
          !query ||
          `${item.name} ${item.description} ${item.manufacturer}`
            .toLowerCase()
            .includes(query);
        const matchesCategory = category === "all" || item.category === category;
        const matchesStatus = status === "all" || item.status === status;

        return matchesSearch && matchesCategory && matchesStatus;
      })
      .sort((a, b) => {
        if (sort === "price-low") return Number(a.price) - Number(b.price);
        if (sort === "rating") return Number(b.rating) - Number(a.rating);
        if (sort === "name-desc") return b.name.localeCompare(a.name);
        return a.name.localeCompare(b.name);
      });
  }, [items, search, category, status, sort]);

  const pageCount = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
  const currentPage = Math.min(page, pageCount);
  const visible = filtered.slice(
    (currentPage - 1) * PAGE_SIZE,
    currentPage * PAGE_SIZE,
  );

  function update(key, value) {
    const nextParams = new URLSearchParams(params);

    if (!value || value === "all") {
      nextParams.delete(key);
    } else {
      nextParams.set(key, value);
    }

    if (key !== "page") nextParams.delete("page");
    setParams(nextParams);
  }

  async function save(data) {
    setSaving(true);
    setActionMessage("");

    try {
      if (formItem === null) {
        await addItem(data);
      } else if (formItem) {
        await editItem(formItem.id, data);
      }

      setFormItem(undefined);
      setActionMessage(
        formItem === null
          ? "Item created successfully."
          : "Item updated successfully.",
      );
      retry();
    } catch (err) {
      setActionMessage(err.message || "Unable to save item.");
    } finally {
      setSaving(false);
    }
  }

  async function remove(item) {
    if (!window.confirm(`Remove “${item.name}” from inventory?`)) return;

    try {
      await removeItem(item.id);
      setActionMessage("Item removed successfully.");
      retry();
    } catch (err) {
      setActionMessage(err.message || "Unable to remove item.");
    }
  }

  return (
    <section className="page-wrap">
      <div className="page-heading">
        <div>
          <span className="eyebrow">WORKSPACE / INVENTORY</span>
          <h1>
            Find your <em>things.</em>
          </h1>
          <p>Browse and refine the live catalogue.</p>
        </div>
        <div className="heading-actions">
          <span className="count-badge">{filtered.length} items</span>
          <button
            className="button button-primary"
            onClick={() => setFormItem(null)}
          >
            ＋ Add item
          </button>
        </div>
      </div>

      {actionMessage && (
        <div className="inline-message" role="status">
          {actionMessage}
          <button onClick={() => setActionMessage("")}>×</button>
        </div>
      )}

      {formItem !== undefined && (
        <div className="form-panel">
          <ItemForm
            key={formItem?.id || "new-item"}
            initialItem={formItem || null}
            onSubmit={save}
            onCancel={() => setFormItem(undefined)}
            saving={saving}
          />
        </div>
      )}

      <div className="filter-bar">
        <label className="search-box">
          <span>⌕</span>
          <input
            value={search}
            onChange={(event) => update("search", event.target.value)}
            placeholder="Search products…"
            aria-label="Search items"
          />
          <kbd>⌘ K</kbd>
        </label>

        <label>
          Category
          <select
            value={category}
            onChange={(event) => update("category", event.target.value)}
          >
            <option value="all">All categories</option>
            {categories.map((itemCategory) => (
              <option key={itemCategory}>{itemCategory}</option>
            ))}
          </select>
        </label>

        <label>
          Status
          <select
            value={status}
            onChange={(event) => update("status", event.target.value)}
          >
            <option value="all">All statuses</option>
            <option>Available</option>
            <option>Unavailable</option>
          </select>
        </label>

        <label>
          Sort by
          <select
            value={sort}
            onChange={(event) => update("sort", event.target.value)}
          >
            <option value="name">Name A–Z</option>
            <option value="name-desc">Name Z–A</option>
            <option value="price-low">Price: low first</option>
            <option value="rating">Top rated</option>
          </select>
        </label>
      </div>

      {loading ? (
        <Loading label="Loading inventory…" />
      ) : error ? (
        <div className="state-card">
          <h2>Unable to load inventory</h2>
          <p>{error}</p>
          <button className="button button-primary" onClick={retry}>
            Try again
          </button>
        </div>
      ) : visible.length ? (
        <>
          <div className="items-grid">
            {visible.map((item) => (
              <ItemCard
                key={item.id}
                item={item}
                onEdit={setFormItem}
                onRemove={remove}
              />
            ))}
          </div>

          <div className="pagination">
            <span>
              Showing {filtered.length ? (currentPage - 1) * PAGE_SIZE + 1 : 0}–
              {Math.min(currentPage * PAGE_SIZE, filtered.length)} of {filtered.length}
            </span>
            <div>
              <button
                disabled={currentPage <= 1}
                onClick={() => update("page", String(currentPage - 1))}
              >
                ← Previous
              </button>
              <span className="page-number">
                {currentPage} / {pageCount}
              </span>
              <button
                disabled={currentPage >= pageCount}
                onClick={() => update("page", String(currentPage + 1))}
              >
                Next →
              </button>
            </div>
          </div>
        </>
      ) : (
        <div className="state-card">
          <h2>No matching items</h2>
          <p>Try adjusting the search or filters.</p>
          <button className="button button-quiet" onClick={() => setParams({})}>
            Clear filters
          </button>
        </div>
      )}

      <p className="helper-line">
        Tip: filters are saved in the URL, so you can share this exact view. {" "}
        <Link to="/dashboard">See catalogue insights →</Link>
      </p>
    </section>
  );
}
