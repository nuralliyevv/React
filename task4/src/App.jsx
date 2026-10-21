import { useEffect, useState } from "react";
import ItemList from "./components/ItemList.jsx";
import ItemForm from "./components/ItemForm.jsx";
import ItemDetails from "./components/ItemDetails.jsx";
import {
  loadItems,
  loadItemDetails,
  addItem,
  editItem,
  removeItem,
  changeItemStatus,
} from "./services/itemService.js";
import "./App.css";

function App() {
  const [items, setItems] = useState([]);
  const [selectedId, setSelectedId] = useState(null);
  const [details, setDetails] = useState(null);

  const [listLoading, setListLoading] = useState(true);
  const [detailsLoading, setDetailsLoading] = useState(false);

  const [listError, setListError] = useState("");
  const [detailsError, setDetailsError] = useState("");
  const [actionError, setActionError] = useState("");
  const [successMessage, setSuccessMessage] = useState("");

  const [reloadCount, setReloadCount] = useState(0);
  const [formMode, setFormMode] = useState(null);
  const [editingItem, setEditingItem] = useState(null);

  const [saving, setSaving] = useState(false);
  const [removingId, setRemovingId] = useState(null);
  const [statusChangingId, setStatusChangingId] = useState(null);

  useEffect(() => {
    let cancelled = false;

    async function fetchItems() {
      setListLoading(true);
      setListError("");

      try {
        const data = await loadItems();

        if (!cancelled) {
          setItems(data);
        }
      } catch (error) {
        if (!cancelled) {
          setListError(
            error.message || "Failed to load items. Please try again."
          );
        }
      } finally {
        if (!cancelled) {
          setListLoading(false);
        }
      }
    }

    fetchItems();

    return () => {
      cancelled = true;
    };
  }, [reloadCount]);

  useEffect(() => {
    if (selectedId === null) {
      setDetails(null);
      setDetailsLoading(false);
      setDetailsError("");
      return;
    }

    let cancelled = false;
    const requestedId = selectedId;

    async function fetchDetails() {
      setDetails(null);
      setDetailsLoading(true);
      setDetailsError("");

      try {
        const data = await loadItemDetails(requestedId);

        if (!cancelled) {
          setDetails(data);
        }
      } catch (error) {
        if (!cancelled) {
          setDetailsError(
            error.message || "Failed to load item details."
          );
        }
      } finally {
        if (!cancelled) {
          setDetailsLoading(false);
        }
      }
    }

    fetchDetails();

    return () => {
      cancelled = true;
    };
  }, [selectedId]);

  function showSuccess(message) {
    setSuccessMessage(message);
    setActionError("");
  }

  function handleSelect(id) {
    setSelectedId(id);
    setFormMode(null);
    setEditingItem(null);
    setActionError("");
    setSuccessMessage("");
  }

  function handleCreate() {
    setEditingItem(null);
    setFormMode("create");
    setActionError("");
    setSuccessMessage("");
  }

  function handleEdit(item) {
    setEditingItem(item);
    setFormMode("edit");
    setActionError("");
    setSuccessMessage("");
  }

  function handleCancelForm() {
    setFormMode(null);
    setEditingItem(null);
  }

  async function handleSubmit(formData) {
    if (saving) return;

    setSaving(true);
    setActionError("");
    setSuccessMessage("");

    try {
      if (formMode === "create") {
        const createdItem = await addItem(formData);

        setItems((currentItems) =>
          [...currentItems, createdItem].sort((a, b) =>
            a.name.localeCompare(b.name)
          )
        );

        setSelectedId(createdItem.id);
        setFormMode(null);
        setEditingItem(null);

        showSuccess("Item created successfully.");
      } else if (formMode === "edit" && editingItem) {
        const editedId = editingItem.id;
        const updatedItem = await editItem(editedId, formData);

        setItems((currentItems) =>
          currentItems.map((item) =>
            item.id === editedId ? updatedItem : item
          ).sort((a, b) => a.name.localeCompare(b.name))
        );

        if (selectedId === editedId) {
          setDetails(updatedItem);
        }

        setFormMode(null);
        setEditingItem(null);

        showSuccess("Item updated successfully.");
      }
    } catch (error) {
      setActionError(
        error.message || "The operation failed. Please try again."
      );
    } finally {
      setSaving(false);
    }
  }

  async function handleRemove(id) {
    if (removingId !== null) return;

    const itemToRemove = items.find((item) => item.id === id);

    if (!window.confirm(`Remove "${itemToRemove?.name || "this item"}"?`)) {
      return;
    }

    setRemovingId(id);
    setActionError("");
    setSuccessMessage("");

    try {
      await removeItem(id);

      setItems((currentItems) =>
        currentItems.filter((item) => item.id !== id)
      );

      setSelectedId((currentId) => (currentId === id ? null : currentId));

      if (editingItem?.id === id) {
        setEditingItem(null);
        setFormMode(null);
      }

      showSuccess("Item removed successfully.");
    } catch (error) {
      setActionError(
        error.message || "Failed to remove the item."
      );
    } finally {
      setRemovingId(null);
    }
  }

  async function handleChangeStatus(id, newStatus) {
    if (statusChangingId !== null) return;

    const requestedId = id;
    const requestedStatus = newStatus;

    setStatusChangingId(requestedId);
    setActionError("");
    setSuccessMessage("");

    try {
      const updatedItem = await changeItemStatus(
        requestedId,
        requestedStatus
      );

      setItems((currentItems) =>
        currentItems.map((item) =>
          item.id === requestedId
            ? { ...item, ...updatedItem }
            : item
        )
      );

      setDetails((currentDetails) =>
        currentDetails?.id === requestedId
          ? { ...currentDetails, ...updatedItem }
          : currentDetails
      );

      showSuccess(
        `Item status changed to ${requestedStatus}.`
      );
    } catch (error) {
      setActionError(
        error.message || "Failed to update item status."
      );
    } finally {
      setStatusChangingId(null);
    }
  }

  function handleReload() {
    setReloadCount((count) => count + 1);
    setSuccessMessage("");
    setActionError("");
  }

  const selectedItem =
    details?.id === selectedId ? details : null;

  return (
    <div className="app">
      <header className="topbar">
        <a
          href="#home"
          className="brand"
          onClick={(event) => event.preventDefault()}
        >
          <span className="brand-icon">I</span>
          <span>ItemFlow</span>
        </a>

        <div className="topbar-right">
          <span className="api-indicator">
            <span className="api-dot" />
            Simulated API
          </span>

          <button
            type="button"
            className="button button-secondary"
            onClick={handleReload}
            disabled={listLoading}
          >
            <span aria-hidden="true">↻</span> Reload
          </button>
        </div>
      </header>

      <main className="main-content">
        <section className="page-heading">
          <div>
            <span className="eyebrow">WORKSPACE / INVENTORY</span>
            <h1>Item Management</h1>
            <p>
              Manage your inventory, review item details, and update
              availability.
            </p>
          </div>

          <button
            type="button"
            className="button button-primary create-button"
            onClick={handleCreate}
          >
            <span aria-hidden="true">＋</span> Create item
          </button>
        </section>

        {successMessage && (
          <div className="alert alert-success" role="status">
            <span>✓</span>
            {successMessage}
            <button
              type="button"
              aria-label="Dismiss message"
              onClick={() => setSuccessMessage("")}
            >
              ×
            </button>
          </div>
        )}

        {actionError && (
          <div className="alert alert-error" role="alert">
            <span>!</span>
            {actionError}
            <button
              type="button"
              aria-label="Dismiss error"
              onClick={() => setActionError("")}
            >
              ×
            </button>
          </div>
        )}

        <section className="stats-grid">
          <div className="stat-card">
            <span className="stat-icon">▤</span>
            <div>
              <p>Total items</p>
              <strong>{items.length}</strong>
            </div>
          </div>

          <div className="stat-card">
            <span className="stat-icon stat-icon-green">✓</span>
            <div>
              <p>Available</p>
              <strong>
                {items.filter((item) => item.status === "Available").length}
              </strong>
            </div>
          </div>

          <div className="stat-card">
            <span className="stat-icon stat-icon-orange">◷</span>
            <div>
              <p>Unavailable</p>
              <strong>
                {items.filter((item) => item.status === "Unavailable").length}
              </strong>
            </div>
          </div>

          <div className="stat-card">
            <span className="stat-icon stat-icon-purple">★</span>
            <div>
              <p>Average rating</p>
              <strong>
                {items.length
                  ? (
                      items.reduce(
                        (total, item) => total + Number(item.rating || 0),
                        0
                      ) / items.length
                    ).toFixed(1)
                  : "—"}
              </strong>
            </div>
          </div>
        </section>

        {formMode && (
          <section className="form-panel">
            <ItemForm
              key={`${formMode}-${editingItem?.id ?? "new"}`}
              initialItem={formMode === "edit" ? editingItem : null}
              onSubmit={handleSubmit}
              onCancel={handleCancelForm}
              saving={saving}
            />
          </section>
        )}

        <section className="workspace-grid">
          <div className="panel inventory-panel">
            <div className="panel-heading">
              <div>
                <h2>Inventory</h2>
                <p>Select an item to view its details.</p>
              </div>

              <span className="count-badge">{items.length} items</span>
            </div>

            {listLoading ? (
              <div className="loading-state">
                <div className="spinner" />
                <p>Loading inventory...</p>
              </div>
            ) : listError ? (
              <div className="empty-state error-state">
                <span className="empty-icon">⚠️</span>
                <h3>Unable to load inventory</h3>
                <p>{listError}</p>
                <button
                  type="button"
                  className="button button-primary"
                  onClick={handleReload}
                >
                  Try again
                </button>
              </div>
            ) : (
              <ItemList
                items={items}
                selectedId={selectedId}
                onSelect={handleSelect}
                onEdit={handleEdit}
                onRemove={handleRemove}
                removingId={removingId}
              />
            )}
          </div>

          <div className="panel details-panel">
            <div className="panel-heading">
              <div>
                <h2>Item details</h2>
                <p>Detailed information and status controls.</p>
              </div>
            </div>

            <ItemDetails
              item={selectedItem}
              loading={detailsLoading}
              error={detailsError}
              onChangeStatus={handleChangeStatus}
              statusChanging={statusChangingId !== null}
            />
          </div>
        </section>

        <footer className="page-footer">
          <span>ItemFlow</span>
          <span>Inventory management · React Effects & API</span>
        </footer>
      </main>
    </div>
  );
}

export default App;