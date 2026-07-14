import type { VercelRequest, VercelResponse } from "@vercel/node";
import {
  checkDatabaseConnection,
  dbInfo,
} from "../server/src/infrastructure/config/database.js";

const handler = async (_req: VercelRequest, res: VercelResponse) => {
  try {
    const database = await checkDatabaseConnection();
    const statusCode = database.connected ? 200 : 503;

    res.status(statusCode).json({
      status: database.connected ? "ok" : "error",
      database,
      info: dbInfo,
      timestamp: new Date().toISOString(),
    });
  } catch (error: any) {
    res.status(503).json({
      status: "error",
      message: error?.message || String(error),
      timestamp: new Date().toISOString(),
    });
  }
};

export default handler;
