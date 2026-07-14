import { sql } from "drizzle-orm";
import { t, adminProcedure } from "../tRPC.js";
import { db } from "../../infrastructure/config/database.js";
import { users, products, orders, investments } from "../../infrastructure/persistence/schema.js";

export const adminRouter = t.router({
  listUsers: adminProcedure.query(async () => {
    const rows = await db
      .select({
        id: users.id,
        name: users.name,
        email: users.email,
        role: users.role,
        createdAt: users.createdAt,
      })
      .from(users)
      .orderBy(users.createdAt);

    const [productCount, orderCount, investmentSum] = await Promise.all([
      db.select({ value: sql<number>`count(*)` }).from(products),
      db.select({ value: sql<number>`count(*)` }).from(orders),
      db.select({ value: sql<number>`coalesce(sum(amount),0)` }).from(investments),
    ]);

    return {
      users: rows,
      totals: {
        users: rows.length,
        products: Number(productCount[0]?.value ?? 0),
        orders: Number(orderCount[0]?.value ?? 0),
        invested: Number(investmentSum[0]?.value ?? 0),
      },
    };
  }),

  stats: adminProcedure.query(async () => {
    const [userCount, productCount, orderCount, revenue, investmentSum] = await Promise.all([
      db.select({ value: sql<number>`count(*)` }).from(users),
      db.select({ value: sql<number>`count(*)` }).from(products),
      db.select({ value: sql<number>`count(*)` }).from(orders),
      db.select({ value: sql<number>`coalesce(sum(total),0)` }).from(orders),
      db.select({ value: sql<number>`coalesce(sum(amount),0)` }).from(investments),
    ]);

    return {
      users: Number(userCount[0]?.value ?? 0),
      products: Number(productCount[0]?.value ?? 0),
      orders: Number(orderCount[0]?.value ?? 0),
      revenue: Number(revenue[0]?.value ?? 0),
      invested: Number(investmentSum[0]?.value ?? 0),
    };
  }),
});
