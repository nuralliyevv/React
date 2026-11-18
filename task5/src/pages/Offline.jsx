import { Link, useNavigate } from "react-router-dom";
import useOnlineStatus from "../hooks/useOnlineStatus.js";

export default function Offline() {
  const isOnline = useOnlineStatus();
  const navigate = useNavigate();

  return (
    <section className="page-wrap offline-page">
      <div className="state-card offline-card">
        <span className="eyebrow">ITEMFLOW / OFFLINE</span>
        <h1>{isOnline ? "You’re back online." : "You’re offline."}</h1>
        <p>{isOnline
          ? "Your connection is back. Continue to the saved inventory."
          : "Your saved inventory is still available. Reconnect to the internet before retrying online actions."}</p>
        <div className="offline-actions">
          <button
            className="button button-primary"
            onClick={() => isOnline ? navigate("/items", { replace: true }) : window.location.reload()}
          >
            {isOnline ? "Open inventory" : "Retry connection"}
          </button>
          <Link className="button button-quiet" to="/items">
            View saved inventory
          </Link>
        </div>
      </div>
    </section>
  );
}
