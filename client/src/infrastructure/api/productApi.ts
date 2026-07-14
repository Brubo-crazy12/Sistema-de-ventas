import { trpc } from "./trpc";

export const productApi = {
  list: trpc.products.list.useQuery,
  getById: trpc.products.getById.useQuery,
  listByCategory: trpc.products.listByCategory.useQuery,
  create: trpc.products.create.useMutation,
  update: trpc.products.update.useMutation,
  delete: trpc.products.delete.useMutation,
};
