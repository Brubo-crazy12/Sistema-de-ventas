import pg from "pg";
import { readFileSync } from "node:fs";
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

const email = process.argv[2];
if (!email) {
  console.error("Uso: node scripts/make-admin.mjs email@ejemplo.com");
  process.exit(1);
}

if (!process.env.DATABASE_URL) {
  console.error("DATABASE_URL no encontrado en .env");
  process.exit(1);
}

const pool = new Pool({ connectionString: process.env.DATABASE_URL });

async function main() {
  const find = await pool.query("SELECT id, email, role FROM users WHERE email = $1", [email]);
  if (find.rows.length === 0) {
    console.log(`No se encontró ningún usuario con email: ${email}`);
    await pool.end();
    return;
  }
  await pool.query("UPDATE users SET role = 'admin' WHERE email = $1", [email]);
  const updated = await pool.query("SELECT id, email, role FROM users WHERE email = $1", [email]);
  console.log(`Administrador asignado: ${JSON.stringify(updated.rows[0])}`);
  await pool.end();
}

main().catch(async (e) => {
  console.error(e);
  await pool.end();
  process.exit(1);
});
