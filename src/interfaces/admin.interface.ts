import { Document } from "mongoose";
import { UserRole } from "../enums/role.enum";

export interface IAdmin extends Document {
  email: string;
  password: string;
  role: UserRole;
  lastLogin: Date;
  createdAt: Date;
  updatedAt: Date;
  comparePassword(candidatePassword: string): Promise<boolean>;
}
