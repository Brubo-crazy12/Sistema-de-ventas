import { categoryGradient, categoryInitials, type Category } from "../../data/mock";

export function ProductAvatar({ category }: { category: Category }) {
  return (
    <div
      className="flex items-center justify-center rounded-lg font-semibold text-white"
      style={{
        width: 40,
        height: 40,
        background: categoryGradient[category],
        fontSize: 13,
      }}
    >
      {categoryInitials(category)}
    </div>
  );
}
