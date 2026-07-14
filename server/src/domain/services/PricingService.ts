export class PricingService {
  static calculateSubtotal(price: number, quantity: number): number {
    if (price < 0) throw new Error("Price cannot be negative");
    if (quantity <= 0) throw new Error("Quantity must be positive");
    return price * quantity;
  }

  static calculateTotal(
    items: Array<{ price: number; quantity: number }>
  ): number {
    return items.reduce(
      (total, item) => total + this.calculateSubtotal(item.price, item.quantity),
      0
    );
  }

  static calculateROI(revenue: number, investment: number): number {
    if (investment === 0) return 0;
    return ((revenue - investment) / investment) * 100;
  }

  static calculateProfitMargin(revenue: number, costs: number): number {
    if (revenue === 0) return 0;
    return ((revenue - costs) / revenue) * 100;
  }
}
