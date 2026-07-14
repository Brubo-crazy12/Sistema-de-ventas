import { CartItem } from "../entities/CartItem.js";

export interface ICartRepository {
  findByUserId(userId: number): Promise<CartItem[]>;
  findById(id: number): Promise<CartItem | null>;
  findByUserAndProduct(userId: number, productId: number): Promise<CartItem | null>;
  save(cartItem: CartItem): Promise<CartItem>;
  update(id: number, data: Partial<CartItem>): Promise<CartItem>;
  delete(id: number): Promise<void>;
  clearByUserId(userId: number): Promise<void>;
}
