import { createContext, useState, useCallback, useEffect, ReactNode } from "react";
import { trpc } from "../../infrastructure/api/trpc";
import type { CartItem } from "../../domain/entities/Cart";

export interface CartContextType {
  items: CartItem[];
  itemCount: number;
  addItem: (data: { productId: number; quantity: number }) => void;
  removeItem: (id: number) => void;
  updateQuantity: (id: number, quantity: number) => void;
  clearCart: () => void;
  isLoading: boolean;
}

export const CartContext = createContext<CartContextType | null>(null);

export function CartProvider({ children }: { children: ReactNode }) {
  const [items, setItems] = useState<CartItem[]>([]);

  const { data, isLoading } = trpc.cart.getItems.useQuery();

  useEffect(() => {
    if (data) {
      setItems(data as CartItem[]);
    }
  }, [data]);

  const addItemMutation = trpc.cart.addItem.useMutation({
    onSuccess: () => {
      // Refetch cart items
    },
  });

  const removeItemMutation = trpc.cart.removeItem.useMutation({
    onSuccess: () => {
      // Refetch cart items
    },
  });

  const clearCartMutation = trpc.cart.clear.useMutation({
    onSuccess: () => {
      setItems([]);
    },
  });

  const addItem = useCallback(
    (data: { productId: number; quantity: number }) => {
      addItemMutation.mutate(data);
    },
    [addItemMutation]
  );

  const removeItem = useCallback(
    (id: number) => {
      removeItemMutation.mutate({ id });
      setItems((prev) => prev.filter((item) => item.id !== id));
    },
    [removeItemMutation]
  );

  const updateQuantity = useCallback((id: number, quantity: number) => {
    setItems((prev) =>
      prev.map((item) => (item.id === id ? { ...item, quantity } : item))
    );
  }, []);

  const clearCart = useCallback(() => {
    clearCartMutation.mutate();
  }, [clearCartMutation]);

  return (
    <CartContext.Provider
      value={{
        items,
        itemCount: items.reduce((sum, item) => sum + item.quantity, 0),
        addItem,
        removeItem,
        updateQuantity,
        clearCart,
        isLoading,
      }}
    >
      {children}
    </CartContext.Provider>
  );
}
