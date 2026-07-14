export function formatCurrency(amountInCents: number): string {
  return `$${(amountInCents / 100).toFixed(2)}`;
}

export function generateSlug(text: string): string {
  return text
    .toLowerCase()
    .replace(/[^\w\s-]/g, "")
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-")
    .trim();
}

export function paginate<T>(
  items: T[],
  page: number,
  limit: number
): { data: T[]; total: number; page: number; totalPages: number } {
  const total = items.length;
  const totalPages = Math.ceil(total / limit);
  const start = (page - 1) * limit;
  const data = items.slice(start, start + limit);
  return { data, total, page, totalPages };
}
