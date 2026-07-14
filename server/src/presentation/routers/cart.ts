import { z } from "zod";
import { t, protectedProcedure } from "../tRPC.js";
import { AddToCartUseCase } from "../../application/use-cases/cart/AddToCartUseCase.js";
import { RemoveFromCartUseCase } from "../../application/use-cases/cart/RemoveFromCartUseCase.js";
import { GetCartUseCase } from "../../application/use-cases/cart/GetCartUseCase.js";
import { UpdateCartQuantityUseCase } from "../../application/use-cases/cart/UpdateCartQuantityUseCase.js";
import { cartRepository, productRepository } from "../tRPC.js";
import { AddToCartSchema } from "../../application/dto/index.js";

const addToCartUseCase = new AddToCartUseCase(cartRepository, productRepository);
const removeFromCartUseCase = new RemoveFromCartUseCase(cartRepository);
const getCartUseCase = new GetCartUseCase(cartRepository, productRepository);
const updateCartQuantityUseCase = new UpdateCartQuantityUseCase(
  cartRepository,
  productRepository
);

export const cartRouter = t.router({
  getItems: protectedProcedure.query(async ({ ctx }) => {
    return getCartUseCase.execute(ctx.userId);
  }),

  addItem: protectedProcedure
    .input(AddToCartSchema)
    .mutation(async ({ ctx, input }) => {
      return addToCartUseCase.execute(ctx.userId, input);
    }),

  removeItem: protectedProcedure
    .input(z.object({ id: z.number().int().positive() }))
    .mutation(async ({ input }) => {
      return removeFromCartUseCase.execute(input.id);
    }),

  updateQuantity: protectedProcedure
    .input(
      z.object({
        id: z.number().int().positive(),
        quantity: z.number().int().positive(),
      })
    )
    .mutation(async ({ input }) => {
      return updateCartQuantityUseCase.execute(input.id, input.quantity);
    }),

  clear: protectedProcedure.mutation(async ({ ctx }) => {
    return removeFromCartUseCase.executeByUserId(ctx.userId);
  }),
});
