import mongoose from "mongoose";
import { ICustomer } from "../interfaces";
import { customerSchema } from "../schemas/customer.schema";

export default mongoose.model<ICustomer>("Customer", customerSchema);
