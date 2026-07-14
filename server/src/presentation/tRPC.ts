import { initTRPC, TRPCError } from "@trpc/server";
import superjson from "superjson";
import { ProductRepository } from "../infrastructure/persistence/ProductRepository.js";
import { OrderRepository } from "../infrastructure/persistence/OrderRepository.js";
import { InvestmentRepository } from "../infrastructure/persistence/InvestmentRepository.js";
import { BusinessSettingsRepository } from "../infrastructure/persistence/BusinessSettingsRepository.js";
import { UserRepository } from "../infrastructure/persistence/UserRepository.js";

export const productRepository = new ProductRepository();
export const orderRepository = new OrderRepository();
export const investmentRepository = new InvestmentRepository();
export const businessSettingsRepository = new BusinessSettingsRepository();
export const userRepository = new UserRepository();

export interface Context {
  userId?: number;
}

const t = initTRPC.context<Context>().create({ transformer: superjson });

export const publicProcedure = t.procedure;
export const protectedProcedure = t.procedure.use(async ({ ctx, next }) => {
  const userId = ctx.userId ?? 1;
  return next({ ctx: { ...ctx, userId } });
});

export { t };
