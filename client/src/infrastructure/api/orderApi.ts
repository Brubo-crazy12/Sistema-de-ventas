import { trpc } from "./trpc";

export const orderApi = {
  list: trpc.orders.list.useQuery,
  getById: trpc.orders.getById.useQuery,
  create: trpc.orders.create.useMutation,
  listAll: trpc.orders.listAll.useQuery,
  updateStatus: trpc.orders.updateStatus.useMutation,
};
