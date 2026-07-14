import { z } from "zod";
import { TRPCError } from "@trpc/server";
import { t, publicProcedure, protectedProcedure, userRepository } from "../tRPC.js";
import { User } from "../../domain/entities/User.js";
import { hashPassword, verifyPassword } from "../../infrastructure/security/password.js";
import { signToken } from "../../infrastructure/security/session.js";

function isBootstrapAdmin(email: string): boolean {
  const adminEmail = process.env.ADMIN_EMAIL?.trim().toLowerCase();
  return Boolean(adminEmail && email.trim().toLowerCase() === adminEmail);
}

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

      const userCount = await userRepository.count();
      const role: "admin" | "user" =
        userCount === 0 || isBootstrapAdmin(input.email) ? "admin" : "user";

      const user = User.create({
        name: input.name,
        email: input.email,
        passwordHash: hashPassword(input.password),
        role,
      });
      const saved = await userRepository.save(user);
      const token = signToken({ userId: saved.id, role: saved.role });
      return { user: saved.toJSON(), token, role: saved.role };
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
      const token = signToken({ userId: user.id, role: user.role });
      return { user: user.toJSON(), token, role: user.role };
    }),

  me: protectedProcedure.query(async ({ ctx }) => {
    const user = await userRepository.findById(ctx.userId);
    if (!user) {
      throw new TRPCError({ code: "NOT_FOUND", message: "Usuario no encontrado" });
    }
    return user.toJSON();
  }),
});
