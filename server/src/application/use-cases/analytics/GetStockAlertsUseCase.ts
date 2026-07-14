import { IProductRepository } from "../../../domain/interfaces/IProductRepository.js";
import { AnalyticsService, StockAlert } from "../../../domain/services/AnalyticsService.js";

export class GetStockAlertsUseCase {
  constructor(private productRepository: IProductRepository) {}

  async execute(threshold: number = 5): Promise<StockAlert[]> {
    const products = await this.productRepository.findAll();
    return AnalyticsService.getStockAlerts(
      products.map((p) => ({ id: p.id, name: p.name, stock: p.stock })),
      threshold
    );
  }
}
