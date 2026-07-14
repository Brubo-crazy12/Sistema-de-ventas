import { Link } from "react-router-dom";
import type { Product } from "../../../domain/entities/Product";
import { formatPrice } from "../../../domain/entities/Product";

interface ProductCardProps {
  product: Product;
}

export function ProductCard({ product }: ProductCardProps) {
  return (
    <Link
      to={`/product/${product.id}`}
      className="bg-dark-800 rounded-lg overflow-hidden border border-dark-700 hover:border-primary-500 transition-all"
    >
      {product.imageUrl && (
        <img
          src={product.imageUrl}
          alt={product.name}
          className="w-full h-48 object-cover"
        />
      )}
      <div className="p-4">
        <h3 className="text-lg font-semibold text-white mb-2">
          {product.name}
        </h3>
        {product.description && (
          <p className="text-dark-400 text-sm mb-2 line-clamp-2">
            {product.description}
          </p>
        )}
        <div className="flex items-center justify-between">
          <span className="text-primary-400 font-bold">
            {formatPrice(product.price)}
          </span>
          <span className="text-dark-500 text-sm">
            Stock: {product.stock}
          </span>
        </div>
      </div>
    </Link>
  );
}
