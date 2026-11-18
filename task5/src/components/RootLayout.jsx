import { useEffect, useState } from "react";
import { NavLink, Outlet, useNavigate } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext.jsx";
import useOnlineStatus from "../hooks/useOnlineStatus.js";
import { activateWaitingPwaUpdate, subscribeToPwaUpdate } from "../services/pwaService.js";

const links = [
  ["Home", "/"],
  ["Inventory", "/items"],
  ["Dashboard", "/dashboard"],
  ["About", "/about"],
];

export default function RootLayout() {
  const { user, loading, logout } = useAuth();
  const isOnline = useOnlineStatus();
  const navigate = useNavigate();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [updateAvailable, setUpdateAvailable] = useState(false);

  useEffect(() => {
    const unsubscribe = subscribeToPwaUpdate(() => setUpdateAvailable(true));
    navigator.serviceWorker?.getRegistration(import.meta.env.BASE_URL)
      .then((registration) => {
        if (registration?.waiting) setUpdateAvailable(true);
      })
      .catch(() => {});
    return unsubscribe;
  }, []);

  async function handleLogout() {
    try { await logout(); navigate("/login", { replace: true }); } catch { /* AuthContext records the error. */ }
  }
  return (
    <div className="site-shell">
      <header className={`topbar ${mobileMenuOpen ? "menu-open" : ""}`}>
        <NavLink to="/" className="brand">
          <span className="brand-icon">I</span> ItemFlow
        </NavLink>
        <button
          className="mobile-menu-toggle"
          type="button"
          aria-expanded={mobileMenuOpen}
          aria-controls="main-navigation"
          onClick={() => setMobileMenuOpen((open) => !open)}
        >
          {mobileMenuOpen ? "Close" : "Menu"}
        </button>
        <nav id="main-navigation" className={mobileMenuOpen ? "is-open" : ""} aria-label="Main navigation">
          {links.map(([label, to]) => (
            <NavLink key={to} to={to} end={to === "/"} onClick={() => setMobileMenuOpen(false)}>
              {label}
            </NavLink>
          ))}
        </nav>
        <span className={`connection-pill ${isOnline ? "is-online" : "is-offline"}`} role="status" aria-live="polite">
          <span aria-hidden="true" />{isOnline ? "Online" : "Offline · saved data"}
        </span>
        {loading ? <span className="login-link">Checking session…</span> : user ? (
          <div className="auth-nav"><NavLink className="login-link" to="/profile">Profile</NavLink><button className="nav-logout" onClick={handleLogout}>Log out</button></div>
        ) : <div className="auth-nav"><NavLink className="login-link" to="/login">Login</NavLink><NavLink className="login-link" to="/signup">Sign up</NavLink></div>}
      </header>

      {updateAvailable && (
        <div className="pwa-update-banner" role="status">
          <span>A new version of ItemFlow is ready.</span>
          <button className="button button-primary" onClick={activateWaitingPwaUpdate}>Update now</button>
        </div>
      )}

      <main className="main-content">
        <Outlet />
      </main>

      <footer className="page-footer">
        <span>ItemFlow</span>
        <span>Inventory, clearly organized.</span>
      </footer>
    </div>
  );
}
