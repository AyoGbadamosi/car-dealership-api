import { z } from "zod";
import mongoose from "mongoose";

export const commonValidations = {
  email: z.string().email("Invalid email format").min(1, "Email is required"),

  password: z
    .string()
    .min(8, "Password must be at least 8 characters long")
    .regex(
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/,
      "Password must contain at least one uppercase letter, one lowercase letter, one number, and one special character"
    ),

  phone: z
    .string()
    .min(10, "Phone number must be at least 10 digits")
    .regex(
      /^(\+234|0)[789][01]\d{8}$/,
      "Invalid Nigerian phone number format. Must start with +234 or 0 followed by 7, 8, or 9"
    ),

  address: z.object({
    street: z.string().min(1, "Street address is required"),
    city: z.string().min(1, "City is required"),
    state: z.string().min(1, "State is required"),
    zipCode: z.string().min(1, "Zip code is required"),
    country: z.string().min(1, "Country is required"),
  }),

  objectId: z.string().refine((val) => mongoose.Types.ObjectId.isValid(val), {
    message: "Invalid ID format",
  }),
};
