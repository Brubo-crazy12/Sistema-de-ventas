import { createContext, useContext, useState, type ReactNode } from "react";

export interface AuthUser {
  id: number;
  name: string;
  email: string;
  role: "admin" | "user";
  initials: string;
}

interface AuthState {
  authed: boolean;
  user: AuthUser | null;
  login: (u: { id: number; name: string; email: string; role: "admin" | "user" }, token: string) => void;
  logout: () => void;
}

const Ctx = createContext<AuthState | null>(null);
const STORAGE_KEY = "monitor_user";

function initialsOf(name: string) {
  return name
    .split(" ")
    .map((p) => p[0])
    .slice(0, 2)
    .join("")
    .toUpperCase();
}

function load(): { user: AuthUser | null; authed: boolean } {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return { user: null, authed: false };
    const u = JSON.parse(raw);
    if (!u?.id || !u?.token) return { user: null, authed: false };
    return {
      user: { ...u, initials: initialsOf(u.name), role: u.role ?? "user" },
      authed: true,
    };
  } catch {
    return { user: null, authed: false };
  }
}

export function AuthProvider({ children }: { children: ReactNode }) {
  const initial = load();
  const [authed, setAuthed] = useState(initial.authed);
  const [user, setUser] = useState<AuthUser | null>(initial.user);

  const login = (
    u: { id: number; name: string; email: string; role: "admin" | "user" },
    token: string
  ) => {
    const full: AuthUser & { token: string } = {
      ...u,
      initials: initialsOf(u.name),
      token,
    };
    localStorage.setItem(STORAGE_KEY, JSON.stringify(full));
    setUser(full);
    setAuthed(true);
  };

  const logout = () => {
    localStorage.removeItem(STORAGE_KEY);
    setUser(null);
    setAuthed(false);
  };

  return (
    <Ctx.Provider value={{ authed, user, login, logout }}>
      {children}
    </Ctx.Provider>
  );
}

export function useAuth() {
  const c = useContext(Ctx);
  if (!c) throw new Error("useAuth must be used within AuthProvider");
  return c;
}

export function getAuthToken(): string | null {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return null;
    const u = JSON.parse(raw);
    return u?.token ?? null;
  } catch {
    return null;
  }
}
