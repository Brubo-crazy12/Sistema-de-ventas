import { drizzle } from "drizzle-orm/node-postgres";
import { sql } from "drizzle-orm";
import pg from "pg";
import * as schema from "../persistence/schema.js";

const { Pool } = pg;

const connectionString =
  process.env.DATABASE_URL ||
  process.env.POSTGRES_PRISMA_URL ||
  process.env.POSTGRES_URL ||
  process.env.SUPABASE_DB_URL ||
  "";

export type DatabaseProvider = "supabase" | "postgres" | "unknown";

export interface DbInfo {
  configured: boolean;
  provider: DatabaseProvider;
  host: string | null;
  port: string | null;
  ssl: boolean;
  maxConnections: number;
}

export interface DbHealth {
  connected: boolean;
  message: string;
  latencyMs: number | null;
  provider: DatabaseProvider;
  configured: boolean;
}

function detectProvider(url: string): DatabaseProvider {
  if (!url) return "unknown";
  if (url.includes("supabase")) return "supabase";
  return "postgres";
}

function parseHost(url: string): { host: string | null; port: string | null } {
  if (!url) return { host: null, port: null };
  try {
    const u = new URL(url);
    return { host: u.hostname, port: u.port };
  } catch {
    return { host: null, port: null };
  }
}

const provider = detectProvider(connectionString);
const isRemote = provider !== "unknown";
const isSupabase = provider === "supabase";

const MAX_CONNECTIONS = Number(process.env.PG_MAX_CONNECTIONS) || (process.env.NODE_ENV === "production" ? 5 : 10);
const CONNECTION_TIMEOUT_MS = Number(process.env.PG_CONNECTION_TIMEOUT_MS) || 10000;
const IDLE_TIMEOUT_MS = Number(process.env.PG_IDLE_TIMEOUT_MS) || 30000;

const { host, port } = parseHost(connectionString);

export const dbInfo: DbInfo = {
  configured: Boolean(connectionString),
  provider,
  host,
  port,
  ssl: isRemote,
  maxConnections: MAX_CONNECTIONS,
};

function createPool() {
  if (!connectionString) {
    throw new Error(
      "DATABASE_URL no está configurada. Define DATABASE_URL en las variables de entorno de Vercel (o localmente en server/.env)."
    );
  }

  return new Pool({
    connectionString,
    max: MAX_CONNECTIONS,
    connectionTimeoutMillis: CONNECTION_TIMEOUT_MS,
    idleTimeoutMillis: IDLE_TIMEOUT_MS,
    ...(isRemote ? { ssl: { rejectUnauthorized: false } } : {}),
  });
}

const globalForDb = globalThis as unknown as { __pgPool?: pg.Pool };

const pool = globalForDb.__pgPool ?? createPool();

if (process.env.NODE_ENV !== "production") {
  globalForDb.__pgPool = pool;
}

export const db = drizzle(pool, { schema });
export { pool };

export async function checkDatabaseConnection(): Promise<DbHealth> {
  const start = Date.now();
  try {
    if (!connectionString) {
      return {
        connected: false,
        message: "DATABASE_URL no configurada.",
        latencyMs: null,
        provider,
        configured: false,
      };
    }
    await db.execute(sql`select 1`);
    return {
      connected: true,
      message: "Conexión a la base de datos exitosa.",
      latencyMs: Date.now() - start,
      provider,
      configured: true,
    };
  } catch (error: any) {
    return {
      connected: false,
      message: error?.message || String(error),
      latencyMs: null,
      provider,
      configured: Boolean(connectionString),
    };
  }
}
