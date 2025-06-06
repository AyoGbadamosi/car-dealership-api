import request from "supertest";
import app from "../app";
import { UserRole } from "../enums/role.enum";
import { CarStatus } from "../enums/car.enum";
import Category from "../models/Category";
import mongoose from "mongoose";

describe("Car Management Endpoints", () => {
  let managerToken: string;
  let categoryId: string;
  let adminToken: string;
  let vinCounter = 1;
  const managerEmail = "manager@example.com";
  const managerPassword = "Password1@";

  const generateUniqueVin = () => {
    const vin = `1HGCM82633A${vinCounter.toString().padStart(6, '0')}`;
    vinCounter++;
    return vin;
  };

  beforeEach(async () => {
    // Login as admin using seeded admin account
    const adminRes = await request(app)
      .post("/api/auth/admin/login")
      .send({
        email: "admin@cardealers.com",
        password: "Password1@",
      });

    expect(adminRes.status).toBe(200);
    expect(adminRes.body.data).toHaveProperty("token");
    adminToken = adminRes.body.data.token;

    // Create manager account
    await request(app)
      .post("/api/auth/register/manager")
      .set("Authorization", `Bearer ${adminToken}`)
      .send({
        email: managerEmail,
        password: managerPassword,
        firstName: "John",
        lastName: "Doe",
        phone: "08123456789",
        role: UserRole.MANAGER,
      });

    // Login as manager to get token
    const managerLoginRes = await request(app)
      .post("/api/auth/login/manager")
      .send({
        email: managerEmail,
        password: managerPassword,
      });

    expect(managerLoginRes.status).toBe(200);
    managerToken = managerLoginRes.body.data.token;

    // Create a category
    const category = await Category.create({
      name: "Test Category",
      description: "Test category description for cars",
    });
    categoryId = category._id.toString();
  });

  describe("Create Car", () => {
    const getValidCarData = () => ({
      make: "Toyota",
      modelName: "Camry",
      year: 2022,
      price: 25000,
      mileage: 15000,
      color: "Silver",
      vin: generateUniqueVin(),
      features: ["Bluetooth", "Backup Camera"],
      status: CarStatus.AVAILABLE,
      category: categoryId,
    });

    it("should create a new car successfully", async () => {
      const carData = getValidCarData();
      const response = await request(app)
        .post("/api/cars")
        .set("Authorization", `Bearer ${managerToken}`)
        .send(carData);

      expect(response.status).toBe(201);
      expect(response.body.message).toBe("Car created successfully");
      expect(response.body.data).toMatchObject({
        make: carData.make,
        modelName: carData.modelName,
        vin: carData.vin,
      });
    });

    it("should fail with invalid category", async () => {
      const carData = getValidCarData();
      carData.category = new mongoose.Types.ObjectId().toString();
      const response = await request(app)
        .post("/api/cars")
        .set("Authorization", `Bearer ${managerToken}`)
        .send(carData);

      expect(response.status).toBe(400);
      expect(response.body.error).toBe("Category not found");
    });

    it("should fail without authentication", async () => {
      const carData = getValidCarData();
      const response = await request(app)
        .post("/api/cars")
        .send(carData);

      expect(response.status).toBe(401);
    });
  });

  describe("Get Cars", () => {
    beforeEach(async () => {
      // Create some test cars
      const carData = {
        make: "Toyota",
        modelName: "Camry",
        year: 2022,
        price: 25000,
        mileage: 15000,
        color: "Silver",
        category: categoryId,
        vin: generateUniqueVin(),
        features: ["Bluetooth"],
        status: CarStatus.AVAILABLE,
      };

      await request(app)
        .post("/api/cars")
        .set("Authorization", `Bearer ${managerToken}`)
        .send(carData);
    });

    it("should retrieve all cars", async () => {
      const response = await request(app)
        .get("/api/cars")
        .set("Authorization", `Bearer ${managerToken}`);

      expect(response.status).toBe(200);
      expect(response.body.message).toBe("Cars retrieved successfully");
      expect(response.body.data).toHaveProperty("cars");
      expect(Array.isArray(response.body.data.cars)).toBe(true);
      expect(response.body.data.cars.length).toBeGreaterThan(0);
      expect(response.body.data).toHaveProperty("pagination");
      expect(response.body.data.pagination).toHaveProperty("total");
      expect(response.body.data.pagination).toHaveProperty("page");
      expect(response.body.data.pagination).toHaveProperty("limit");
      expect(response.body.data.pagination).toHaveProperty("pages");
    });

    it("should filter by make", async () => {
      const response = await request(app)
        .get("/api/cars?make=Toyota")
        .set("Authorization", `Bearer ${managerToken}`);

      expect(response.status).toBe(200);
      expect(response.body.data.cars.every((car: any) => car.make === "Toyota")).toBe(true);
    });
  });

  describe("Update Car", () => {
    let carId: string;

    beforeEach(async () => {
      // Create a test car
      const createRes = await request(app)
        .post("/api/cars")
        .set("Authorization", `Bearer ${managerToken}`)
        .send({
          make: "Toyota",
          modelName: "Camry",
          year: 2022,
          price: 25000,
          mileage: 15000,
          color: "Silver",
          category: categoryId,
          vin: generateUniqueVin(),
          features: ["Bluetooth"],
          status: CarStatus.AVAILABLE,
        });

      expect(createRes.status).toBe(201);
      carId = createRes.body.data._id;
    });

    it("should update car successfully", async () => {
      const response = await request(app)
        .put(`/api/cars/${carId}`)
        .set("Authorization", `Bearer ${managerToken}`)
        .send({
          price: 26000,
          color: "Black",
        });

      expect(response.status).toBe(200);
      expect(response.body.message).toBe("Car updated successfully");
      expect(response.body.data.price).toBe(26000);
      expect(response.body.data.color).toBe("Black");
    });

    it("should fail to update non-existent car", async () => {
      const response = await request(app)
        .put(`/api/cars/${new mongoose.Types.ObjectId().toString()}`)
        .set("Authorization", `Bearer ${managerToken}`)
        .send({
          price: 26000,
        });

      expect(response.status).toBe(400);
      expect(response.body.error).toBe("Car not found");
    });
  });

  describe("Delete Car", () => {
    let carId: string;

    beforeEach(async () => {
      // Create a test car
      const createRes = await request(app)
        .post("/api/cars")
        .set("Authorization", `Bearer ${managerToken}`)
        .send({
          make: "Toyota",
          modelName: "Camry",
          year: 2022,
          price: 25000,
          mileage: 15000,
          color: "Silver",
          category: categoryId,
          vin: generateUniqueVin(),
          features: ["Bluetooth"],
          status: CarStatus.AVAILABLE,
        });

      expect(createRes.status).toBe(201);
      carId = createRes.body.data._id;
    });

    it("should delete car successfully", async () => {
      const response = await request(app)
        .delete(`/api/cars/${carId}`)
        .set("Authorization", `Bearer ${managerToken}`);

      expect(response.status).toBe(200);
      expect(response.body.message).toBe("Car deleted successfully");
    });

    it("should fail to delete non-existent car", async () => {
      const response = await request(app)
        .delete(`/api/cars/${new mongoose.Types.ObjectId().toString()}`)
        .set("Authorization", `Bearer ${managerToken}`);

      expect(response.status).toBe(400);
      expect(response.body.error).toBe("Car not found");
    });
  });
});
