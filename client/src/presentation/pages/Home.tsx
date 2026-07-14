import { useState } from "react";
import { trpc } from "../../infrastructure/api/trpc";
import { ProductGrid } from "../components/products/ProductGrid";
import { CategoryFilter } from "../components/products/CategoryFilter";

export function Home() {
  const [selectedCategory, setSelectedCategory] = useState<number | null>(null);

  const { data: categories } = trpc.categories.list.useQuery();
  const { data: products, isLoading } = selectedCategory
    ? trpc.products.listByCategory.useQuery({ categoryId: selectedCategory })
    : trpc.products.list.useQuery();

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <h1 className="text-3xl font-bold text-white mb-8">Productos</h1>

      {categories && (
        <CategoryFilter
          categories={categories as any}
          selectedId={selectedCategory}
          onSelect={setSelectedCategory}
        />
      )}

      <ProductGrid products={(products as any) || []} loading={isLoading} />
    </div>
  );
}
