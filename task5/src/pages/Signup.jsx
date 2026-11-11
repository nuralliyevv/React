import { useState } from "react";
import { Link, Navigate, useNavigate } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext.jsx";

export default function Signup() {
  const { user, signup, loading, error, clearError, firebaseConfigured } = useAuth();
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [formError, setFormError] = useState("");
  const [busy, setBusy] = useState(false);
  if (!loading && user) return <Navigate to="/profile" replace />;

  async function submit(event) {
    event.preventDefault(); clearError(); setFormError("");
    if (password.length < 6) return setFormError("Password must be at least 6 characters.");
    if (password !== confirm) return setFormError("Passwords do not match.");
    setBusy(true);
    try { await signup(email, password); navigate("/profile", { replace: true }); }
    catch { /* Error is exposed by AuthContext. */ }
    finally { setBusy(false); }
  }
  return <section className="login-page"><div className="login-card">
    <span className="eyebrow">JOIN ITEMFLOW</span><h1>Create your<br /><em>workspace.</em></h1>
    {!firebaseConfigured && <p className="inline-message" role="status">Set up Firebase keys in .env.local to enable authentication.</p>}
    {(formError || error) && <p className="inline-message" role="alert">{formError || error}</p>}
    <form onSubmit={submit}>
      <label>Email address<input type="email" autoComplete="email" required value={email} onChange={(event) => setEmail(event.target.value)} /></label>
      <label>Password<input type="password" autoComplete="new-password" required minLength={6} value={password} onChange={(event) => setPassword(event.target.value)} /></label>
      <label>Confirm password<input type="password" autoComplete="new-password" required value={confirm} onChange={(event) => setConfirm(event.target.value)} /></label>
      <button className="button button-primary full" disabled={busy || !firebaseConfigured}>{busy ? "Creating account…" : "Create account"}</button>
    </form>
    <p className="login-foot">Already registered? <Link to="/login">Sign in</Link></p>
  </div><div className="login-aside"><span>ITEMFLOW / ACCESS</span><p>Make room for<br />a clearer view.</p></div></section>;
}
