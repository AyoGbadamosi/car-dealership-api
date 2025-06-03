import { Document, Types } from "mongoose";
import { PaymentMethod } from "../enums/payment.enum";

export interface IPurchase extends Document {
  carId: Types.ObjectId;
  customerId: Types.ObjectId;
  purchaseDate: Date;
  purchasePrice: number;
  paymentMethod: PaymentMethod;
  createdAt: Date;
  updatedAt: Date;
}
