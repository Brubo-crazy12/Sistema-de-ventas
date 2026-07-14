import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useCart } from "../hooks/useCart";
import { trpc } from "../../infrastructure/api/trpc";
import { formatPrice } from "../../domain/entities/Product";
import { calculateCartTotal } from "../../domain/entities/Cart";

export function Checkout() {
  const { items, clearCart } = useCart();
  const navigate = useNavigate();
  const [address, setAddress] = useState("");

  const createOrder = trpc.orders.create.useMutation({
    onSuccess: () => {
      clearCart();
      navigate("/orders");
    },
  });

  const total = calculateCartTotal(items);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    createOrder.mutate({
      shippingAddress: address || undefined,
      items: items.map((item) => ({
        productId: item.productId,
        quantity: item.quantity,
      })),
    });
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <h1 className="text-3xl font-bold text-white mb-8">Confirmar pedido</h1>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="block text-dark-300 mb-2">
              Direccion de envio
            </label>
            <textarea
              value={address}
              onChange={(e) => setAddress(e.target.value)}
              className="w-full bg-dark-800 border border-dark-700 rounded-lg p-3 text-white"
              rows={3}
              placeholder="Direccion completa..."
            />
          </div>

          <button
            type="submit"
            disabled={items.length === 0 || createOrder.isPending}
            className="w-full bg-primary-500 text-white py-3 rounded-lg font-medium hover:bg-primary-600 transition-colors disabled:opacity-50"
          >
            {createOrder.isPending ? "Procesando..." : "Confirmar pedido"}
          </button>
        </form>

        <div className="bg-dark-800 rounded-lg p-6 border border-dark-700">
          <h2 className="text-xl font-semibold text-white mb-4">
            Resumen del pedido
          </h2>
          <div className="space-y-3 mb-4">
            {items.map((item) => (
              <div key={item.id} className="flex justify-between text-dark-300">
                <span>
                  {item.product?.name} x{item.quantity}
                </span>
                <span>{formatPrice((item.product?.price ?? 0) * item.quantity)}</span>
              </div>
            ))}
          </div>
          <div className="border-t border-dark-700 pt-4">
            <div className="flex justify-between">
              <span className="text-white font-semibold">Total:</span>
              <span className="text-primary-400 font-bold text-xl">
                {formatPrice(total)}
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
