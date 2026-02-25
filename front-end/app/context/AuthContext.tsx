// @/app/context/AuthContext.tsx
"use client";
import { createContext, ReactNode, useContext, useEffect, useState } from "react";

export type User = { id: string | number; name: string; email: string; role: "jobseeker" | "employer"; };
type AuthType = { user: User | null; token: string | null; hasMounted: boolean; login: (data: { user: User; token: string }) => void; logout: () => void; };

const AuthContext = createContext<AuthType | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [hasMounted, setHasMounted] = useState(false);
  
  useEffect(() => {
    setHasMounted(true);
    const storedUser = localStorage.getItem("user");
    const storedToken = localStorage.getItem("token");
    if (storedUser && storedToken) {
      try {
        setUser(JSON.parse(storedUser));
        setToken(storedToken);
      } catch (e) { console.error("Auth Parsing Error", e); }
    }
  }, []);

  const login = ({ user, token }: { user: User; token: string }) => {
    localStorage.setItem("user", JSON.stringify(user));
    localStorage.setItem("token", token);
    setUser(user);
    setToken(token);
  };

  const logout = () => {
    localStorage.clear();
    setUser(null);
    setToken(null);
    window.location.href = "/login";
  };

  return <AuthContext.Provider value={{ user, token, hasMounted, login, logout }}>{children}</AuthContext.Provider>;
}

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error("useAuth must be used inside AuthProvider");
  return context;
};