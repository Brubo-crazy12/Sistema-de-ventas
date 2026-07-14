export function formatCurrency(amount: number): string {
  return `$${amount.toLocaleString("es-MX", { minimumFractionDigits: 0, maximumFractionDigits: 0 })}`;
}

export function today(): string {
  return new Date().toISOString().split("T")[0];
}
