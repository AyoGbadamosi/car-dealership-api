import Category from "../models/Category";
import {
  CreateCategoryInput,
  UpdateCategoryInput,
} from "../schemas/validation/category.validation";

export class CategoryService {
  async createCategory(categoryData: CreateCategoryInput) {
    const category = new Category(categoryData);
    return await category.save();
  }

  async getCategories() {
    return await Category.find().sort({ name: 1 });
  }

  async getCategoryById(id: string) {
    const category = await Category.findById(id);
    if (!category) {
      throw new Error("Category not found");
    }
    return category;
  }

  async updateCategory(id: string, categoryData: UpdateCategoryInput) {
    const category = await Category.findByIdAndUpdate(
      id,
      { $set: categoryData },
      { new: true, runValidators: true }
    );
    if (!category) {
      throw new Error("Category not found");
    }
    return category;
  }

  async deleteCategory(id: string) {
    const category = await Category.findByIdAndDelete(id);
    if (!category) {
      throw new Error("Category not found");
    }
    return category;
  }
}
