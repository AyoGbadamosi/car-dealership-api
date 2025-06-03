import mongoose from "mongoose";
import { ICategory } from "../interfaces";
import { categorySchema } from "../schemas/category.schema";

export default mongoose.model<ICategory>("Category", categorySchema);
