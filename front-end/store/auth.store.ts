import { useState, useEffect } from "react";

type AuthState = {
  user: any | null;
  logout: () => void;
  setUser: (u: any | null) => void;
};

// Minimal client-side auth hook to satisfy existing imports.
// This is a lightweight stand-in for a proper global store (e.g., Zustand or React Context).
export const useAuthStore = (selector: (s: AuthState) => any = (s) => s) => {
  const [user, setUser] = useState<any | null>(null);

  useEffect(() => {
    try {
      const raw = localStorage.getItem("user");
      if (raw) setUser(JSON.parse(raw));
    } catch (e) {
      // ignore
    }
  }, []);

  const logout = () => {
    try {
      localStorage.removeItem("token");
      localStorage.removeItem("user");
    } catch (e) {
      // ignore
    }
    setUser(null);
  };

  const setUserLocal = (u: any | null) => {
    try {
      if (u === null) {
        localStorage.removeItem('user');
      } else {
        localStorage.setItem('user', JSON.stringify(u));
      }
    } catch (e) {
      // ignore
    }
    setUser(u);
  };

  const state: AuthState = { user, logout, setUser: setUserLocal };
  return selector(state);
};

export default useAuthStore;
