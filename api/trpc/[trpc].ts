import { VercelRequest, VercelResponse } from "@vercel/node";
import { fetchRequestHandler } from "@trpc/server/adapters/fetch";
import { appRouter } from "../../server/src/presentation/routers/index.js";
import { getTokenFromHeaders, verifyToken } from "../../server/src/infrastructure/security/session.js";

export const config = {
  runtime: "nodejs",
};

function normalizeHeaders(headers: VercelRequest["headers"]): Record<string, string> {
  const out: Record<string, string> = {};
  for (const [key, value] of Object.entries(headers)) {
    if (value === undefined) continue;
    out[key] = Array.isArray(value) ? value.join(", ") : value;
  }
  return out;
}

function readRawBody(req: VercelRequest): Promise<string | undefined> {
  if ((req as any).body !== undefined && (req as any).body !== null) {
    const b = (req as any).body;
    return Promise.resolve(typeof b === "string" ? b : JSON.stringify(b));
  }
  return new Promise((resolve, reject) => {
    let data = "";
    req.on("data", (chunk) => (data += chunk));
    req.on("end", () => resolve(data || undefined));
    req.on("error", reject);
  });
}

const handler = async (req: VercelRequest, res: VercelResponse) => {
  const rawBody = await readRawBody(req);
  const url = new URL(req.url!, `https://${req.headers.host}`);
  const request = new Request(url.toString(), {
    method: req.method,
    headers: normalizeHeaders(req.headers) as HeadersInit,
    body: req.method === "GET" || req.method === "HEAD" ? undefined : rawBody,
  });

  try {
    const fetchRes = await fetchRequestHandler({
      endpoint: "/api/trpc",
      req: request,
      router: appRouter,
      createContext: () => {
        const token = getTokenFromHeaders(req.headers as Record<string, any>);
        const session = token ? verifyToken(token) : null;
        return {
          userId: session?.userId ?? 0,
          role: (session?.role ?? "") as "admin" | "user" | "",
        };
      },
    });

    res.status(fetchRes.status);
    fetchRes.headers.forEach((value, key) => {
      res.setHeader(key, value);
    });
    const body = await fetchRes.text();
    res.send(body);
  } catch (error: any) {
    console.error("[trpc] error:", error);
    res.status(500).json({
      error: "Internal server error",
      message: error?.message || String(error),
    });
  }
};

export default handler;
