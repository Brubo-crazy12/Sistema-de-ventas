import { z } from "zod";
import { t, protectedProcedure } from "../tRPC.js";
import { productRepository } from "../tRPC.js";
import { Product } from "../../domain/entities/Product.js";

const categorySchema = z.enum(["Sudaderas", "Perfumes", "Accesorios"]);
const stockStatusSchema = z.enum(["En stock", "Stock bajo", "Sin stock"]);

const createProductSchema = z.object({
  name: z.string().min(1),
  sku: z.string().min(1),
  category: categorySchema,
  price: z.number().nonnegative(),
  qty: z.number().int().nonnegative(),
  stockStatus: stockStatusSchema.optional(),
});

export const productsRouter = t.router({
  list: protectedProcedure.query(async ({ ctx }) => productRepository.findAll(ctx.userId)),
  listByCategory: protectedProcedure
    .input(z.object({ category: categorySchema }))
    .query(async ({ ctx, input }) => productRepository.findByCategory(ctx.userId, input.category)),
  create: protectedProcedure.input(createProductSchema).mutation(async ({ ctx, input }) => {
    const product = Product.create({
      userId: ctx.userId,
      name: input.name,
      sku: input.sku,
      category: input.category,
      price: input.price,
      qty: input.qty,
      stockStatus: input.stockStatus ?? "En stock",
    });
    return productRepository.save(product);
  }),
  update: protectedProcedure
    .input(z.object({ id: z.number().int().positive() }).merge(createProductSchema.partial()))
    .mutation(async ({ input }) => {
      const { id, ...data } = input;
      return productRepository.update(id, data as any);
    }),
  delete: protectedProcedure
    .input(z.object({ id: z.number().int().positive() }))
    .mutation(async ({ input }) => {
      await productRepository.delete(input.id);
      return { success: true };
    }),
});
