import { t } from "../tRPC.js";
import { salesRouter } from "./sales.js";
import { reinvestmentsRouter } from "./reinvestments.js";
import { settingsRouter } from "./settings.js";
import { dashboardRouter } from "./dashboard.js";

export const appRouter = t.router({
  sales: salesRouter,
  reinvestments: reinvestmentsRouter,
  settings: settingsRouter,
  dashboard: dashboardRouter,
});

export type AppRouter = typeof appRouter;
