import {
  pgTable,
  serial,
  text,
  integer,
  timestamp,
  real,
  pgEnum,
} from "drizzle-orm/pg-core";

export const categoryEnum = pgEnum("category", ["Sudaderas", "Perfumes", "Accesorios"]);
export const orderStatusEnum = pgEnum("order_status", ["Pagado", "Pendiente", "Adeudo"]);
export const stockStatusEnum = pgEnum("stock_status", ["En stock", "Stock bajo", "Sin stock"]);

export const users = pgTable("users", {
  id: serial("id").primaryKey(),
  email: text("email").notNull().unique(),
  name: text("name").notNull(),
  passwordHash: text("password_hash").notNull(),
  createdAt: timestamp("created_at").notNull().defaultNow(),
});

export const products = pgTable("products", {
  id: serial("id").primaryKey(),
  userId: integer("user_id")
    .notNull()
    .references(() => users.id),
  name: text("name").notNull(),
  sku: text("sku").notNull().unique(),
  category: categoryEnum("category").notNull(),
  price: real("price").notNull().default(0),
  qty: integer("qty").notNull().default(0),
  stockStatus: stockStatusEnum("stock_status").notNull().default("En stock"),
  createdAt: timestamp("created_at").notNull().defaultNow(),
  updatedAt: timestamp("updated_at").notNull().defaultNow(),
});

export const orders = pgTable("orders", {
  id: serial("id").primaryKey(),
  userId: integer("user_id")
    .notNull()
    .references(() => users.id),
  orderCode: text("order_code").notNull().unique(),
  client: text("client").notNull(),
  category: categoryEnum("category").notNull().default("Sudaderas"),
  products: text("products").notNull().default(""),
  date: text("date").notNull(),
  total: real("total").notNull().default(0),
  status: orderStatusEnum("status").notNull().default("Pendiente"),
  createdAt: timestamp("created_at").notNull().defaultNow(),
  updatedAt: timestamp("updated_at").notNull().defaultNow(),
});

export const investments = pgTable("investments", {
  id: serial("id").primaryKey(),
  userId: integer("user_id")
    .notNull()
    .references(() => users.id),
  month: text("month").notNull(),
  amount: real("amount").notNull().default(0),
  createdAt: timestamp("created_at").notNull().defaultNow(),
});

export const businessSettings = pgTable("business_settings", {
  id: serial("id").primaryKey(),
  userId: integer("user_id")
    .notNull()
    .references(() => users.id)
    .unique(),
  businessName: text("business_name").notNull().default("Mi Emprendimiento"),
  email: text("email").notNull().default(""),
  currency: text("currency").notNull().default("MXN"),
  createdAt: timestamp("created_at").notNull().defaultNow(),
  updatedAt: timestamp("updated_at").notNull().defaultNow(),
});
