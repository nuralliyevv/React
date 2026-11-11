import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext.jsx";

export default function Profile() {
  const { user, logout, error, clearError } = useAuth();
  const [busy, setBusy] = useState(false);
  const navigate = useNavigate();
  async function handleLogout() {
    setBusy(true); clearError();
    try { await logout(); navigate("/login", { replace: true }); }
    catch { /* Error is exposed by AuthContext. */ }
    finally { setBusy(false); }
  }
  return <section className="page-wrap"><div className="page-heading"><div><span className="eyebrow">ACCOUNT / PROFILE</span><h1>Your <em>profile.</em></h1><p>Signed in with Firebase Authentication.</p></div></div>
    <div className="state-card"><h2>Account details</h2><p><strong>Email</strong><br />{user?.email || "No email on this account"}</p><p><strong>UID</strong><br /><code>{user?.uid}</code></p>{error && <p role="alert">{error}</p>}<button className="button button-primary" onClick={handleLogout} disabled={busy}>{busy ? "Signing out…" : "Log out"}</button></div>
  </section>;
}
