import { Schema } from "mongoose";
import { ICategory } from "../interfaces";

export const categorySchema = new Schema<ICategory>(
  {
    name: {
      type: String,
      required: [true, "Category name is required"],
      unique: true,
      trim: true,
    },
    description: {
      type: String,
      required: [true, "Category description is required"],
      trim: true,
    },
  },
  {
    timestamps: true,
  }
);
