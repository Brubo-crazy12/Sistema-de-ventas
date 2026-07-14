import { IInvestmentRepository } from "../../../domain/interfaces/IInvestmentRepository.js";
import { IOrderRepository } from "../../../domain/interfaces/IOrderRepository.js";
import { AnalyticsService } from "../../../domain/services/AnalyticsService.js";

export interface ROIResult {
  totalRevenue: number;
  totalInvestment: number;
  roi: number;
}

export class CalculateROIUseCase {
  constructor(
    private investmentRepository: IInvestmentRepository,
    private orderRepository: IOrderRepository
  ) {}

  async execute(): Promise<ROIResult> {
    const orders = await this.orderRepository.findAll();
    const totalRevenue = orders.reduce((sum, order) => sum + order.total, 0);
    const totalInvestment =
      await this.investmentRepository.getTotalInvestments();
    const roi = AnalyticsService.calculateROI(totalRevenue, totalInvestment);

    return {
      totalRevenue,
      totalInvestment,
      roi,
    };
  }
}
