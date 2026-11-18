import { Link } from "react-router-dom";

export default function Offline() {
  return (
    <section className="page-wrap offline-page">
      <div className="state-card offline-card">
        <span className="eyebrow">ITEMFLOW / OFFLINE</span>
        <h1>You’re offline.</h1>
        <p>Your saved inventory is still available. Reconnect to the internet before retrying online actions.</p>
        <div className="offline-actions">
          <button className="button button-primary" onClick={() => window.location.reload()}>
            Retry connection
          </button>
          <Link className="button button-quiet" to="/items">
            View saved inventory
          </Link>
        </div>
      </div>
    </section>
  );
}
