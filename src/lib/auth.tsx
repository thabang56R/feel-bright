import { createContext, useContext, useEffect, useState, type ReactNode } from "react";

export interface User {
  id: string;
  name: string;
  email: string;
  avatar?: string;
  plan: "Free" | "Pro" | "Enterprise";
}

interface AuthContextType {
  user: User | null;
  token: string | null;
  loading: boolean;
  login: (email: string, password: string) => Promise<void>;
  register: (name: string, email: string, password: string) => Promise<void>;
  logout: () => void;
  updateUser: (patch: Partial<User>) => void;
}

const AuthContext = createContext<AuthContextType | null>(null);

const STORAGE_KEY = "sentio.auth";

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (raw) {
        const parsed = JSON.parse(raw);
        setUser(parsed.user);
        setToken(parsed.token);
      }
    } catch {}
    setLoading(false);
  }, []);

  const persist = (u: User, t: string) => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify({ user: u, token: t }));
    setUser(u);
    setToken(t);
  };

  const login = async (email: string, password: string) => {
    await new Promise((r) => setTimeout(r, 700));
    if (!email || !password) throw new Error("Email and password required");
    const u: User = {
      id: crypto.randomUUID(),
      name: email.split("@")[0].replace(/\b\w/g, (c) => c.toUpperCase()),
      email,
      plan: "Pro",
    };
    persist(u, "mock.jwt." + btoa(email));
  };

  const register = async (name: string, email: string, password: string) => {
    await new Promise((r) => setTimeout(r, 800));
    if (!name || !email || !password) throw new Error("All fields required");
    const u: User = { id: crypto.randomUUID(), name, email, plan: "Free" };
    persist(u, "mock.jwt." + btoa(email));
  };

  const logout = () => {
    localStorage.removeItem(STORAGE_KEY);
    setUser(null);
    setToken(null);
  };

  const updateUser = (patch: Partial<User>) => {
    if (!user || !token) return;
    const next = { ...user, ...patch };
    persist(next, token);
  };

  return (
    <AuthContext.Provider value={{ user, token, loading, login, register, logout, updateUser }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within AuthProvider");
  return ctx;
}
