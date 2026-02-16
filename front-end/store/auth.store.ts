import { useState, useEffect } from "react";

type AuthState = {
  user: any | null;
  logout: () => void;
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

  const state: AuthState = { user, logout };
  return selector(state);
};

export default useAuthStore;
