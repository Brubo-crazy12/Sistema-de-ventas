import { VercelRequest, VercelResponse } from "@vercel/node";
import { fetchRequestHandler } from "@trpc/server/adapters/fetch";
import { appRouter } from "../../server/src/presentation/routers/index.js";

const handler = (req: VercelRequest, res: VercelResponse) => {
  const url = new URL(req.url!, `https://${req.headers.host}`);

  fetchRequestHandler({
    endpoint: "/api/trpc",
    req: {
      method: req.method,
      headers: Object.fromEntries(
        Object.entries(req.headers).filter(([_, v]) => v !== undefined)
      ) as HeadersInit,
      url: url.pathname + url.search,
      json: () => Promise.resolve(req.body),
    } as any,
    router: appRouter,
    createContext: () => ({
      userId: req.headers["x-user-id"]
        ? Number(req.headers["x-user-id"])
        : undefined,
      userRole: req.headers["x-user-role"] as string | undefined,
    }),
    onError:
      process.env.NODE_ENV === "development"
        ? ({ error }) => {
            console.error("tRPC Error:", error);
          }
        : undefined,
  }).then((fetchRes) => {
    res.status(fetchRes.status);
    fetchRes.headers.forEach((value, key) => {
      res.setHeader(key, value);
    });
    fetchRes.text().then((body) => {
      res.send(body);
    });
  });
};

export default handler;
