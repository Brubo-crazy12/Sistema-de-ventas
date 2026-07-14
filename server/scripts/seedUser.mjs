import pg from "pg";
import { readFileSync } from "node:fs";
import { scryptSync, randomBytes } from "node:crypto";
const { Pool } = pg;

function loadEnv() {
  try {
    const raw = readFileSync(".env", "utf8");
    for (const line of raw.split("\n")) {
      const m = line.match(/^([A-Z0-9_]+)=(.*)$/i);
      if (m && !process.env[m[1]]) process.env[m[1]] = m[2].trim();
    }
  } catch {}
}
loadEnv();

if (!process.env.DATABASE_URL) {
  console.error("DATABASE_URL not found in .env");
  process.exit(1);
}

const pool = new Pool({ connectionString: process.env.DATABASE_URL });

function hashPassword(password) {
  const salt = randomBytes(16).toString("hex");
  const hash = scryptSync(password, salt, 64).toString("hex");
  return `${salt}:${hash}`;
}

async function main() {
  const hash = hashPassword("demo1234");
  await pool.query(
    `INSERT INTO users (id, email, name, password_hash, role)
     VALUES (1, 'demo@monitor.io', 'Demo', $1, 'admin')
     ON CONFLICT (id) DO UPDATE SET
        password_hash = EXCLUDED.password_hash,
        email = EXCLUDED.email,
        name = EXCLUDED.name,
        role = 'admin';`,
    [hash]
  );
  console.log("Usuario listo: demo@monitor.io / demo1234");
  await pool.end();
}

main().catch(async (e) => {
  console.error(e);
  await pool.end();
  process.exit(1);
});
