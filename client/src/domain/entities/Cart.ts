export interface CartItem {
  id: number;
  userId: number;
  productId: number;
  quantity: number;
  product?: {
    id: number;
    name: string;
    price: number;
    imageUrl: string | null;
  };
}

export function calculateCartTotal(items: CartItem[]): number {
  return items.reduce((total, item) => {
    const price = item.product?.price ?? 0;
    return total + price * item.quantity;
  }, 0);
}
