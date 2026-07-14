import { CartItem, CartItemData } from "../../domain/entities/CartItem.js";

export class CartMapper {
  static toDomain(row: CartItemData): CartItem {
    return CartItem.fromPersistence({
      ...row,
      createdAt: new Date(row.createdAt),
      updatedAt: new Date(row.updatedAt),
    });
  }

  static toPersistence(cartItem: CartItem): CartItemData {
    return {
      id: cartItem.id,
      userId: cartItem.userId,
      productId: cartItem.productId,
      quantity: cartItem.quantity,
      createdAt: cartItem.createdAt,
      updatedAt: cartItem.updatedAt,
    };
  }
}
