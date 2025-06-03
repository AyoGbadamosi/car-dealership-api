import { Schema } from "mongoose";
import { ICar } from "../interfaces";
import { CarStatus } from "../enums/car.enum";
import { UserRole } from "../enums/role.enum";

export const carSchema = new Schema<ICar>(
  {
    make: {
      type: String,
      required: [true, "Car make is required"],
      trim: true,
    },
    modelName: {
      type: String,
      required: [true, "Car model is required"],
      trim: true,
    },
    year: {
      type: Number,
      required: [true, "Car year is required"],
      min: [1900, "Year must be after 1900"],
      max: [new Date().getFullYear() + 1, "Year cannot be in the future"],
    },
    price: {
      type: Number,
      required: [true, "Car price is required"],
      min: [0, "Price cannot be negative"],
    },
    mileage: {
      type: Number,
      required: [true, "Car mileage is required"],
      min: [0, "Mileage cannot be negative"],
    },
    color: {
      type: String,
      required: [true, "Car color is required"],
      trim: true,
    },
    category: {
      type: Schema.Types.ObjectId,
      ref: "Category",
      required: [true, "Car category is required"],
    },
    status: {
      type: String,
      enum: Object.values(CarStatus),
      default: CarStatus.AVAILABLE,
    },
    features: [
      {
        type: String,
        trim: true,
      },
    ],
    images: [
      {
        type: String,
        trim: true,
      },
    ],
    vin: {
      type: String,
      required: [true, "VIN is required"],
      unique: true,
      trim: true,
      validate: {
        validator: function (v: string) {
          return /^[A-HJ-NPR-Z0-9]{17}$/.test(v);
        },
        message: "Invalid VIN format",
      },
    },
    addedBy: {
      user: {
        type: Schema.Types.ObjectId,
        required: [true, "User who added the car is required"],
        refPath: "addedBy.role",
      },
      role: {
        type: String,
        required: [true, "User role is required"],
        enum: [UserRole.MANAGER, UserRole.ADMIN],
      },
    },
  },
  {
    timestamps: true,
  }
);

carSchema.index({ make: 1, modelName: 1, year: 1 });
carSchema.index({ status: 1 });
carSchema.index({ category: 1 });
carSchema.index({ "addedBy.user": 1 });
