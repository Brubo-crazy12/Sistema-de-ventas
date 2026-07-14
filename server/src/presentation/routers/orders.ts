import { z } from "zod";
import { t, protectedProcedure } from "../tRPC.js";
import { orderRepository } from "../tRPC.js";
import { Order } from "../../domain/entities/Order.js";

const categorySchema = z.enum(["Sudaderas", "Perfumes", "Accesorios"]);
const statusSchema = z.enum(["Pagado", "Pendiente", "Adeudo"]);

const createOrderSchema = z.object({
  client: z.string().min(1),
  category: categorySchema,
  products: z.string().optional(),
  date: z.string(),
  total: z.number().nonnegative(),
  status: statusSchema,
});

export const ordersRouter = t.router({
  list: protectedProcedure.query(async ({ ctx }) => orderRepository.findAll(ctx.userId)),

  create: protectedProcedure.input(createOrderSchema).mutation(async ({ ctx, input }) => {
    const order = Order.create({
      userId: ctx.userId,
      client: input.client,
      category: input.category,
      products: input.products ?? "",
      date: input.date,
      total: input.total,
      status: input.status,
    });
    return orderRepository.save(order);
  }),

  update: protectedProcedure
    .input(z.object({ id: z.number().int().positive() }).merge(createOrderSchema.partial()))
    .mutation(async ({ input }) => {
      const { id, ...data } = input;
      return orderRepository.update(id, data as any);
    }),

  delete: protectedProcedure
    .input(z.object({ id: z.number().int().positive() }))
    .mutation(async ({ input }) => {
      await orderRepository.delete(input.id);
      return { success: true };
    }),
});
