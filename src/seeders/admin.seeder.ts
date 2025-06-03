import mongoose from "mongoose";
import { UserRole } from "../enums/role.enum";
import dotenv from "dotenv";
import Admin from "../models/Admin";

const seedAdmin = async (): Promise<void> => {
  try {
    await mongoose.connect(process.env.MONGODB_URI as string);
    console.log("Connected to MongoDB");

    const existingAdmin = await Admin.findOne({
      email: "admin@cardealers.com",
    });
    if (existingAdmin) {
      console.log("Admin user already exists");
      return;
    }

    const admin = new Admin({
      email: "admin@cardealers.com",
      password: "Password1@",
      role: UserRole.ADMIN,
    });

    await admin.save();
    console.log("Admin user created successfully");
  } catch (error) {
    console.error("Error seeding admin:", error);
  } finally {
    await mongoose.disconnect();
    console.log("Disconnected from MongoDB");
  }
};

seedAdmin();
