import { z } from "zod";
import { t, protectedProcedure } from "../tRPC.js";
import { saleRepository } from "../tRPC.js";
import { Sale } from "../../domain/entities/Sale.js";

const saleCategorySchema = z.enum(["sudaderas", "perfumes", "accesorios"]);
const saleStatusSchema = z.enum(["pagado", "pendiente"]);

const createSaleSchema = z.object({
  category: saleCategorySchema,
  date: z.string(),
  client: z.string().min(1),
  item: z.string().optional(),
  perfume: z.string().optional(),
  size: z.string().optional(),
  qty: z.number().int().positive(),
  price: z.number().nonnegative(),
  cost: z.number().nonnegative(),
  status: saleStatusSchema,
  paidAmount: z.number().nonnegative().optional(),
  dueDate: z.string().optional(),
  refillMl: z.number().int().nonnegative().optional(),
});

export const salesRouter = t.router({
  list: protectedProcedure.query(async ({ ctx }) => {
    return saleRepository.findAll(ctx.userId);
  }),

  listByCategory: protectedProcedure
    .input(z.object({ category: saleCategorySchema }))
    .query(async ({ ctx, input }) => {
      return saleRepository.findByCategory(ctx.userId, input.category);
    }),

  create: protectedProcedure.input(createSaleSchema).mutation(async ({ ctx, input }) => {
    const sale = Sale.create({
      userId: ctx.userId,
      category: input.category,
      date: input.date,
      client: input.client,
      item: input.item ?? "",
      perfume: input.perfume ?? "",
      size: input.size ?? "",
      qty: input.qty,
      price: input.price,
      cost: input.cost,
      status: input.status,
      paidAmount: input.status === "pagado" ? input.price * input.qty : (input.paidAmount ?? 0),
      dueDate: input.dueDate ?? "",
      refillMl: input.refillMl ?? 0,
    });
    return saleRepository.save(sale);
  }),

  update: protectedProcedure
    .input(z.object({ id: z.number().int().positive() }).merge(createSaleSchema.partial()))
    .mutation(async ({ input }) => {
      const { id, ...data } = input;
      return saleRepository.update(id, data as any);
    }),

  delete: protectedProcedure
    .input(z.object({ id: z.number().int().positive() }))
    .mutation(async ({ input }) => {
      return saleRepository.delete(input.id);
    }),

  addPayment: protectedProcedure
    .input(z.object({ id: z.number().int().positive(), amount: z.number().positive() }))
    .mutation(async ({ input }) => {
      const sale = await saleRepository.findById(input.id);
      if (!sale) throw new Error("Sale not found");
      const newPaid = sale.paidAmount + input.amount;
      const newStatus = newPaid >= sale.revenue ? "pagado" : "pendiente";
      return saleRepository.update(input.id, {
        paidAmount: newPaid,
        status: newStatus as any,
      });
    }),
});
