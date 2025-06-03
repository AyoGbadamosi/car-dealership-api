import mongoose from "mongoose";
import { IManager } from "../interfaces";
import { managerSchema } from "../schemas/manager.schema";

export default mongoose.model<IManager>("Manager", managerSchema);
