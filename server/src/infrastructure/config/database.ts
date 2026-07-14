import { drizzle } from "drizzle-orm/node-postgres";
import pg from "pg";
import * as schema from "../persistence/schema.js";

const { Pool } = pg;

const connectionString =
  process.env.DATABASE_URL ||
  process.env.POSTGRES_PRISMA_URL ||
  process.env.POSTGRES_URL;

const isSupabase = !!connectionString && connectionString.includes("supabase");

const pool = new Pool({
  connectionString,
  ...(isSupabase ? { ssl: { rejectUnauthorized: false } } : {}),
});

export const db = drizzle(pool, { schema });
export { pool };
