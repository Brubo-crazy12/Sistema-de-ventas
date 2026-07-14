import { z } from "zod";
import { TRPCError } from "@trpc/server";
import { t, publicProcedure, userRepository } from "../tRPC.js";
import { User } from "../../domain/entities/User.js";
import { hashPassword, verifyPassword } from "../../infrastructure/security/password.js";

export const authRouter = t.router({
  register: publicProcedure
    .input(
      z.object({
        name: z.string().min(2, "El nombre es muy corto"),
        email: z.string().email("Email inválido"),
        password: z.string().min(6, "La contraseña debe tener al menos 6 caracteres"),
      })
    )
    .mutation(async ({ input }) => {
      const existing = await userRepository.findByEmail(input.email);
      if (existing) {
        throw new TRPCError({
          code: "CONFLICT",
          message: "Este email ya está registrado",
        });
      }
      const user = User.create({
        name: input.name,
        email: input.email,
        passwordHash: hashPassword(input.password),
      });
      const saved = await userRepository.save(user);
      return saved.toJSON();
    }),

  login: publicProcedure
    .input(
      z.object({
        email: z.string().email("Email inválido"),
        password: z.string().min(1, "Ingresa tu contraseña"),
      })
    )
    .mutation(async ({ input }) => {
      const user = await userRepository.findByEmail(input.email);
      if (!user || !verifyPassword(input.password, user.passwordHash)) {
        throw new TRPCError({
          code: "UNAUTHORIZED",
          message: "Credenciales inválidas",
        });
      }
      return user.toJSON();
    }),
});
