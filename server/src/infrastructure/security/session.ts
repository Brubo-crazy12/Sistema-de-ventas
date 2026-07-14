import jwt from "jsonwebtoken";

const JWT_SECRET = process.env.JWT_SECRET || "";
const JWT_EXPIRES_IN = process.env.JWT_EXPIRES_IN || "7d";

export interface SessionPayload {
  userId: number;
  role: "admin" | "user";
}

function secret(): string {
  if (JWT_SECRET) return JWT_SECRET;
  if (process.env.NODE_ENV !== "production") {
    return "dev-insecure-secret-change-me";
  }
  throw new Error(
    "JWT_SECRET no está configurado. Defínelo en las variables de entorno (Vercel o server/.env)."
  );
}

export function signToken(payload: SessionPayload): string {
  return jwt.sign(payload, secret(), { expiresIn: JWT_EXPIRES_IN as jwt.SignOptions["expiresIn"] });
}

export function verifyToken(token: string): SessionPayload | null {
  try {
    const decoded = jwt.verify(token, secret()) as SessionPayload & {
      iat: number;
      exp: number;
    };
    return { userId: decoded.userId, role: decoded.role };
  } catch {
    return null;
  }
}

export function getTokenFromHeaders(headers: Record<string, any>): string | null {
  const auth = headers["authorization"] ?? headers["Authorization"];
  if (!auth || typeof auth !== "string") return null;
  const [scheme, token] = auth.split(" ");
  if (scheme?.toLowerCase() === "bearer" && token) return token;
  return null;
}
