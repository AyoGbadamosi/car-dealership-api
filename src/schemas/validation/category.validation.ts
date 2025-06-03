import { z } from "zod";
import { baseCategorySchema } from "./base/base.validation";

export const createCategorySchema = z.object(baseCategorySchema);

export const updateCategorySchema = z.object(
  Object.fromEntries(
    Object.entries(baseCategorySchema).map(([key, value]) => [
      key,
      value.optional(),
    ])
  )
);

export const categoryQuerySchema = z.object({
  name: z.string().optional(),
  sortBy: z.enum(["name"]).optional(),
  sortOrder: z.enum(["asc", "desc"]).optional(),
  page: z.number().int().positive().optional(),
  limit: z.number().int().positive().optional(),
});

export type CreateCategoryInput = z.infer<typeof createCategorySchema>;
export type UpdateCategoryInput = z.infer<typeof updateCategorySchema>;
export type CategoryQueryInput = z.infer<typeof categoryQuerySchema>;
