import { useState } from "react";

const emptyForm = {
  name: "",
  description: "",
  category: "",
  price: "",
  stock: "",
  status: "Available",
  manufacturer: "",
  rating: "4.5",
};

function ItemForm({ initialItem, onSubmit, onCancel, saving }) {
  const [form, setForm] = useState(() => ({
    ...emptyForm,
    ...(initialItem || {}),
    price: initialItem?.price ?? "",
    stock: initialItem?.stock ?? "",
    rating: initialItem?.rating ?? "4.5",
  }));

  function handleChange(event) {
    const { name, value } = event.target;

    setForm((currentForm) => ({
      ...currentForm,
      [name]: value,
    }));
  }

  function handleSubmit(event) {
    event.preventDefault();

    onSubmit({
      ...form,
      name: form.name.trim(),
      description: form.description.trim(),
      category: form.category.trim(),
      manufacturer: form.manufacturer.trim(),
      price: Number(form.price),
      stock: Number(form.stock),
      rating: Number(form.rating),
    });
  }

  return (
    <form className="item-form" onSubmit={handleSubmit}>
      <div className="form-heading">
        <div>
          <h2>{initialItem ? "Edit item" : "Create item"}</h2>
          <p>
            {initialItem
              ? "Update the information below."
              : "Enter the details for your new item."}
          </p>
        </div>
      </div>

      <label>
        Item name *
        <input
          name="name"
          value={form.name}
          onChange={handleChange}
          placeholder="e.g. Wireless Headphones"
          required
          maxLength={100}
        />
      </label>

      <label>
        Description *
        <textarea
          name="description"
          value={form.description}
          onChange={handleChange}
          placeholder="Describe the item..."
          required
          maxLength={500}
          rows={3}
        />
      </label>

      <div className="form-grid">
        <label>
          Category *
          <input
            name="category"
            value={form.category}
            onChange={handleChange}
          placeholder="Electronics"
            required
          />
        </label>

        <label>
          Manufacturer *
          <input
            name="manufacturer"
            value={form.manufacturer}
            onChange={handleChange}
            placeholder="Sony"
            required
          />
        </label>

        <label>
          Price (₸) *
          <input
            name="price"
            type="number"
            min="0"
            step="1"
            value={form.price}
            onChange={handleChange}
            required
          />
        </label>

        <label>
          Stock *
          <input
            name="stock"
            type="number"
            min="0"
            step="1"
            value={form.stock}
            onChange={handleChange}
            required
          />
        </label>

        <label>
          Rating (0–5) *
          <input
            name="rating"
            type="number"
            min="0"
            max="5"
            step="0.1"
            value={form.rating}
            onChange={handleChange}
            required
          />
        </label>

        <label>
          Status *
          <select
            name="status"
            value={form.status}
            onChange={handleChange}
            required
          >
            <option value="Available">Available</option>
            <option value="Unavailable">Unavailable</option>
          </select>
        </label>
      </div>

      <div className="form-actions">
        <button
          type="button"
          className="button button-secondary"
          onClick={onCancel}
          disabled={saving}
        >
          Cancel
        </button>

        <button
          type="submit"
          className="button button-primary"
          disabled={saving}
        >
          {saving
            ? "Saving..."
            : initialItem
              ? "Save changes"
              : "Create item"}
        </button>
      </div>
    </form>
  );
}

export default ItemForm;