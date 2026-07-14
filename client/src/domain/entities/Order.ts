export type OrderStatus = "pending" | "shipped" | "delivered" | "cancelled";

export interface Order {
  id: number;
  userId: number;
  status: OrderStatus;
  total: number;
  shippingAddress: string | null;
  createdAt: Date;
  updatedAt: Date;
  items?: Array<{
    id: number;
    productId: number;
    quantity: number;
    price: number;
  }>;
}

export const ORDER_STATUS_LABELS: Record<OrderStatus, string> = {
  pending: "Pendiente",
  shipped: "Enviado",
  delivered: "Entregado",
  cancelled: "Cancelado",
};

export const ORDER_STATUS_COLORS: Record<OrderStatus, string> = {
  pending: "bg-yellow-100 text-yellow-800",
  shipped: "bg-blue-100 text-blue-800",
  delivered: "bg-green-100 text-green-800",
  cancelled: "bg-red-100 text-red-800",
};
