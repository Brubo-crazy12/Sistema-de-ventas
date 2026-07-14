import { drizzle } from "drizzle-orm/node-postgres";
import pg from "pg";
import * as schema from "../persistence/schema.js";

const { Pool } = pg;

const connectionString =
  process.env.DATABASE_URL ||
  process.env.POSTGRES_PRISMA_URL ||
  process.env.POSTGRES_URL ||
  "";

const isSupabase = connectionString.includes("supabase");

function cleanSupabaseUrl(url: string): string {
  if (!url.includes("?")) return url;
  const [base, query] = url.split("?");
  const params = new URLSearchParams(query);
  params.delete("sslmode");
  params.delete("pgbouncer");
  params.delete("supa");
  const q = params.toString();
  return q ? `${base}?${q}` : base;
}

const pool = new Pool({
  connectionString: isSupabase ? cleanSupabaseUrl(connectionString) : connectionString,
  ...(isSupabase ? { ssl: { rejectUnauthorized: false } } : {}),
});

export const db = drizzle(pool, { schema });
export { pool };

