import { useState } from "react";
import { Link, Navigate, useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext.jsx";

export default function Login() {
  const { user, login, loginWithGoogle, loading, error, clearError, firebaseConfigured } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [busy, setBusy] = useState(false);
  if (!loading && user) return <Navigate to={location.state?.from?.pathname || "/profile"} replace />;

  async function submit(event) {
    event.preventDefault(); clearError(); setBusy(true);
    try { await login(email, password); navigate(location.state?.from?.pathname || "/profile", { replace: true }); }
    catch { /* Error is exposed by AuthContext. */ }
    finally { setBusy(false); }
  }
  async function google() {
    clearError(); setBusy(true);
    try { await loginWithGoogle(); navigate("/profile", { replace: true }); }
    catch { /* Error is exposed by AuthContext. */ }
    finally { setBusy(false); }
  }
  return (
    <section className="login-page">
      <div className="login-card">
        <span className="eyebrow">WELCOME BACK</span>
        <h1>Sign in to<br /><em>your workspace.</em></h1>
        {!firebaseConfigured && <p className="inline-message" role="status">Set up Firebase keys in .env.local to enable authentication.</p>}
        {error && <p className="inline-message" role="alert">{error}</p>}
        <form onSubmit={submit}>
          <label>Email address<input type="email" autoComplete="email" required value={email} onChange={(event) => setEmail(event.target.value)} placeholder="you@example.com" /></label>
          <label>Password<input type="password" autoComplete="current-password" required value={password} onChange={(event) => setPassword(event.target.value)} placeholder="At least 6 characters" /></label>
          <button className="button button-primary full" disabled={busy || !firebaseConfigured}>{busy ? "Signing in…" : "Sign in"}</button>
        </form>
        <button className="button button-quiet full" onClick={google} disabled={busy || !firebaseConfigured}>Continue with Google</button>
        <p className="login-foot">New here? <Link to="/signup">Create an account</Link></p>
        <p className="login-foot">Just looking around? <Link to="/items">Browse the inventory</Link></p>
      </div>
      <div className="login-aside"><span>ITEMFLOW / ACCESS</span><p>One considered space<br />for all your things.</p></div>
    </section>
  );
}
