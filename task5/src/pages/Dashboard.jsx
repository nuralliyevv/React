import { useMemo, useState } from "react";
import { Link } from "react-router-dom";
import Loading from "../components/Loading.jsx";
import useItems from "../hooks/useItems.js";

export default function Dashboard() {
  const { items, loading, error, retry } = useItems();
  const [status, setStatus] = useState("all");

  const scoped = useMemo(
    () => items.filter((item) => status === "all" || item.status === status),
    [items, status],
  );
  const averageRating = scoped.length
    ? scoped.reduce((sum, item) => sum + Number(item.rating || 0), 0) /
      scoped.length
    : 0;
  const stockValue = scoped.reduce(
    (sum, item) => sum + Number(item.price || 0) * Number(item.stock || 0),
    0,
  );
  const availableCount = scoped.filter(
    (item) => item.status === "Available",
  ).length;
  const lowStockCount = scoped.filter((item) => Number(item.stock) < 10).length;

  const categories = Object.entries(
    scoped.reduce((counts, item) => {
      const category = item.category || "Other";
      counts[category] = (counts[category] || 0) + 1;
      return counts;
    }, {}),
  ).sort((a, b) => b[1] - a[1]);
  const statuses = ["Available", "Unavailable"].map((name) => [
    name,
    scoped.filter((item) => item.status === name).length,
  ]);
  const maxCategoryCount = Math.max(1, ...categories.map(([, count]) => count));

  if (loading) {
    return (
      <section className="page-wrap">
        <Loading label="Building your dashboard…" />
      </section>
    );
  }

  if (error) {
    return (
      <section className="page-wrap">
        <div className="state-card">
          <h2>Dashboard is unavailable</h2>
          <p>{error}</p>
          <button className="button button-primary" onClick={retry}>
            Try again
          </button>
        </div>
      </section>
    );
  }

  return (
    <section className="page-wrap">
      <div className="page-heading">
        <div>
          <span className="eyebrow">WORKSPACE / OVERVIEW</span>
          <h1>
            The bigger <em>picture.</em>
          </h1>
          <p>Live signals from your inventory.</p>
        </div>
        <label className="scope-select">
          Show
          <select value={status} onChange={(event) => setStatus(event.target.value)}>
            <option value="all">All statuses</option>
            <option>Available</option>
            <option>Unavailable</option>
          </select>
        </label>
      </div>

      <div className="stats-grid">
        <article className="stat-card">
          <span className="stat-icon">▤</span>
          <div>
            <p>Items in view</p>
            <strong>{scoped.length}</strong>
          </div>
          <small>of {items.length} total</small>
        </article>
        <article className="stat-card">
          <span className="stat-icon stat-icon-green">✓</span>
          <div>
            <p>Available</p>
            <strong>{availableCount}</strong>
          </div>
          <small>
            {scoped.length ? Math.round((availableCount / scoped.length) * 100) : 0}% of view
          </small>
        </article>
        <article className="stat-card">
          <span className="stat-icon stat-icon-purple">★</span>
          <div>
            <p>Average rating</p>
            <strong>{averageRating.toFixed(1)}</strong>
          </div>
          <small>out of 5.0</small>
        </article>
        <article className="stat-card">
          <span className="stat-icon stat-icon-orange">◷</span>
          <div>
            <p>Stock value</p>
            <strong>{stockValue.toLocaleString()} ₸</strong>
          </div>
          <small>{lowStockCount} items below 10 units</small>
        </article>
      </div>

      <div className="dashboard-grid">
        <section className="panel">
          <div className="panel-heading">
            <div>
              <span className="eyebrow">01 / ASSORTMENT</span>
              <h2>By category</h2>
            </div>
          </div>
          {categories.length ? (
            categories.map(([name, count]) => (
              <div className="bar-row" key={name}>
                <div>
                  <span>{name}</span>
                  <strong>{count}</strong>
                </div>
                <div className="bar-track">
                  <span style={{ width: `${(count / maxCategoryCount) * 100}%` }} />
                </div>
              </div>
            ))
          ) : (
            <p className="muted">No category data for this filter.</p>
          )}
        </section>

        <section className="panel">
          <div className="panel-heading">
            <div>
              <span className="eyebrow">02 / AVAILABILITY</span>
              <h2>Stock status</h2>
            </div>
          </div>
          {statuses.map(([name, count]) => (
            <div className="status-breakdown" key={name}>
              <span
                className={`status ${name === "Available" ? "available" : "unavailable"}`}
              >
                {name}
              </span>
              <strong>{count}</strong>
              <span className="muted">
                {scoped.length ? Math.round((count / scoped.length) * 100) : 0}%
              </span>
            </div>
          ))}
          <Link className="text-link" to="/items">
            Explore items →
          </Link>
        </section>
      </div>

      <section className="dashboard-cta">
        <div>
          <span className="eyebrow">NEXT STEP</span>
          <h2>Make a closer inspection.</h2>
          <p>Open the catalogue to search, filter, and check any product.</p>
        </div>
        <Link className="button button-primary" to="/items">
          Go to inventory →
        </Link>
      </section>
    </section>
  );
}
