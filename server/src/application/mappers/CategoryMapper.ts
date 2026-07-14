import { Category, CategoryData } from "../../domain/entities/Category.js";

export class CategoryMapper {
  static toDomain(row: CategoryData): Category {
    return Category.fromPersistence({
      ...row,
      createdAt: new Date(row.createdAt),
    });
  }

  static toPersistence(category: Category): CategoryData {
    return {
      id: category.id,
      name: category.name,
      slug: category.slug,
      description: category.description,
      imageUrl: category.imageUrl,
      createdAt: category.createdAt,
    };
  }
}
