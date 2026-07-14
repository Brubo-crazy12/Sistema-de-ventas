import type { CartItem } from "../../../domain/entities/Cart";
import { formatPrice } from "../../../domain/entities/Product";

interface CartItemCardProps {
  item: CartItem;
  onUpdateQuantity: (id: number, quantity: number) => void;
  onRemove: (id: number) => void;
}

export function CartItemCard({
  item,
  onUpdateQuantity,
  onRemove,
}: CartItemCardProps) {
  return (
    <div className="bg-dark-800 rounded-lg p-4 flex items-center gap-4 border border-dark-700">
      {item.product?.imageUrl && (
        <img
          src={item.product.imageUrl}
          alt={item.product.name}
          className="w-16 h-16 object-cover rounded"
        />
      )}
      <div className="flex-1">
        <h3 className="text-white font-medium">
          {item.product?.name || "Producto"}
        </h3>
        <p className="text-primary-400">
          {formatPrice(item.product?.price ?? 0)}
        </p>
      </div>
      <div className="flex items-center gap-2">
        <button
          onClick={() => onUpdateQuantity(item.id, item.quantity - 1)}
          className="w-8 h-8 bg-dark-700 rounded text-white hover:bg-dark-600"
        >
          -
        </button>
        <span className="w-8 text-center text-white">{item.quantity}</span>
        <button
          onClick={() => onUpdateQuantity(item.id, item.quantity + 1)}
          className="w-8 h-8 bg-dark-700 rounded text-white hover:bg-dark-600"
        >
          +
        </button>
      </div>
      <button
        onClick={() => onRemove(item.id)}
        className="text-red-400 hover:text-red-300"
      >
        Eliminar
      </button>
    </div>
  );
}
