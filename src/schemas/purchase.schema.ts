import { Schema } from "mongoose";
import { IPurchase } from "../interfaces";
import { PaymentMethod } from "../enums/payment.enum";

export const purchaseSchema = new Schema<IPurchase>(
  {
    carId: {
      type: Schema.Types.ObjectId,
      ref: "Car",
      required: [true, "Car ID is required"],
    },
    customerId: {
      type: Schema.Types.ObjectId,
      ref: "Customer",
      required: [true, "Customer ID is required"],
    },
    purchaseDate: {
      type: Date,
      required: [true, "Purchase date is required"],
      default: Date.now,
    },
    purchasePrice: {
      type: Number,
      required: [true, "Purchase price is required"],
      min: [0, "Purchase price cannot be negative"],
    },
    paymentMethod: {
      type: String,
      enum: Object.values(PaymentMethod),
      required: [true, "Payment method is required"],
    },
  },
  {
    timestamps: true,
  }
);

// Indexes
purchaseSchema.index({ carId: 1 });
purchaseSchema.index({ customerId: 1 });
purchaseSchema.index({ purchaseDate: 1 });
