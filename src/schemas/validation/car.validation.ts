import { z } from "zod";
import { baseCarSchema } from "./base/base.validation";

export const createCarSchema = z.object(baseCarSchema);

export const updateCarSchema = z.object(
  Object.fromEntries(
    Object.entries(baseCarSchema).map(([key, value]) => [key, value.optional()])
  )
);

export const carQuerySchema = z.object({
  make: z.string().optional(),
  model: z.string().optional(),
  minYear: z.number().optional(),
  maxYear: z.number().optional(),
  minPrice: z.number().optional(),
  maxPrice: z.number().optional(),
  category: z.string().optional(),
  status: z.string().optional(),
  sortBy: z.enum(["price", "year", "mileage"]).optional(),
  sortOrder: z.enum(["asc", "desc"]).optional(),
  page: z.number().int().positive().optional(),
  limit: z.number().int().positive().optional(),
});

export type CreateCarInput = z.infer<typeof createCarSchema>;
export type UpdateCarInput = z.infer<typeof updateCarSchema>;
export type CarQueryInput = z.infer<typeof carQuerySchema>;
