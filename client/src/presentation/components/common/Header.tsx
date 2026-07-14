import { Link } from "react-router-dom";
import { useCart } from "../../hooks/useCart";

export function Header() {
  const { itemCount } = useCart();

  return (
    <header className="bg-dark-900 border-b border-dark-700">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <Link to="/" className="text-xl font-bold text-white">
            Sistema de Ventas
          </Link>

          <nav className="flex items-center gap-6">
            <Link
              to="/"
              className="text-dark-300 hover:text-white transition-colors"
            >
              Productos
            </Link>
            <Link
              to="/orders"
              className="text-dark-300 hover:text-white transition-colors"
            >
              Mis Pedidos
            </Link>
            <Link
              to="/cart"
              className="relative text-dark-300 hover:text-white transition-colors"
            >
              Carrito
              {itemCount > 0 && (
                <span className="absolute -top-2 -right-2 bg-primary-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                  {itemCount}
                </span>
              )}
            </Link>
          </nav>
        </div>
      </div>
    </header>
  );
}
