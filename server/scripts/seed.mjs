import pg from "pg";
import { readFileSync } from "node:fs";
import { scryptSync, randomBytes } from "node:crypto";
const { Pool } = pg;

function hashPassword(password) {
  const salt = randomBytes(16).toString("hex");
  const hash = scryptSync(password, salt, 64).toString("hex");
  return `${salt}:${hash}`;
}

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

const pool = new Pool({ connectionString: process.env.DATABASE_URL });

const products = [
  ["Sudadera Oversize", "SUD-OVS-01", "Sudaderas", 320, 48, "En stock"],
  ["Sudadera Básica", "SUD-BAS-02", "Sudaderas", 280, 7, "Stock bajo"],
  ["Perfume 30ml", "PER-030-01", "Perfumes", 320, 32, "En stock"],
  ["Perfume 60ml", "PER-060-02", "Perfumes", 360, 0, "Sin stock"],
  ["Perfume 100ml", "PER-100-03", "Perfumes", 480, 19, "En stock"],
  ["Anillo Acero", "ACC-ANI-01", "Accesorios", 150, 5, "Stock bajo"],
  ["Collar Cadena", "ACC-COL-02", "Accesorios", 190, 24, "En stock"],
  ["Pulsera Cuero", "ACC-PUL-03", "Accesorios", 130, 0, "Sin stock"],
];

const orders = [
  ["ORD-1042", "María López", "Sudaderas", "Sudadera Oversize x2", "12 Jul", 640, "Pagado"],
  ["ORD-1041", "Carlos Ruiz", "Perfumes", "Perfume 30ml x1", "12 Jul", 320, "Pendiente"],
  ["ORD-1040", "Ana Torres", "Accesorios", "Anillo acero x3", "11 Jul", 450, "Pagado"],
  ["ORD-1039", "Luis Vega", "Sudaderas", "Sudadera Básica x1", "11 Jul", 280, "Adeudo"],
  ["ORD-1038", "Sofía Ramos", "Perfumes", "Perfume 60ml x2", "10 Jul", 720, "Pagado"],
  ["ORD-1037", "Diego Cruz", "Accesorios", "Collar x1", "10 Jul", 190, "Pendiente"],
  ["ORD-1036", "Elena Díaz", "Sudaderas", "Sudadera Oversize x1", "09 Jul", 320, "Pagado"],
  ["ORD-1035", "Pablo Soto", "Perfumes", "Perfume 100ml x1", "09 Jul", 480, "Pagado"],
];

const investments = [
  ["Ene", 3000],
  ["Feb", 2500],
  ["Mar", 4000],
  ["Abr", 2000],
  ["May", 3500],
  ["Jun", 3500],
];

async function main() {
  await pool.query(
    "INSERT INTO users (id, email, name, password_hash) VALUES (1, 'demo@monitor.io', 'Demo', $1) ON CONFLICT (id) DO NOTHING;",
    [hashPassword("demo1234")]
  );
  await pool.query("SELECT setval('users_id_seq', (SELECT COALESCE(MAX(id), 1) FROM users));");
  await pool.query(
    "INSERT INTO business_settings (user_id, business_name, email, currency) VALUES (1, 'Mi Emprendimiento', 'hola@empredimiento.io', 'MXN') ON CONFLICT (user_id) DO NOTHING;"
  );

  for (const [name, sku, category, price, qty, stock] of products) {
    await pool.query(
      "INSERT INTO products (user_id, name, sku, category, price, qty, stock_status) VALUES ($1,$2,$3,$4,$5,$6,$7)",
      [1, name, sku, category, price, qty, stock]
    );
  }

  for (const [code, client, category, productsDesc, date, total, status] of orders) {
    await pool.query(
      "INSERT INTO orders (user_id, order_code, client, category, products, date, total, status) VALUES ($1,$2,$3,$4,$5,$6,$7,$8)",
      [1, code, client, category, productsDesc, date, total, status]
    );
  }

  for (const [month, amount] of investments) {
    await pool.query(
      "INSERT INTO investments (user_id, month, amount) VALUES ($1,$2,$3)",
      [1, month, amount]
    );
  }

  const u = await pool.query("SELECT COUNT(*) FROM products");
  const o = await pool.query("SELECT COUNT(*) FROM orders");
  const i = await pool.query("SELECT COUNT(*) FROM investments");
  console.log(`Seeded: ${u.rows[0].count} products, ${o.rows[0].count} orders, ${i.rows[0].count} investments.`);
  await pool.end();
}

main().catch(async (e) => {
  console.error(e);
  await pool.end();
  process.exit(1);
});
