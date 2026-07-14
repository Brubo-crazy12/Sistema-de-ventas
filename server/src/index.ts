import dotenv from "dotenv";
dotenv.config();

import express from "express";
import cors from "cors";
import helmet from "helmet";
import { createExpressMiddleware } from "@trpc/server/adapters/express";
import { appRouter } from "./presentation/routers/index.js";
import { fetchRequestHandler } from "@trpc/server/adapters/fetch";

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
      const userId = req.headers["x-user-id"]
        ? Number(req.headers["x-user-id"])
        : undefined;
      const userRole = req.headers["x-user-role"] as string | undefined;
      return { userId, userRole };
    },
  })
);

app.get("/health", (_req, res) => {
  res.json({ status: "ok", timestamp: new Date().toISOString() });
});

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});

export type { AppRouter } from "./presentation/routers/index.js";
