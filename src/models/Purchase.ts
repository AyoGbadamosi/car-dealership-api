import mongoose from "mongoose";
import { IPurchase } from "../interfaces";
import { purchaseSchema } from "../schemas/purchase.schema";

export default mongoose.model<IPurchase>("Purchase", purchaseSchema);
