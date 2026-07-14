import { t, publicProcedure } from "../tRPC.js";
import { checkDatabaseConnection, dbInfo } from "../../infrastructure/config/database.js";

export const systemRouter = t.router({
  status: publicProcedure.query(async () => {
    const database = await checkDatabaseConnection();
    return {
      database,
      info: dbInfo,
      nodeEnv: process.env.NODE_ENV ?? "unset",
      timestamp: new Date().toISOString(),
    };
  }),
});