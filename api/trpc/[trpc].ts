import { VercelRequest, VercelResponse } from "@vercel/node";
import { fetchRequestHandler } from "@trpc/server/adapters/fetch";
import { appRouter } from "../../server/src/presentation/routers/index.js";
import { getTokenFromHeaders, verifyToken } from "../../server/src/infrastructure/security/session.js";

export const config = {
  runtime: "nodejs20.x",
};

const handler = (req: VercelRequest, res: VercelResponse) => {
  const url = new URL(req.url!, `https://${req.headers.host}`);

  return fetchRequestHandler({
    endpoint: "/api/trpc",
    req: {
      method: req.method,
      headers: Object.fromEntries(
        Object.entries(req.headers).filter(([, v]) => v !== undefined)
      ) as HeadersInit,
      url: url.pathname + url.search,
      json: () => Promise.resolve(req.body),
    } as any,
    router: appRouter,
    createContext: () => {
      const token = getTokenFromHeaders(req.headers as Record<string, any>);
      const session = token ? verifyToken(token) : null;
      return {
        userId: session?.userId ?? 0,
        role: (session?.role ?? "") as "admin" | "user" | "",
      };
    },
  })
    .then((fetchRes) => {
      res.status(fetchRes.status);
      fetchRes.headers.forEach((value, key) => {
        res.setHeader(key, value);
      });
      return fetchRes.text();
    })
    .then((body) => {
      res.send(body);
    })
    .catch((error) => {
      res.status(500).json({
        error: "Internal server error",
        message: error?.message || String(error),
      });
    });
};

export default handler;
