import { createContext, useContext, useState, type ReactNode } from "react";

export interface AuthUser {
  id: number;
  name: string;
  email: string;
  initials: string;
}

interface AuthState {
  authed: boolean;
  user: AuthUser | null;
  login: (u: { id: number; name: string; email: string }) => void;
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
    if (!u?.id) return { user: null, authed: false };
    return { user: { ...u, initials: initialsOf(u.name) }, authed: true };
  } catch {
    return { user: null, authed: false };
  }
}

export function AuthProvider({ children }: { children: ReactNode }) {
  const initial = load();
  const [authed, setAuthed] = useState(initial.authed);
  const [user, setUser] = useState<AuthUser | null>(initial.user);

  const login = (u: { id: number; name: string; email: string }) => {
    const full: AuthUser = { ...u, initials: initialsOf(u.name) };
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
