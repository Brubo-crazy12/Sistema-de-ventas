import { createContext, useContext, useState, type ReactNode } from "react";

interface AuthState {
  authed: boolean;
  user: { name: string; initials: string };
  login: (email: string) => void;
  logout: () => void;
}

const Ctx = createContext<AuthState | null>(null);

function initialsOf(name: string) {
  return name
    .split(" ")
    .map((p) => p[0])
    .slice(0, 2)
    .join("")
    .toUpperCase();
}

export function AuthProvider({ children }: { children: ReactNode }) {
  const [authed, setAuthed] = useState(false);
  const [name, setName] = useState("Alex Found");

  const login = (email: string) => {
    const n = email.split("@")[0].replace(/[._]/g, " ");
    const pretty = n.replace(/\b\w/g, (c) => c.toUpperCase());
    setName(pretty || "Alex Found");
    setAuthed(true);
  };
  const logout = () => setAuthed(false);

  return (
    <Ctx.Provider
      value={{ authed, user: { name, initials: initialsOf(name) }, login, logout }}
    >
      {children}
    </Ctx.Provider>
  );
}

export function useAuth() {
  const c = useContext(Ctx);
  if (!c) throw new Error("useAuth must be used within AuthProvider");
  return c;
}
