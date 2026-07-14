import { PricingService } from "./PricingService.js";

export interface SalesReport {
  totalRevenue: number;
  totalOrders: number;
  averageOrderValue: number;
  topProducts: Array<{ productId: number; name: string; quantity: number; revenue: number }>;
}

export interface StockAlert {
  productId: number;
  name: string;
  stock: number;
}

export class AnalyticsService {
  static generateSalesReport(
    orders: Array<{ total: number; items: Array<{ productId: number; price: number; quantity: number }> }>,
    products: Map<number, string>
  ): SalesReport {
    const totalRevenue = orders.reduce((sum, order) => sum + order.total, 0);
    const totalOrders = orders.length;
    const averageOrderValue = totalOrders > 0 ? totalRevenue / totalOrders : 0;

    const productSales = new Map<number, { name: string; quantity: number; revenue: number }>();

    orders.forEach((order) => {
      order.items.forEach((item) => {
        const existing = productSales.get(item.productId);
        const productName = products.get(item.productId) || "Unknown";
        if (existing) {
          existing.quantity += item.quantity;
          existing.revenue += item.price * item.quantity;
        } else {
          productSales.set(item.productId, {
            name: productName,
            quantity: item.quantity,
            revenue: item.price * item.quantity,
          });
        }
      });
    });

    const topProducts = Array.from(productSales.entries())
      .map(([productId, data]) => ({ productId, ...data }))
      .sort((a, b) => b.revenue - a.revenue)
      .slice(0, 10);

    return {
      totalRevenue,
      totalOrders,
      averageOrderValue,
      topProducts,
    };
  }

  static calculateROI(revenue: number, investment: number): number {
    return PricingService.calculateROI(revenue, investment);
  }

  static getStockAlerts(
    products: Array<{ id: number; name: string; stock: number }>,
    threshold: number = 5
  ): StockAlert[] {
    return products
      .filter((p) => p.stock <= threshold)
      .map((p) => ({ productId: p.id, name: p.name, stock: p.stock }));
  }
}
