import { createTRPCReact } from "@trpc/react-query";
import { httpBatchLink } from "@trpc/client";
import superjson from "superjson";
import type { AppRouter } from "../../../../server/src/presentation/routers/index";
import { getAuthToken } from "../../store";

export const trpc = createTRPCReact<AppRouter>();

export const trpcClient = trpc.createClient({
  links: [
    httpBatchLink({
      url: import.meta.env.VITE_API_URL || "/api/trpc",
      transformer: superjson,
      headers: () => {
        const token = getAuthToken();
        return token ? { authorization: `Bearer ${token}` } : {};
      },
    }),
  ],
});
