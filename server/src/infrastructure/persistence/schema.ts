import {
  pgTable,
  serial,
  text,
  integer,
  timestamp,
  real,
  pgEnum,
} from "drizzle-orm/pg-core";

export const saleCategoryEnum = pgEnum("sale_category", [
  "sudaderas",
  "perfumes",
  "accesorios",
]);

export const saleStatusEnum = pgEnum("sale_status", ["pagado", "pendiente"]);

export const users = pgTable("users", {
  id: serial("id").primaryKey(),
  email: text("email").notNull().unique(),
  name: text("name").notNull(),
  passwordHash: text("password_hash").notNull(),
  createdAt: timestamp("created_at").notNull().defaultNow(),
});

export const sales = pgTable("sales", {
  id: serial("id").primaryKey(),
  userId: integer("user_id")
    .notNull()
    .references(() => users.id),
  category: saleCategoryEnum("category").notNull(),
  date: text("date").notNull(),
  client: text("client").notNull(),
  item: text("item").notNull().default(""),
  perfume: text("perfume").notNull().default(""),
  size: text("size").notNull().default(""),
  qty: integer("qty").notNull().default(1),
  price: real("price").notNull().default(0),
  cost: real("cost").notNull().default(0),
  status: saleStatusEnum("status").notNull().default("pagado"),
  paidAmount: real("paid_amount").notNull().default(0),
  dueDate: text("due_date").notNull().default(""),
  refillMl: integer("refill_ml").notNull().default(0),
  createdAt: timestamp("created_at").notNull().defaultNow(),
  updatedAt: timestamp("updated_at").notNull().defaultNow(),
});

export const reinvestments = pgTable("reinvestments", {
  id: serial("id").primaryKey(),
  userId: integer("user_id")
    .notNull()
    .references(() => users.id),
  date: text("date").notNull(),
  models: text("models").notNull().default(""),
  amount: real("amount").notNull().default(0),
  category: saleCategoryEnum("category").notNull().default("sudaderas"),
  qty: integer("qty").notNull().default(0),
  qtyMl: integer("qty_ml").notNull().default(0),
  qty10: integer("qty_10").notNull().default(0),
  qty30: integer("qty_30").notNull().default(0),
  qty60: integer("qty_60").notNull().default(0),
  qty100: integer("qty_100").notNull().default(0),
  createdAt: timestamp("created_at").notNull().defaultNow(),
});

export const businessSettings = pgTable("business_settings", {
  id: serial("id").primaryKey(),
  userId: integer("user_id")
    .notNull()
    .references(() => users.id)
    .unique(),
  sInvested: real("s_invested").notNull().default(4900),
  sStock: integer("s_stock").notNull().default(7),
  sCost: real("s_cost").notNull().default(700),
  pStockMl: integer("p_stock_ml").notNull().default(0),
  pStock10: integer("p_stock_10").notNull().default(0),
  pStock30: integer("p_stock_30").notNull().default(0),
  pStock60: integer("p_stock_60").notNull().default(0),
  pStock100: integer("p_stock_100").notNull().default(0),
  pCostMl: real("p_cost_ml").notNull().default(2),
  pCost10: real("p_cost_10").notNull().default(15),
  pCost30: real("p_cost_30").notNull().default(25),
  pCost60: real("p_cost_60").notNull().default(35),
  pCost100: real("p_cost_100").notNull().default(45),
  pPrice10: real("p_price_10").notNull().default(120),
  pPrice30: real("p_price_30").notNull().default(205),
  pPrice60: real("p_price_60").notNull().default(295),
  pPrice100: real("p_price_100").notNull().default(420),
  pPriceRelleno: real("p_price_relleno").notNull().default(5),
  aInvested: real("a_invested").notNull().default(0),
  aStock: integer("a_stock").notNull().default(0),
  aCost: real("a_cost").notNull().default(0),
  createdAt: timestamp("created_at").notNull().defaultNow(),
  updatedAt: timestamp("updated_at").notNull().defaultNow(),
});
