import { Document, Types } from "mongoose";
import { CarStatus } from "../enums/car.enum";
import { UserRole } from "../enums/role.enum";

export interface ICar extends Document {
  make: string;
  modelName: string;
  year: number;
  price: number;
  mileage: number;
  color: string;
  category: Types.ObjectId;
  status: CarStatus;
  features: string[];
  images: string[];
  vin: string;
  addedBy: {
    user: Types.ObjectId;
    role: UserRole.ADMIN | UserRole.MANAGER;
  };
  createdAt: Date;
  updatedAt: Date;
}
