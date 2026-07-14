import { z } from "zod";

export const AddToCartSchema = z.object({
  productId: z.number().int().positive("Product ID is required"),
  quantity: z.number().int().positive("Quantity must be positive"),
});

export type AddToCartDTO = z.infer<typeof AddToCartSchema>;
