import { z } from "zod";

export const CreateCategorySchema = z.object({
  name: z.string().min(1, "Name is required"),
  slug: z.string().min(1, "Slug is required"),
  description: z.string().nullable().optional(),
  imageUrl: z.string().url().nullable().optional(),
});

export type CreateCategoryDTO = z.infer<typeof CreateCategorySchema>;
