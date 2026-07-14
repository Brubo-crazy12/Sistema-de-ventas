import { t } from "../tRPC.js";
import { productsRouter } from "./products.js";
import { ordersRouter } from "./orders.js";
import { investmentsRouter } from "./investments.js";
import { settingsRouter } from "./settings.js";
import { dashboardRouter } from "./dashboard.js";

export const appRouter = t.router({
  products: productsRouter,
  orders: ordersRouter,
  investments: investmentsRouter,
  settings: settingsRouter,
  dashboard: dashboardRouter,
});

export type AppRouter = typeof appRouter;
