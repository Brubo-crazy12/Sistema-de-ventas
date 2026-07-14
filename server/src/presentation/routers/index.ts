import { t } from "../tRPC.js";
import { productsRouter } from "./products.js";
import { categoriesRouter } from "./categories.js";
import { cartRouter } from "./cart.js";
import { ordersRouter } from "./orders.js";
import { investmentsRouter } from "./investments.js";
import { analyticsRouter } from "./analytics.js";

export const appRouter = t.router({
  products: productsRouter,
  categories: categoriesRouter,
  cart: cartRouter,
  orders: ordersRouter,
  investments: investmentsRouter,
  analytics: analyticsRouter,
});

export type AppRouter = typeof appRouter;
