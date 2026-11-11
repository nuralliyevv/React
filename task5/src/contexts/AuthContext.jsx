import { createContext, useContext, useEffect, useMemo, useState } from "react";
import { onAuthStateChanged, createUserWithEmailAndPassword, signInWithEmailAndPassword, GoogleAuthProvider, signInWithPopup, signOut } from "firebase/auth";
import { auth, authReady, firebaseConfigured } from "../firebase.js";

/* eslint react-refresh/only-export-components: off */

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(() => Boolean(auth));
  const [error, setError] = useState("");

  useEffect(() => {
    if (!auth) return undefined;
    let active = true;
    let unsubscribe;
    authReady.then(() => {
      if (active) unsubscribe = onAuthStateChanged(auth, (nextUser) => {
        setUser(nextUser);
        setLoading(false);
      }, (authError) => {
        setError(authError.message);
        setLoading(false);
      });
    }).catch((authError) => {
      setError(authError.message);
      setLoading(false);
    });
    return () => { active = false; unsubscribe?.(); };
  }, []);

  async function run(action) {
    setError("");
    if (!auth) {
      const message = "Firebase is not configured. Add the VITE_FIREBASE values to .env.local.";
      setError(message);
      throw new Error(message);
    }
    try { await authReady; return await action(); }
    catch (authError) { setError(authError.message || "Authentication failed."); throw authError; }
  }

  const value = useMemo(() => ({
    user, loading, error, firebaseConfigured,
    signup: (email, password) => run(() => createUserWithEmailAndPassword(auth, email, password)),
    login: (email, password) => run(() => signInWithEmailAndPassword(auth, email, password)),
    loginWithGoogle: () => run(() => signInWithPopup(auth, new GoogleAuthProvider())),
    logout: () => run(() => signOut(auth)),
    clearError: () => setError(""),
  }), [user, loading, error]);

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) throw new Error("useAuth must be used within AuthProvider");
  return context;
}
