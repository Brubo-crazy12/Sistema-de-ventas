import { initTRPC, TRPCError } from "@trpc/server";
import superjson from "superjson";
import { db } from "../infrastructure/config/database.js";
import { ProductRepository } from "../infrastructure/persistence/ProductRepository.js";
import { OrderRepository } from "../infrastructure/persistence/OrderRepository.js";
import { UserRepository } from "../infrastructure/persistence/UserRepository.js";
import { CategoryRepository } from "../infrastructure/persistence/CategoryRepository.js";
import { CartRepository } from "../infrastructure/persistence/CartRepository.js";
import { InvestmentRepository } from "../infrastructure/persistence/InvestmentRepository.js";

export const productRepository = new ProductRepository();
export const orderRepository = new OrderRepository();
export const userRepository = new UserRepository();
export const categoryRepository = new CategoryRepository();
export const cartRepository = new CartRepository();
export const investmentRepository = new InvestmentRepository();

export interface Context {
  userId?: number;
  userRole?: string;
}

const t = initTRPC.context<Context>().create({
  transformer: superjson,
});

const publicProcedure = t.procedure;
const protectedProcedure = t.procedure.use(async ({ ctx, next }) => {
  if (!ctx.userId) {
    throw new TRPCError({
      code: "UNAUTHORIZED",
      message: "You must be logged in",
    });
  }
  return next({ ctx: { ...ctx, userId: ctx.userId } });
});

const adminProcedure = t.procedure.use(async ({ ctx, next }) => {
  if (!ctx.userId || ctx.userRole !== "admin") {
    throw new TRPCError({
      code: "FORBIDDEN",
      message: "Admin access required",
    });
  }
  return next({ ctx: { ...ctx, userId: ctx.userId } });
});

export { t, publicProcedure, protectedProcedure, adminProcedure };
