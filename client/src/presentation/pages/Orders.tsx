import { trpc } from "../../infrastructure/api/trpc";
import {
  type OrderStatus,
  ORDER_STATUS_LABELS,
  ORDER_STATUS_COLORS,
} from "../../domain/entities/Order";
import { formatPrice } from "../../domain/entities/Product";

export function Orders() {
  const { data: orders, isLoading } = trpc.orders.list.useQuery();

  if (isLoading) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="animate-pulse bg-dark-800 h-64 rounded-lg" />
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <h1 className="text-3xl font-bold text-white mb-8">Mis pedidos</h1>

      {!orders || (orders as any[]).length === 0 ? (
        <p className="text-dark-400 text-center py-12">
          No tienes pedidos aun
        </p>
      ) : (
        <div className="space-y-4">
          {(orders as any[]).map((order: any) => (
            <div
              key={order.id}
              className="bg-dark-800 rounded-lg p-6 border border-dark-700"
            >
              <div className="flex items-center justify-between mb-4">
                <span className="text-dark-400">
                  Pedido #{order.id}
                </span>
                <span
                  className={`px-3 py-1 rounded-full text-xs font-medium ${
                    ORDER_STATUS_COLORS[order.status as OrderStatus]
                  }`}
                >
                  {ORDER_STATUS_LABELS[order.status as OrderStatus]}
                </span>
              </div>
              <div className="text-dark-300 mb-2">
                {new Date(order.createdAt).toLocaleDateString("es-MX")}
              </div>
              <div className="text-xl font-bold text-primary-400">
                {formatPrice(order.total)}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
