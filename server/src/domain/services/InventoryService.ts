import { Product } from "../entities/Product.js";

export class InventoryService {
  static canAddToCart(product: Product, quantity: number): boolean {
    return product.hasStock(quantity);
  }

  static validateStock(product: Product, quantity: number): void {
    if (!product.hasStock(quantity)) {
      throw new Error(
        `Insufficient stock for ${product.name}. Available: ${product.stock}, Requested: ${quantity}`
      );
    }
  }

  static getStockAlerts(
    products: Product[],
    threshold: number = 5
  ): Product[] {
    return products.filter((product) => product.stock <= threshold);
  }
}
