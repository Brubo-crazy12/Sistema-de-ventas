import { z } from "zod";
import { t, protectedProcedure } from "../tRPC.js";
import { reinvestmentRepository } from "../tRPC.js";
import { Reinvestment } from "../../domain/entities/Reinvestment.js";

const createReinvestmentSchema = z.object({
  date: z.string(),
  models: z.string().min(1),
  amount: z.number().nonnegative(),
  category: z.enum(["sudaderas", "perfumes", "accesorios"]),
  qty: z.number().int().nonnegative().optional(),
  qtyMl: z.number().int().nonnegative().optional(),
  qty10: z.number().int().nonnegative().optional(),
  qty30: z.number().int().nonnegative().optional(),
  qty60: z.number().int().nonnegative().optional(),
  qty100: z.number().int().nonnegative().optional(),
});

export const reinvestmentsRouter = t.router({
  list: protectedProcedure.query(async ({ ctx }) => {
    return reinvestmentRepository.findAll(ctx.userId);
  }),

  create: protectedProcedure.input(createReinvestmentSchema).mutation(async ({ ctx, input }) => {
    const r = Reinvestment.create({
      userId: ctx.userId,
      ...input,
      qty: input.qty ?? 0,
      qtyMl: input.qtyMl ?? 0,
      qty10: input.qty10 ?? 0,
      qty30: input.qty30 ?? 0,
      qty60: input.qty60 ?? 0,
      qty100: input.qty100 ?? 0,
    });
    return reinvestmentRepository.save(r);
  }),

  update: protectedProcedure
    .input(z.object({ id: z.number().int().positive() }).merge(createReinvestmentSchema.partial()))
    .mutation(async ({ input }) => {
      const { id, ...data } = input;
      return reinvestmentRepository.update(id, data as any);
    }),

  delete: protectedProcedure
    .input(z.object({ id: z.number().int().positive() }))
    .mutation(async ({ input }) => {
      return reinvestmentRepository.delete(input.id);
    }),
});
