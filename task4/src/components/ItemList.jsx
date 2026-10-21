function ItemList({
  items,
  selectedId,
  onSelect,
  onEdit,
  onRemove,
  removingId,
}) {
  if (items.length === 0) {
    return (
      <div className="empty-state">
        <span className="empty-icon">📦</span>
        <h3>No items found</h3>
        <p>Create your first item to get started.</p>
      </div>
    );
  }

  return (
    <div className="item-list">
      {items.map((item) => (
        <article
          key={item.id}
          className={`item-card ${
            selectedId === item.id ? "selected" : ""
          }`}
          onClick={() => onSelect(item.id)}
        >
          <div className="item-card-top">
            <div className="item-icon">
              {item.name.charAt(0).toUpperCase()}
            </div>

            <span
              className={`status-badge ${
                item.status === "Available" ? "available" : "unavailable"
              }`}
            >
              {item.status || "Unknown"}
            </span>
          </div>

          <h3>{item.name}</h3>
          <p className="item-description">{item.description}</p>

          <div className="item-card-meta">
            <span>{item.category || "Uncategorized"}</span>
            <strong>
              {Number(item.price || 0).toLocaleString("en-US")} ₸
            </strong>
          </div>

          <div className="item-card-actions">
            <button
              type="button"
              className="button button-secondary button-small"
              onClick={(event) => {
                event.stopPropagation();
                onEdit(item);
              }}
            >
              Edit
            </button>

            <button
              type="button"
              className="button button-danger button-small"
              disabled={removingId === item.id}
              onClick={(event) => {
                event.stopPropagation();
                onRemove(item.id);
              }}
            >
              {removingId === item.id ? "Removing..." : "Remove"}
            </button>
          </div>
        </article>
      ))}
    </div>
  );
}

export default ItemList;