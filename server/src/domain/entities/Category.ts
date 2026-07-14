export interface CategoryData {
  id: number;
  name: string;
  slug: string;
  description: string | null;
  imageUrl: string | null;
  createdAt: Date;
}

export class Category {
  id: number;
  name: string;
  slug: string;
  description: string | null;
  imageUrl: string | null;
  createdAt: Date;

  private constructor(data: CategoryData) {
    this.id = data.id;
    this.name = data.name;
    this.slug = data.slug;
    this.description = data.description;
    this.imageUrl = data.imageUrl;
    this.createdAt = data.createdAt;
  }

  static create(
    data: Omit<CategoryData, "id" | "createdAt">
  ): Category {
    if (!data.name || data.name.trim().length === 0) {
      throw new Error("Category name is required");
    }
    if (!data.slug || data.slug.trim().length === 0) {
      throw new Error("Category slug is required");
    }

    return new Category({
      ...data,
      description: data.description ?? null,
      imageUrl: data.imageUrl ?? null,
      id: 0,
      createdAt: new Date(),
    });
  }

  static fromPersistence(data: CategoryData): Category {
    return new Category(data);
  }

  toJSON() {
    return { ...this };
  }
}
