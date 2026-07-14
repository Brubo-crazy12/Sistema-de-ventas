import { IOrderRepository } from "../../../domain/interfaces/IOrderRepository.js";
import { IProductRepository } from "../../../domain/interfaces/IProductRepository.js";
import { AnalyticsService, SalesReport } from "../../../domain/services/AnalyticsService.js";

export class GetSalesReportUseCase {
  constructor(
    private orderRepository: IOrderRepository,
    private productRepository: IProductRepository
  ) {}

  async execute(): Promise<SalesReport> {
    const orders = await this.orderRepository.findAll();
    const products = await this.productRepository.findAll();

    const productMap = new Map<number, string>();
    products.forEach((p) => productMap.set(p.id, p.name));

    return AnalyticsService.generateSalesReport(
      orders.map((o) => ({
        total: o.total,
        items: o.items.map((item) => ({
          productId: item.productId,
          price: item.price,
          quantity: item.quantity,
        })),
      })),
      productMap
    );
  }
}
