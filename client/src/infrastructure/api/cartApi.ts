import { trpc } from "./trpc";

export const cartApi = {
  getItems: trpc.cart.getItems.useQuery,
  addItem: trpc.cart.addItem.useMutation,
  removeItem: trpc.cart.removeItem.useMutation,
  updateQuantity: trpc.cart.updateQuantity.useMutation,
  clear: trpc.cart.clear.useMutation,
};
