import { z } from "zod";

export const CreateProductSchema = z.object({
  name: z.string().min(1, "Name is required"),
  description: z.string().optional(),
  price: z.number().positive("Price must be positive"),
  stock: z.number().int().nonnegative("Stock cannot be negative"),
  categoryId: z.number().int().positive("Category ID is required"),
  imageUrl: z.string().url().optional(),
});

export type CreateProductDTO = z.infer<typeof CreateProductSchema>;
