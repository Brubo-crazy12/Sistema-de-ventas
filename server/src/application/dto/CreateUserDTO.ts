import { z } from "zod";

export const CreateUserSchema = z.object({
  email: z.string().email("Invalid email"),
  name: z.string().min(1, "Name is required"),
  password: z.string().min(6, "Password must be at least 6 characters"),
  role: z.enum(["user", "admin"]).optional(),
});

export type CreateUserDTO = z.infer<typeof CreateUserSchema>;
