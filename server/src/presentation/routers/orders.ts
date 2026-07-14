import { z } from "zod";
import { t, protectedProcedure, adminProcedure } from "../tRPC.js";
import { CreateOrderUseCase } from "../../application/use-cases/orders/CreateOrderUseCase.js";
import { GetOrdersUseCase } from "../../application/use-cases/orders/GetOrdersUseCase.js";
import { UpdateOrderStatusUseCase } from "../../application/use-cases/orders/UpdateOrderStatusUseCase.js";
import { orderRepository, productRepository, cartRepository } from "../tRPC.js";
import { CreateOrderSchema, UpdateOrderStatusSchema } from "../../application/dto/index.js";

const createOrderUseCase = new CreateOrderUseCase(
  orderRepository,
  productRepository,
  cartRepository
);
const getOrdersUseCase = new GetOrdersUseCase(orderRepository);
const updateOrderStatusUseCase = new UpdateOrderStatusUseCase(orderRepository);

export const ordersRouter = t.router({
  list: protectedProcedure.query(async ({ ctx }) => {
    return getOrdersUseCase.executeByUserId(ctx.userId);
  }),

  getById: protectedProcedure
    .input(z.object({ id: z.number().int().positive() }))
    .query(async ({ input }) => {
      return getOrdersUseCase.executeById(input.id);
    }),

  create: protectedProcedure
    .input(CreateOrderSchema)
    .mutation(async ({ ctx, input }) => {
      return createOrderUseCase.execute(ctx.userId, input);
    }),

  listAll: adminProcedure.query(async () => {
    return getOrdersUseCase.execute();
  }),

  updateStatus: adminProcedure
    .input(
      z.object({ id: z.number().int().positive() }).merge(UpdateOrderStatusSchema)
    )
    .mutation(async ({ input }) => {
      const { id, ...data } = input;
      return updateOrderStatusUseCase.execute(id, data);
    }),
});
