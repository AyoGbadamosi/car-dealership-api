import mongoose from "mongoose";
import { IAdmin } from "../interfaces";
import { adminSchema } from "../schemas/admin.schema";

export default mongoose.model<IAdmin>("Admin", adminSchema);
