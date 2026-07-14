import { z } from "zod";

export const CreateInvestmentSchema = z.object({
  description: z.string().min(1, "Description is required"),
  amount: z.number().positive("Amount must be positive"),
  date: z.string().datetime().optional(),
});

export type CreateInvestmentDTO = z.infer<typeof CreateInvestmentSchema>;
