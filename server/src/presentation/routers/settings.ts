import { z } from "zod";
import { t, protectedProcedure } from "../tRPC.js";
import { businessSettingsRepository } from "../tRPC.js";

const updateSettingsSchema = z.object({
  sInvested: z.number().optional(),
  sStock: z.number().int().optional(),
  sCost: z.number().optional(),
  pStockMl: z.number().int().optional(),
  pStock10: z.number().int().optional(),
  pStock30: z.number().int().optional(),
  pStock60: z.number().int().optional(),
  pStock100: z.number().int().optional(),
  pCostMl: z.number().optional(),
  pCost10: z.number().optional(),
  pCost30: z.number().optional(),
  pCost60: z.number().optional(),
  pCost100: z.number().optional(),
  pPrice10: z.number().optional(),
  pPrice30: z.number().optional(),
  pPrice60: z.number().optional(),
  pPrice100: z.number().optional(),
  pPriceRelleno: z.number().optional(),
  aInvested: z.number().optional(),
  aStock: z.number().int().optional(),
  aCost: z.number().optional(),
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
