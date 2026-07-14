import { z } from "zod";

export const UpdateOrderStatusSchema = z.object({
  status: z.enum(["pending", "shipped", "delivered", "cancelled"]),
});

export type UpdateOrderStatusDTO = z.infer<typeof UpdateOrderStatusSchema>;
