import { initTRPC, TRPCError } from "@trpc/server";
import superjson from "superjson";
import { SaleRepository } from "../infrastructure/persistence/SaleRepository.js";
import { ReinvestmentRepository } from "../infrastructure/persistence/ReinvestmentRepository.js";
import { BusinessSettingsRepository } from "../infrastructure/persistence/BusinessSettingsRepository.js";
import { UserRepository } from "../infrastructure/persistence/UserRepository.js";

export const saleRepository = new SaleRepository();
export const reinvestmentRepository = new ReinvestmentRepository();
export const businessSettingsRepository = new BusinessSettingsRepository();
export const userRepository = new UserRepository();

export interface Context {
  userId?: number;
}

const t = initTRPC.context<Context>().create({ transformer: superjson });

export const publicProcedure = t.procedure;
export const protectedProcedure = t.procedure.use(async ({ ctx, next }) => {
  if (!ctx.userId) {
    throw new TRPCError({ code: "UNAUTHORIZED", message: "Login required" });
  }
  return next({ ctx: { ...ctx, userId: ctx.userId } });
});

export { t };
