import bcrypt from "bcryptjs";
import { Schema } from "mongoose";

export const hashPassword = async (password: string): Promise<string> => {
  const salt = await bcrypt.genSalt(10);
  return bcrypt.hash(password, salt);
};

export const comparePassword = async (
  candidatePassword: string,
  hashedPassword: string
): Promise<boolean> => {
  return bcrypt.compare(candidatePassword, hashedPassword);
};

// Add password methods to a schema
export const addPasswordMethods = (schema: Schema) => {
  // Hash password before saving
  schema.pre("save", async function (next) {
    if (!this.isModified("password")) return next();

    try {
      this.password = await hashPassword(this.password as string);
      next();
    } catch (error: any) {
      next(error);
    }
  });

  // Compare password method
  schema.methods.comparePassword = async function (
    candidatePassword: string
  ): Promise<boolean> {
    return comparePassword(candidatePassword, this.password as string);
  };
};
