import { z } from "zod";
import { t, protectedProcedure } from "../tRPC.js";
import { saleRepository, reinvestmentRepository, businessSettingsRepository } from "../tRPC.js";

export const dashboardRouter = t.router({
  stats: protectedProcedure.query(async ({ ctx }) => {
    const sales = await saleRepository.findAll(ctx.userId);
    const reinvestments = await reinvestmentRepository.findAll(ctx.userId);
    const settings = await businessSettingsRepository.findByUserId(ctx.userId);

    const totalRevenue = sales.reduce((sum, s) => sum + s.revenue, 0);
    const totalCollected = sales.reduce((sum, s) => sum + s.paidAmount, 0);
    const totalPending = sales.reduce((sum, s) => sum + s.pending, 0);
    const totalCost = sales.reduce((sum, s) => sum + s.costTotal, 0);
    const totalReinvested = reinvestments.reduce((sum, r) => sum + r.amount, 0);
    const cashOnHand = totalCollected - totalReinvested;
    const liquidProfit = totalCollected - totalCost;

    const pendingSales = sales.filter((s) => s.isPending);

    return {
      totalRevenue,
      totalCollected,
      totalPending,
      totalCost,
      totalReinvested,
      cashOnHand,
      liquidProfit,
      pendingSales,
      salesCount: sales.length,
    };
  }),
});
