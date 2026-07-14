import pg from "pg";
import { readFileSync } from "node:fs";
const { Pool } = pg;

function loadEnv() {
  try {
    const raw = readFileSync(".env", "utf8");
    for (const line of raw.split("\n")) {
      const m = line.match(/^([A-Z0-9_]+)=(.*)$/i);
      if (m) process.env[m[1]] = m[2].trim();
    }
  } catch {}
}

loadEnv();

if (!process.env.DATABASE_URL) {
  console.error("DATABASE_URL not found");
  process.exit(1);
}

const pool = new Pool({ connectionString: process.env.DATABASE_URL });

async function main() {
  console.log("Draining database (drop public schema)...");
  await pool.query("DROP SCHEMA public CASCADE;");
  await pool.query("CREATE SCHEMA public;");
  await pool.query("GRANT ALL ON SCHEMA public TO postgres;");
  await pool.query("GRANT ALL ON SCHEMA public TO public;");
  console.log("Database drained. Public schema recreated empty.");
  await pool.end();
}

main().catch(async (e) => {
  console.error(e);
  await pool.end();
  process.exit(1);
});
