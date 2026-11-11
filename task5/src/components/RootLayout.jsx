import { NavLink, Outlet, useNavigate } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext.jsx";

const links = [
  ["Home", "/"],
  ["Inventory", "/items"],
  ["Dashboard", "/dashboard"],
  ["About", "/about"],
];

export default function RootLayout() {
  const { user, loading, logout } = useAuth();
  const navigate = useNavigate();
  async function handleLogout() {
    try { await logout(); navigate("/login", { replace: true }); } catch { /* AuthContext records the error. */ }
  }
  return (
    <div className="site-shell">
      <header className="topbar">
        <NavLink to="/" className="brand">
          <span className="brand-icon">I</span> ItemFlow
        </NavLink>
        <nav aria-label="Main navigation">
          {links.map(([label, to]) => (
            <NavLink key={to} to={to} end={to === "/"}>
              {label}
            </NavLink>
          ))}
        </nav>
        {loading ? <span className="login-link">Checking session…</span> : user ? (
          <div className="auth-nav"><NavLink className="login-link" to="/profile">Profile</NavLink><button className="nav-logout" onClick={handleLogout}>Log out</button></div>
        ) : <div className="auth-nav"><NavLink className="login-link" to="/login">Login</NavLink><NavLink className="login-link" to="/signup">Sign up</NavLink></div>}
      </header>

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
