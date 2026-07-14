import { z } from "zod";
import { t, adminProcedure } from "../tRPC.js";
import { GetSalesReportUseCase } from "../../application/use-cases/analytics/GetSalesReportUseCase.js";
import { CalculateROIUseCase } from "../../application/use-cases/analytics/CalculateROIUseCase.js";
import { GetStockAlertsUseCase } from "../../application/use-cases/analytics/GetStockAlertsUseCase.js";
import { orderRepository, productRepository, investmentRepository } from "../tRPC.js";

const getSalesReportUseCase = new GetSalesReportUseCase(
  orderRepository,
  productRepository
);
const calculateROIUseCase = new CalculateROIUseCase(
  investmentRepository,
  orderRepository
);
const getStockAlertsUseCase = new GetStockAlertsUseCase(productRepository);

export const analyticsRouter = t.router({
  getSalesReport: adminProcedure.query(async () => {
    return getSalesReportUseCase.execute();
  }),

  calculateROI: adminProcedure.query(async () => {
    return calculateROIUseCase.execute();
  }),

  getStockAlerts: adminProcedure
    .input(z.object({ threshold: z.number().int().positive().optional() }))
    .query(async ({ input }) => {
      return getStockAlertsUseCase.execute(input.threshold);
    }),
});
