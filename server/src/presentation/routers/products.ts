import { z } from "zod";
import { t, publicProcedure, adminProcedure } from "../tRPC.js";
import { GetProductsUseCase } from "../../application/use-cases/products/GetProductsUseCase.js";
import { CreateProductUseCase } from "../../application/use-cases/products/CreateProductUseCase.js";
import { UpdateProductUseCase } from "../../application/use-cases/products/UpdateProductUseCase.js";
import { DeleteProductUseCase } from "../../application/use-cases/products/DeleteProductUseCase.js";
import { productRepository } from "../tRPC.js";
import { CreateProductSchema, UpdateProductSchema } from "../../application/dto/index.js";

const getProductsUseCase = new GetProductsUseCase(productRepository);
const createProductUseCase = new CreateProductUseCase(productRepository);
const updateProductUseCase = new UpdateProductUseCase(productRepository);
const deleteProductUseCase = new DeleteProductUseCase(productRepository);

export const productsRouter = t.router({
  list: publicProcedure.query(async () => {
    return getProductsUseCase.execute();
  }),

  getById: publicProcedure
    .input(z.object({ id: z.number().int().positive() }))
    .query(async ({ input }) => {
      return getProductsUseCase.executeById(input.id);
    }),

  listByCategory: publicProcedure
    .input(z.object({ categoryId: z.number().int().positive() }))
    .query(async ({ input }) => {
      return getProductsUseCase.executeByCategory(input.categoryId);
    }),

  create: adminProcedure
    .input(CreateProductSchema)
    .mutation(async ({ input }) => {
      return createProductUseCase.execute(input);
    }),

  update: adminProcedure
    .input(z.object({ id: z.number().int().positive() }).merge(UpdateProductSchema))
    .mutation(async ({ input }) => {
      const { id, ...data } = input;
      return updateProductUseCase.execute(id, data);
    }),

  delete: adminProcedure
    .input(z.object({ id: z.number().int().positive() }))
    .mutation(async ({ input }) => {
      return deleteProductUseCase.execute(input.id);
    }),
});
