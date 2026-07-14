import { trpc } from "./trpc";

export const adminApi = {
  investments: {
    list: trpc.investments.list.useQuery,
    create: trpc.investments.create.useMutation,
    delete: trpc.investments.delete.useMutation,
  },
  analytics: {
    getSalesReport: trpc.analytics.getSalesReport.useQuery,
    calculateROI: trpc.analytics.calculateROI.useQuery,
    getStockAlerts: trpc.analytics.getStockAlerts.useQuery,
  },
};
