import { z } from "zod";
import { t, protectedProcedure } from "../tRPC.js";
import { businessSettingsRepository } from "../tRPC.js";

const updateSettingsSchema = z.object({
  businessName: z.string().optional(),
  email: z.string().optional(),
  currency: z.string().optional(),
});

export const settingsRouter = t.router({
  get: protectedProcedure.query(async ({ ctx }) => {
    let settings = await businessSettingsRepository.findByUserId(ctx.userId);
    if (!settings) {
      const { BusinessSettings } = await import("../../domain/entities/BusinessSettings.js");
      settings = BusinessSettings.create(ctx.userId);
      await businessSettingsRepository.save(settings);
    }
    return settings;
  }),

  update: protectedProcedure.input(updateSettingsSchema).mutation(async ({ ctx, input }) => {
    return businessSettingsRepository.update(ctx.userId, input);
  }),
});
