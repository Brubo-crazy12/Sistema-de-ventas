import "dotenv/config";

import express from "express";
import cors from "cors";
import helmet from "helmet";
import { createExpressMiddleware } from "@trpc/server/adapters/express";
import { appRouter } from "./presentation/routers/index.js";
import { getTokenFromHeaders, verifyToken } from "./infrastructure/security/session.js";

const app = express();
const PORT = process.env.PORT || 3000;

app.use(helmet());
app.use(cors({ origin: process.env.CORS_ORIGIN || "http://localhost:5173" }));
app.use(express.json());

app.use(
  "/trpc",
  createExpressMiddleware({
    router: appRouter,
    createContext: ({ req }) => {
      const token = getTokenFromHeaders(req.headers as Record<string, any>);
      const session = token ? verifyToken(token) : null;
      return {
        userId: session?.userId ?? 0,
        role: (session?.role ?? "") as "admin" | "user" | "",
      };
    },
  })
);

app.get("/health", (_req, res) => {
  res.json({ status: "ok" });
});

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});

export type { AppRouter } from "./presentation/routers/index.js";
