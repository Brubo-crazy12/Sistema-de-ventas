import { useParams } from "react-router-dom";
import { trpc } from "../../infrastructure/api/trpc";
import { formatPrice } from "../../domain/entities/Product";
import { useCart } from "../hooks/useCart";

export function ProductDetail() {
  const { id } = useParams<{ id: string }>();
  const { addItem } = useCart();

  const { data: product, isLoading } = trpc.products.getById.useQuery(
    { id: Number(id) },
    { enabled: !!id }
  );

  if (isLoading) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="animate-pulse bg-dark-800 h-96 rounded-lg" />
      </div>
    );
  }

  if (!product) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-8 text-center">
        <p className="text-dark-400">Producto no encontrado</p>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {product.imageUrl && (
          <img
            src={product.imageUrl}
            alt={product.name}
            className="w-full h-96 object-cover rounded-lg"
          />
        )}
        <div>
          <h1 className="text-3xl font-bold text-white mb-4">
            {product.name}
          </h1>
          {product.description && (
            <p className="text-dark-300 mb-6">{product.description}</p>
          )}
          <p className="text-4xl font-bold text-primary-400 mb-6">
            {formatPrice(product.price)}
          </p>
          <p className="text-dark-400 mb-6">
            Stock disponible: {product.stock}
          </p>
          <button
            onClick={() => addItem({ productId: product.id, quantity: 1 })}
            disabled={product.stock === 0}
            className="w-full bg-primary-500 text-white py-3 rounded-lg font-medium hover:bg-primary-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {product.stock === 0 ? "Agotado" : "Agregar al carrito"}
          </button>
        </div>
      </div>
    </div>
  );
}
