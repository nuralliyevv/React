import { NavLink, Outlet } from "react-router-dom";

const links = [["Home", "/"], ["Inventory", "/items"], ["Dashboard", "/dashboard"], ["About", "/about"]];
export default function RootLayout() {
  return <div className="site-shell"><header className="topbar"><NavLink to="/" className="brand"><span className="brand-icon">I</span> ItemFlow</NavLink><nav aria-label="Main navigation">{links.map(([label, to]) => <NavLink key={to} to={to} end={to === "/"}>{label}</NavLink>)}</nav><NavLink className="login-link" to="/login">Sign in <span>↗</span></NavLink></header><main className="main-content"><Outlet /></main><footer className="page-footer"><span>ItemFlow</span><span>Inventory, clearly organized.</span></footer></div>;
}
