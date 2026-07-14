import jwt from "jsonwebtoken";

// Orden de prioridad para el secreto de firma:
// 1) JWT_SECRET explícito (recomendado en producción)
// 2) DATABASE_URL (siempre presente en Vercel) como fallback estable
// 3) secreto inseguro solo en desarrollo local
const JWT_SECRET =
  process.env.JWT_SECRET ||
  process.env.DATABASE_URL ||
  (process.env.NODE_ENV !== "production" ? "dev-insecure-secret-change-me" : "");
const JWT_EXPIRES_IN = process.env.JWT_EXPIRES_IN || "7d";

export interface SessionPayload {
  userId: number;
  role: "admin" | "user";
}

function secret(): string {
  if (JWT_SECRET) return JWT_SECRET;
  throw new Error(
    "JWT_SECRET no está configurado y no hay DATABASE_URL disponible. Defínelo en las variables de entorno (Vercel o server/.env)."
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
