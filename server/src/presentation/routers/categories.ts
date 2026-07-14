import { z } from "zod";
import { t, publicProcedure, adminProcedure } from "../tRPC.js";
import { categoryRepository } from "../tRPC.js";
import { Category } from "../../domain/entities/Category.js";
import { CreateCategorySchema } from "../../application/dto/index.js";

export const categoriesRouter = t.router({
  list: publicProcedure.query(async () => {
    return categoryRepository.findAll();
  }),

  getById: publicProcedure
    .input(z.object({ id: z.number().int().positive() }))
    .query(async ({ input }) => {
      return categoryRepository.findById(input.id);
    }),

  create: adminProcedure
    .input(CreateCategorySchema)
    .mutation(async ({ input }) => {
      const category = Category.create({
        name: input.name,
        slug: input.slug,
        description: input.description ?? null,
        imageUrl: input.imageUrl ?? null,
      });
      return categoryRepository.save(category);
    }),
});
