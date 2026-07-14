import { z } from "zod";
import { t, protectedProcedure } from "../tRPC.js";
import { investmentRepository } from "../tRPC.js";
import { Investment } from "../../domain/entities/Investment.js";

const createInvestmentSchema = z.object({
  month: z.string().min(1),
  amount: z.number().nonnegative(),
});

export const investmentsRouter = t.router({
  list: protectedProcedure.query(async ({ ctx }) => investmentRepository.findAll(ctx.userId)),

  create: protectedProcedure.input(createInvestmentSchema).mutation(async ({ ctx, input }) => {
    const inv = Investment.create({ userId: ctx.userId, month: input.month, amount: input.amount });
    return investmentRepository.save(inv);
  }),

  update: protectedProcedure
    .input(z.object({ id: z.number().int().positive() }).merge(createInvestmentSchema.partial()))
    .mutation(async ({ input }) => {
      const { id, ...data } = input;
      return investmentRepository.update(id, data as any);
    }),

  delete: protectedProcedure
    .input(z.object({ id: z.number().int().positive() }))
    .mutation(async ({ input }) => {
      await investmentRepository.delete(input.id);
      return { success: true };
    }),
});
