import { z } from "zod";
import { basePurchaseSchema } from "./base/base.validation";
import { PaymentMethod } from "../../enums/payment.enum";

// Create purchase schema
export const createPurchaseSchema = z.object({
  ...basePurchaseSchema,
  paymentMethod: z.nativeEnum(PaymentMethod),
});

// Update purchase schema (all fields optional)
export const updatePurchaseSchema = z.object(
  Object.fromEntries(
    Object.entries(basePurchaseSchema).map(([key, value]) => [
      key,
      value.optional(),
    ])
  )
);

// Query parameters schema
export const purchaseQuerySchema = z.object({
  customerId: z.string().optional(),
  carId: z.string().optional(),
  startDate: z.string().optional(),
  endDate: z.string().optional(),
  minPrice: z.number().optional(),
  maxPrice: z.number().optional(),
  paymentMethod: z.nativeEnum(PaymentMethod).optional(),
  sortBy: z.enum(["purchaseDate", "purchasePrice"]).optional(),
  sortOrder: z.enum(["asc", "desc"]).optional(),
  page: z.number().int().positive().optional(),
  limit: z.number().int().positive().optional(),
});

// Types
export type CreatePurchaseInput = z.infer<typeof createPurchaseSchema>;
export type UpdatePurchaseInput = z.infer<typeof updatePurchaseSchema>;
export type PurchaseQueryInput = z.infer<typeof purchaseQuerySchema>;
