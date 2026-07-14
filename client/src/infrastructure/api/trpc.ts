import { createTRPCReact } from "@trpc/react-query";
import { httpBatchLink } from "@trpc/client";
import superjson from "superjson";
import type { AppRouter } from "../../../../server/src/presentation/routers/index";

export const trpc = createTRPCReact<AppRouter>();

export const trpcClient = trpc.createClient({
  links: [
    httpBatchLink({
      url: import.meta.env.VITE_API_URL || "/api/trpc",
      transformer: superjson,
      headers: () => {
        try {
          const raw = localStorage.getItem("monitor_user");
          if (!raw) return {};
          const u = JSON.parse(raw);
          return u?.id ? { "x-user-id": String(u.id) } : {};
        } catch {
          return {};
        }
      },
    }),
  ],
});
