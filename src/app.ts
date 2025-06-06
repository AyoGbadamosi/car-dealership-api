import express, { Express } from "express";
import cors from "cors";
import helmet from "helmet";
import morgan from "morgan";
import { config } from "dotenv";
import connectDB from "./config/database";
import authRoutes from "./routes/auth.routes";
import carRoutes from "./routes/car.routes";
import categoryRoutes from "./routes/category.routes";
import userRoutes from "./routes/user.routes";
import purchaseRoutes from "./routes/purchase.routes";

const app: Express = express();

if (process.env.NODE_ENV !== "test") {
  connectDB();
}

app.use(cors());
app.use(helmet());
app.use(morgan("dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use("/api/auth", authRoutes);
app.use("/api/cars", carRoutes);
app.use("/api/categories", categoryRoutes);
app.use("/api/users", userRoutes);
app.use("/api/purchases", purchaseRoutes);

app.get("/", (req, res) => {
  res.json({ message: "Welcome to Car Dealership API" });
});

app.use(
  (
    err: Error,
    req: express.Request,
    res: express.Response,
    next: express.NextFunction
  ) => {
    console.error(err.stack);
    res.status(500).json({
      message: "Something went wrong!",
      error: process.env.NODE_ENV === "development" ? err.message : undefined,
    });
  }
);

const PORT = process.env.PORT || 3000;
if (process.env.NODE_ENV !== "test") {
  app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
  });
}

export default app;
