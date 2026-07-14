import { z } from "zod";

export const CreateOrderSchema = z.object({
  shippingAddress: z.string().optional(),
  items: z.array(
    z.object({
      productId: z.number().int().positive(),
      quantity: z.number().int().positive(),
    })
  ).min(1, "Order must have at least one item"),
});

export type CreateOrderDTO = z.infer<typeof CreateOrderSchema>;
