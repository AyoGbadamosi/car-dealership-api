import { z } from "zod";
import { baseUserSchema } from "./base/base.validation";
import { commonValidations } from "./utils/validation.utils";
import { UserRole } from "../../enums/role.enum";

export const customerRegisterSchema = z.object({
  ...baseUserSchema,
  address: commonValidations.address,
  dateOfBirth: z.string().refine((date) => {
    const dob = new Date(date);
    const today = new Date();
    const age = today.getFullYear() - dob.getFullYear();
    return age >= 18;
  }, "Must be at least 18 years old"),
  licenseNumber: z.string().min(1, "License number is required"),
});

export const managerRegisterSchema = z.object({
  ...baseUserSchema,
  role: z.literal(UserRole.MANAGER),
});

export const loginSchema = z.object({
  email: commonValidations.email,
  password: z.string().min(1, "Password is required"),
});

// Password change schema
export const changePasswordSchema = z
  .object({
    currentPassword: z.string().min(1, "Current password is required"),
    newPassword: commonValidations.password,
    confirmPassword: z.string().min(1, "Confirm password is required"),
  })
  .refine((data) => data.newPassword === data.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"],
  });

export type CustomerRegisterInput = z.infer<typeof customerRegisterSchema>;
export type ManagerRegisterInput = z.infer<typeof managerRegisterSchema>;
export type LoginInput = z.infer<typeof loginSchema>;
