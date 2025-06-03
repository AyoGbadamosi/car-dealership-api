import mongoose from "mongoose";
import { ICar } from "../interfaces";
import { carSchema } from "../schemas/car.schema";

export default mongoose.model<ICar>("Car", carSchema);
