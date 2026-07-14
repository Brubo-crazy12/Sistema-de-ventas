import { Order, OrderData } from "../../domain/entities/Order.js";
import { OrderItem, OrderItemData } from "../../domain/entities/OrderItem.js";

export class OrderMapper {
  static toDomain(row: OrderData & { items?: OrderItemData[] }): Order {
    return Order.fromPersistence({
      ...row,
      createdAt: new Date(row.createdAt),
      updatedAt: new Date(row.updatedAt),
      items: row.items?.map((item) => ({
        ...item,
      })),
    });
  }

  static toPersistence(order: Order): OrderData {
    return {
      id: order.id,
      userId: order.userId,
      status: order.status,
      total: order.total,
      shippingAddress: order.shippingAddress,
      createdAt: order.createdAt,
      updatedAt: order.updatedAt,
    };
  }

  static toItemPersistence(item: OrderItem): OrderItemData {
    return {
      id: item.id,
      orderId: item.orderId,
      productId: item.productId,
      quantity: item.quantity,
      price: item.price,
    };
  }
}
