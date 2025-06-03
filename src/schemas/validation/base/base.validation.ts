import { z } from "zod";
import { commonValidations } from "../utils/validation.utils";
import { CarStatus } from "../../../enums/car.enum";
import { UserRole } from "../../../enums/role.enum";

export const baseUserSchema = {
  firstName: z.string().min(1, "First name is required"),
  lastName: z.string().min(1, "Last name is required"),
  email: commonValidations.email,
  password: commonValidations.password,
  phone: commonValidations.phone,
};

export const baseCarSchema = {
  make: z.string().min(2, "Make must be at least 2 characters"),
  modelName: z.string().min(2, "Model must be at least 2 characters"),
  year: z
    .number()
    .min(1900, "Year must be after 1900")
    .max(new Date().getFullYear() + 1, "Year cannot be in the future"),
  price: z.number().positive("Price must be positive"),
  mileage: z.number().min(0, "Mileage cannot be negative"),
  color: z.string().min(2, "Color must be at least 2 characters"),
  category: commonValidations.objectId,
  status: z.nativeEnum(CarStatus),
  features: z.array(z.string()).optional(),
  images: z.array(z.string().url("Invalid image URL")).optional(),
  vin: z.string().length(17, "VIN must be exactly 17 characters"),
};

export const baseCategorySchema = {
  name: z.string().min(2, "Name must be at least 2 characters"),
  description: z.string().min(10, "Description must be at least 10 characters"),
};

export const basePurchaseSchema = {
  carId: commonValidations.objectId,
  purchasePrice: z.number().positive("Purchase price must be positive"),
  paymentMethod: z.string().min(1, "Payment method is required"),
};
