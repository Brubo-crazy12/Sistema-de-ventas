import { Order, OrderStatus } from "../entities/Order.js";
import { Product } from "../entities/Product.js";

export class OrderService {
  static validateOrderCreation(
    products: Product[],
    quantities: number[]
  ): void {
    if (products.length === 0) {
      throw new Error("Order must have at least one item");
    }

    products.forEach((product, index) => {
      if (!product.isActive()) {
        throw new Error(`Product ${product.name} is not available`);
      }
      if (!product.hasStock(quantities[index])) {
        throw new Error(`Insufficient stock for ${product.name}`);
      }
    });
  }

  static calculateOrderTotal(
    products: Product[],
    quantities: number[]
  ): number {
    return products.reduce(
      (total, product, index) => total + product.price * quantities[index],
      0
    );
  }

  static canTransitionTo(current: OrderStatus, next: OrderStatus): boolean {
    const validTransitions: Record<OrderStatus, OrderStatus[]> = {
      pending: ["shipped", "cancelled"],
      shipped: ["delivered", "cancelled"],
      delivered: [],
      cancelled: [],
    };
    return validTransitions[current].includes(next);
  }
}
