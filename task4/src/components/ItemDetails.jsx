function ItemDetails({
  item,
  loading,
  error,
  onChangeStatus,
  statusChanging,
}) {
  if (loading) {
    return (
      <div className="details-placeholder">
        <div className="spinner" />
        <h3>Loading item details...</h3>
        <p>Please wait while we load the data from the API.</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="details-placeholder error-state">
        <span className="empty-icon">⚠️</span>
        <h3>Could not load details</h3>
        <p>{error}</p>
        <p>Select the item again to retry.</p>
      </div>
    );
  }

  if (!item) {
    return (
      <div className="details-placeholder">
        <span className="empty-icon">👈</span>
        <h3>Select an item</h3>
        <p>Choose an item from the list to load its details.</p>
      </div>
    );
  }

  const nextStatus =
    item.status === "Available" ? "Unavailable" : "Available";

  return (
    <div className="details-content">
      <div className="details-heading">
        <div className="details-icon">
          {item.name.charAt(0).toUpperCase()}
        </div>

        <div>
          <span className="eyebrow">ITEM DETAILS</span>
          <h2>{item.name}</h2>
          <p className="details-description">{item.description}</p>
        </div>
      </div>

      <div className="details-status-row">
        <span className="field-label">Current status</span>

        <span
          className={`status-badge ${
            item.status === "Available" ? "available" : "unavailable"
          }`}
        >
          {item.status || "Unknown"}
        </span>
      </div>

      <div className="details-grid">
        <div className="detail-field">
          <span className="field-label">Category</span>
          <strong>{item.category || "Not specified"}</strong>
        </div>

        <div className="detail-field">
          <span className="field-label">Manufacturer</span>
          <strong>{item.manufacturer || "Not specified"}</strong>
        </div>

        <div className="detail-field">
          <span className="field-label">Price</span>
          <strong>
            {Number(item.price || 0).toLocaleString("en-US")} ₸
          </strong>
        </div>

        <div className="detail-field">
          <span className="field-label">Stock</span>
          <strong>{item.stock ?? 0} units</strong>
        </div>

        <div className="detail-field">
          <span className="field-label">Rating</span>
          <strong>⭐ {Number(item.rating || 0).toFixed(1)} / 5</strong>
        </div>

        <div className="detail-field">
          <span className="field-label">Item ID</span>
          <strong>#{item.id}</strong>
        </div>
      </div>

      <div className="details-footer">
        <div>
          <h3>Update availability</h3>
          <p>Change this item's status through the simulated API.</p>
        </div>

        <button
          type="button"
          className="button button-primary"
          onClick={() => onChangeStatus(item.id, nextStatus)}
          disabled={statusChanging}
        >
          {statusChanging ? "Updating..." : `Set ${nextStatus}`}
        </button>
      </div>
    </div>
  );
}

export default ItemDetails;