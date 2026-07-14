interface Category {
  id: number;
  name: string;
  slug: string;
}

interface CategoryFilterProps {
  categories: Category[];
  selectedId: number | null;
  onSelect: (id: number | null) => void;
}

export function CategoryFilter({
  categories,
  selectedId,
  onSelect,
}: CategoryFilterProps) {
  return (
    <div className="flex flex-wrap gap-2 mb-6">
      <button
        onClick={() => onSelect(null)}
        className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
          selectedId === null
            ? "bg-primary-500 text-white"
            : "bg-dark-800 text-dark-300 hover:bg-dark-700"
        }`}
      >
        Todos
      </button>
      {categories.map((category) => (
        <button
          key={category.id}
          onClick={() => onSelect(category.id)}
          className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
            selectedId === category.id
              ? "bg-primary-500 text-white"
              : "bg-dark-800 text-dark-300 hover:bg-dark-700"
          }`}
        >
          {category.name}
        </button>
      ))}
    </div>
  );
}
