import { useCart } from "../hooks/useCart";
import { CartItemCard } from "../components/cart/CartItemCard";
import { formatPrice } from "../../domain/entities/Product";
import { calculateCartTotal } from "../../domain/entities/Cart";
import { Link } from "react-router-dom";

export function Cart() {
  const { items, updateQuantity, removeItem, isLoading } = useCart();

  if (isLoading) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="animate-pulse bg-dark-800 h-64 rounded-lg" />
      </div>
    );
  }

  if (items.length === 0) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-8 text-center">
        <h1 className="text-3xl font-bold text-white mb-4">
          Carrito vacio
        </h1>
        <p className="text-dark-400 mb-6">
          Agrega productos para comenzar
        </p>
        <Link
          to="/"
          className="inline-block bg-primary-500 text-white px-6 py-3 rounded-lg hover:bg-primary-600"
        >
          Ver productos
        </Link>
      </div>
    );
  }

  const total = calculateCartTotal(items);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <h1 className="text-3xl font-bold text-white mb-8">Carrito</h1>

      <div className="space-y-4 mb-8">
        {items.map((item) => (
          <CartItemCard
            key={item.id}
            item={item}
            onUpdateQuantity={updateQuantity}
            onRemove={removeItem}
          />
        ))}
      </div>

      <div className="bg-dark-800 rounded-lg p-6 border border-dark-700">
        <div className="flex justify-between items-center mb-4">
          <span className="text-dark-300">Total:</span>
          <span className="text-2xl font-bold text-primary-400">
            {formatPrice(total)}
          </span>
        </div>
        <Link
          to="/checkout"
          className="block w-full bg-primary-500 text-white py-3 rounded-lg font-medium text-center hover:bg-primary-600 transition-colors"
        >
          Proceder al pago
        </Link>
      </div>
    </div>
  );
}
