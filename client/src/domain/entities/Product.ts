export interface Product {
  id: number;
  name: string;
  description: string | null;
  price: number;
  stock: number;
  categoryId: number;
  imageUrl: string | null;
  active: number;
  createdAt: Date;
  updatedAt: Date;
}

export function formatPrice(priceInCents: number): string {
  return `$${(priceInCents / 100).toFixed(2)}`;
}
