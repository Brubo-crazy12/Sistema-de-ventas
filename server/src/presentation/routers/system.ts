import { sql } from "drizzle-orm";
import { t, publicProcedure } from "../tRPC.js";
import { db } from "../../infrastructure/config/database.js";

export const systemRouter = t.router({
  status: publicProcedure.query(async () => {
    const hasDbUrl = !!process.env.DATABASE_URL;
    let canConnect = false;
    let error: string | null = null;
    try {
      await db.execute(sql`select 1`);
      canConnect = true;
    } catch (e: any) {
      error = e?.message || String(e);
    }
    return {
      hasDbUrl,
      canConnect,
      error,
      nodeEnv: process.env.NODE_ENV ?? "unset",
    };
  }),
});
