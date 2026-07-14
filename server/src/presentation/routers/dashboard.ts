import { t, protectedProcedure } from "../tRPC.js";
import { orderRepository, productRepository, investmentRepository } from "../tRPC.js";

export const dashboardRouter = t.router({
  stats: protectedProcedure.query(async ({ ctx }) => {
    const orders = await orderRepository.findAll(ctx.userId);
    const products = await productRepository.findAll(ctx.userId);
    const investments = await investmentRepository.findAll(ctx.userId);

    const ventas = orders.reduce((sum, o) => sum + o.total, 0);
    const inversionTotal = investments.reduce((sum, i) => sum + i.amount, 0);
    const stock = products.reduce((sum, p) => sum + p.qty, 0);
    const ganancias = ventas;

    const byCategory = ["Sudaderas", "Perfumes", "Accesorios"].map((cat) => ({
      category: cat,
      ventas: orders.filter((o) => o.category === cat).reduce((sum, o) => sum + o.total, 0),
    }));

    const statusCounts = { Pagado: 0, Pendiente: 0, Adeudo: 0 } as Record<string, number>;
    orders.forEach((o) => {
      statusCounts[o.status] = (statusCounts[o.status] ?? 0) + 1;
    });

    const pendingOrders = orders.filter((o) => o.status !== "Pagado");

    return {
      ventas,
      pedidos: orders.length,
      stock,
      ganancias,
      inversionTotal,
      byCategory,
      orderStatus: statusCounts,
      pendingOrders,
    };
  }),
});
