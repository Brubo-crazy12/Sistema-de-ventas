import { Routes, Route } from "react-router-dom";
import { AuthProvider } from "./contexts/AuthContext";
import { CartProvider } from "./contexts/CartContext";
import { Layout } from "./layouts/Layout";
import { Home } from "./pages/Home";
import { ProductDetail } from "./pages/ProductDetail";
import { Cart } from "./pages/Cart";
import { Checkout } from "./pages/Checkout";
import { Orders } from "./pages/Orders";
import { AdminDashboard } from "./pages/AdminDashboard";

function App() {
  return (
    <AuthProvider>
      <CartProvider>
        <Routes>
          <Route path="/" element={<Layout />}>
            <Route index element={<Home />} />
            <Route path="product/:id" element={<ProductDetail />} />
            <Route path="cart" element={<Cart />} />
            <Route path="checkout" element={<Checkout />} />
            <Route path="orders" element={<Orders />} />
            <Route path="admin" element={<AdminDashboard />} />
          </Route>
        </Routes>
      </CartProvider>
    </AuthProvider>
  );
}

export default App;
