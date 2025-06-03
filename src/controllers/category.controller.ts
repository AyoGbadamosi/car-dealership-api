import { Request, Response } from "express";
import { AuthenticatedRequest } from "../middleware/auth.middleware";
import {
  CreateCategoryInput,
  UpdateCategoryInput,
} from "../schemas/validation/category.validation";
import { CategoryService } from "../services/category.service";

const categoryService = new CategoryService();

// Create a new category
export const createCategory = async (
  req: AuthenticatedRequest,
  res: Response
): Promise<void> => {
  try {
    const categoryData = req.body as CreateCategoryInput;
    const category = await categoryService.createCategory(categoryData);

    res.status(201).json({
      message: "Category created successfully",
      data: category,
    });
  } catch (error: any) {
    if (error.code === 11000) {
      res.status(400).json({
        message: "Category with this name already exists",
      });
      return;
    }
    res.status(400).json({
      message: "Failed to create category",
      error: error.message,
    });
  }
};

// Get all categories
export const getCategories = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const categories = await categoryService.getCategories();

    res.json({
      message: "Categories retrieved successfully",
      data: categories,
    });
  } catch (error: any) {
    res.status(400).json({
      message: "Failed to retrieve categories",
      error: error.message,
    });
  }
};

// Get category by ID
export const getCategoryById = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const category = await categoryService.getCategoryById(req.params.id);

    res.json({
      message: "Category retrieved successfully",
      data: category,
    });
  } catch (error: any) {
    res.status(404).json({
      message: "Failed to retrieve category",
      error: error.message,
    });
  }
};

// Update category
export const updateCategory = async (
  req: AuthenticatedRequest,
  res: Response
): Promise<void> => {
  try {
    const categoryData = req.body as UpdateCategoryInput;
    const category = await categoryService.updateCategory(
      req.params.id,
      categoryData
    );

    res.json({
      message: "Category updated successfully",
      data: category,
    });
  } catch (error: any) {
    if (error.code === 11000) {
      res.status(400).json({
        message: "Category with this name already exists",
      });
      return;
    }
    res.status(400).json({
      message: "Failed to update category",
      error: error.message,
    });
  }
};

// Delete category
export const deleteCategory = async (
  req: AuthenticatedRequest,
  res: Response
): Promise<void> => {
  try {
    await categoryService.deleteCategory(req.params.id);

    res.json({
      message: "Category deleted successfully",
    });
  } catch (error: any) {
    res.status(400).json({
      message: "Failed to delete category",
      error: error.message,
    });
  }
};
