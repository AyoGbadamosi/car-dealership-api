import request from "supertest";
import app from "../app";
import { UserRole } from "../enums/role.enum";
import { PaymentMethod } from "../enums/payment.enum";
import { CarStatus } from "../enums/car.enum";
import mongoose from "mongoose";
import Category from "../models/Category";

describe("Purchase Management Endpoints", () => {
  let customerToken: string;
  let managerToken: string;
  let adminToken: string;
  let carId: string;
  let customerId: string;
  let categoryId: string;
  let vinCounter = 1;
  const managerEmail = "manager@example.com";
  const managerPassword = "Password1@";

  const generateUniqueVin = () => {
    const vin = `2HGCM82633A${vinCounter.toString().padStart(6, "0")}`;
    vinCounter++;
    return vin;
  };

  beforeEach(async () => {
    const adminRes = await request(app).post("/api/auth/admin/login").send({
      email: "admin@cardealers.com",
      password: "Password1@",
    });

    expect(adminRes.status).toBe(200);
    expect(adminRes.body.data).toHaveProperty("token");
    adminToken = adminRes.body.data.token;

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

    const managerLoginRes = await request(app)
      .post("/api/auth/login/manager")
      .send({
        email: managerEmail,
        password: managerPassword,
      });

    expect(managerLoginRes.status).toBe(200);
    managerToken = managerLoginRes.body.data.token;

    const category = await Category.create({
      name: "Test Category",
      description: "Test category description for purchases",
    });
    categoryId = category._id.toString();

    const carRes = await request(app)
      .post("/api/cars")
      .set("Authorization", `Bearer ${managerToken}`)
      .send({
        make: "Toyota",
        modelName: "Camry",
        year: 2023,
        price: 25000,
        mileage: 15000,
        color: "Silver",
        vin: generateUniqueVin(),
        category: categoryId,
        features: ["Bluetooth"],
        status: CarStatus.AVAILABLE,
      });

    expect(carRes.status).toBe(201);
    carId = carRes.body.data._id;

    const customerRes = await request(app)
      .post("/api/auth/register/customer")
      .send({
        firstName: "John",
        lastName: "Doe",
        email: "customer@example.com",
        password: "Password1@",
        phone: "08123456789",
        address: {
          street: "123 Main St",
          city: "Lagos",
          state: "Lagos",
          zipCode: "100001",
          country: "Nigeria",
        },
        dateOfBirth: "1990-01-01",
        licenseNumber: generateUniqueVin(),
      });

    expect(customerRes.status).toBe(201);
    customerToken = customerRes.body.data.token;
    customerId = customerRes.body.data.user._id;
  });

  describe("POST /api/purchases - Create Purchase", () => {
    it("creates a purchase successfully and marks car as sold", async () => {
      const purchaseData = {
        carId,
        purchasePrice: 25000,
        paymentMethod: PaymentMethod.CASH,
      };

      const response = await request(app)
        .post("/api/purchases")
        .set("Authorization", `Bearer ${customerToken}`)
        .send(purchaseData);

      expect(response.status).toBe(201);
      expect(response.body.message).toBe("Purchase completed successfully");
      expect(response.body.data).toMatchObject({
        carId,
        customerId,
        purchasePrice: 25000,
        paymentMethod: PaymentMethod.CASH,
      });

      const carRes = await request(app)
        .get(`/api/cars/${carId}`)
        .set("Authorization", `Bearer ${customerToken}`);

      expect(carRes.body.data.status).toBe(CarStatus.SOLD);
    });

    it("returns 400 when car does not exist", async () => {
      const purchaseData = {
        carId: new mongoose.Types.ObjectId().toString(),
        purchasePrice: 25000,
        paymentMethod: PaymentMethod.CASH,
      };

      const response = await request(app)
        .post("/api/purchases")
        .set("Authorization", `Bearer ${customerToken}`)
        .send(purchaseData);

      expect(response.status).toBe(400);
      expect(response.body.error).toBe("Car not found");
    });

    it("returns 400 when car is already sold", async () => {
      const purchaseData = {
        carId,
        purchasePrice: 25000,
        paymentMethod: PaymentMethod.CASH,
      };

      await request(app)
        .post("/api/purchases")
        .set("Authorization", `Bearer ${customerToken}`)
        .send(purchaseData);

      const response = await request(app)
        .post("/api/purchases")
        .set("Authorization", `Bearer ${customerToken}`)
        .send(purchaseData);

      expect(response.status).toBe(400);
      expect(response.body.error).toBe("Car is not available for purchase");
    });
  });

  describe("GET /api/purchases/my-purchases - Get Purchases For Customer", () => {
    beforeEach(async () => {
      await request(app)
        .post("/api/purchases")
        .set("Authorization", `Bearer ${customerToken}`)
        .send({
          carId,
          purchasePrice: 25000,
          paymentMethod: PaymentMethod.CASH,
        });
    });

    it("returns all purchases for the authenticated customer", async () => {
      const response = await request(app)
        .get("/api/purchases/my-purchases")
        .set("Authorization", `Bearer ${customerToken}`);

      expect(response.status).toBe(200);
      expect(response.body.message).toBe(
        "Customer purchases retrieved successfully"
      );
      expect(Array.isArray(response.body.data)).toBe(true);
      expect(response.body.data.length).toBeGreaterThan(0);
    });
  });

  describe("GET /api/purchases - Get Purchases For Manager", () => {
    beforeEach(async () => {
      await request(app)
        .post("/api/purchases")
        .set("Authorization", `Bearer ${customerToken}`)
        .send({
          carId,
          purchasePrice: 25000,
          paymentMethod: PaymentMethod.CASH,
        });
    });

    it("returns all purchases for the authenticated manager", async () => {
      const response = await request(app)
        .get("/api/purchases")
        .set("Authorization", `Bearer ${managerToken}`);

      expect(response.status).toBe(200);
      expect(response.body.message).toBe(
        "All purchases retrieved successfully"
      );
      expect(Array.isArray(response.body.data)).toBe(true);
      expect(response.body.data.length).toBeGreaterThan(0);
    });
  });

  describe("GET /api/purchases/:id - Get Purchase by ID", () => {
    let purchaseId: string;

    beforeEach(async () => {
      const purchaseRes = await request(app)
        .post("/api/purchases")
        .set("Authorization", `Bearer ${customerToken}`)
        .send({
          carId,
          purchasePrice: 25000,
          paymentMethod: PaymentMethod.CASH,
        });

      purchaseId = purchaseRes.body.data._id;
    });

    it("retrieves a purchase by ID for the authenticated manager", async () => {
      const response = await request(app)
        .get(`/api/purchases/${purchaseId}`)
        .set("Authorization", `Bearer ${managerToken}`);

      expect(response.status).toBe(200);
      expect(response.body.message).toBe("Purchase retrieved successfully");
      expect(response.body.data._id).toBe(purchaseId);
    });

    it("returns 404 for non-existent purchase", async () => {
      const response = await request(app)
        .get(`/api/purchases/${new mongoose.Types.ObjectId().toString()}`)
        .set("Authorization", `Bearer ${managerToken}`);

      expect(response.status).toBe(404);
      expect(response.body.error).toBe("Purchase not found");
    });

    it("allows customer to retrieve their own purchase", async () => {
      const response = await request(app)
        .get(`/api/purchases/my-purchases/${purchaseId}`)
        .set("Authorization", `Bearer ${customerToken}`);

      expect(response.status).toBe(200);
      expect(response.body.message).toBe("Purchase retrieved successfully");
      expect(response.body.data._id).toBe(purchaseId);
    });

    it("prevents customer from accessing another customer's purchase", async () => {
      // Create another customer with unique license
      const anotherCustomerRes = await request(app)
        .post("/api/auth/register/customer")
        .send({
          firstName: "Jane",
          lastName: "Doe",
          email: "jane@example.com",
          password: "Password1@",
          phone: "08123456780",
          address: {
            street: "124 Main St",
            city: "Lagos",
            state: "Lagos",
            zipCode: "100001",
            country: "Nigeria",
          },
          dateOfBirth: "1990-01-01",
          licenseNumber: generateUniqueVin(), // Use VIN generator for unique license
        });

      expect(anotherCustomerRes.status).toBe(201);
      const anotherCustomerToken = anotherCustomerRes.body.data.token;

      const response = await request(app)
        .get(`/api/purchases/my-purchases/${purchaseId}`)
        .set("Authorization", `Bearer ${anotherCustomerToken}`);

      expect(response.status).toBe(403);
      expect(response.body.message).toBe(
        "You are not authorized to view this purchase"
      );
    });
  });
});
