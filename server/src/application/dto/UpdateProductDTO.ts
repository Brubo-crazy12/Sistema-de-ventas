import { z } from "zod";

export const UpdateProductSchema = z.object({
  name: z.string().min(1).optional(),
  description: z.string().optional(),
  price: z.number().positive().optional(),
  stock: z.number().int().nonnegative().optional(),
  categoryId: z.number().int().positive().optional(),
  imageUrl: z.string().url().optional(),
  active: z.number().int().min(0).max(1).optional(),
});

export type UpdateProductDTO = z.infer<typeof UpdateProductSchema>;
