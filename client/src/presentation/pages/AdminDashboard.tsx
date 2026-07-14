import { trpc } from "../../infrastructure/api/trpc";
import { formatPrice } from "../../domain/entities/Product";

export function AdminDashboard() {
  const { data: salesReport } = trpc.analytics.getSalesReport.useQuery();
  const { data: roi } = trpc.analytics.calculateROI.useQuery();
  const { data: stockAlerts } = trpc.analytics.getStockAlerts.useQuery({
    threshold: 5,
  });

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <h1 className="text-3xl font-bold text-white mb-8">
        Panel de administracion
      </h1>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="bg-dark-800 rounded-lg p-6 border border-dark-700">
          <h3 className="text-dark-400 text-sm mb-2">Ingresos totales</h3>
          <p className="text-2xl font-bold text-primary-400">
            {formatPrice((salesReport as any)?.totalRevenue ?? 0)}
          </p>
        </div>
        <div className="bg-dark-800 rounded-lg p-6 border border-dark-700">
          <h3 className="text-dark-400 text-sm mb-2">Total pedidos</h3>
          <p className="text-2xl font-bold text-white">
            {(salesReport as any)?.totalOrders ?? 0}
          </p>
        </div>
        <div className="bg-dark-800 rounded-lg p-6 border border-dark-700">
          <h3 className="text-dark-400 text-sm mb-2">ROI</h3>
          <p className="text-2xl font-bold text-green-400">
            {((roi as any)?.roi ?? 0).toFixed(1)}%
          </p>
        </div>
      </div>

      {stockAlerts && (stockAlerts as any[]).length > 0 && (
        <div className="bg-dark-800 rounded-lg p-6 border border-dark-700 mb-8">
          <h2 className="text-xl font-semibold text-white mb-4">
            Alertas de stock bajo
          </h2>
          <div className="space-y-2">
            {(stockAlerts as any[]).map((alert: any) => (
              <div
                key={alert.productId}
                className="flex justify-between items-center text-dark-300"
              >
                <span>{alert.name}</span>
                <span className="text-red-400">{alert.stock} unidades</span>
              </div>
            ))}
          </div>
        </div>
      )}

      {salesReport && (salesReport as any).topProducts?.length > 0 && (
        <div className="bg-dark-800 rounded-lg p-6 border border-dark-700">
          <h2 className="text-xl font-semibold text-white mb-4">
            Productos mas vendidos
          </h2>
          <div className="space-y-2">
            {(salesReport as any).topProducts.map((item: any) => (
              <div
                key={item.productId}
                className="flex justify-between items-center text-dark-300"
              >
                <span>{item.name}</span>
                <span>{formatPrice(item.revenue)}</span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
