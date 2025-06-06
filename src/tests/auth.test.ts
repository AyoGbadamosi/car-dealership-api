import request from "supertest";
import app from "../app";
import Customer from "../models/Customer";
import Manager from "../models/Manager";
import { UserRole } from "../enums/role.enum";

describe("Authentication Endpoints", () => {
  let adminToken: string;
  let customerToken: string;
  let managerToken: string;

  beforeEach(async () => {
    await Customer.deleteMany({});
    await Manager.deleteMany({});

    const adminRes = await request(app).post("/api/auth/admin/login").send({
      email: "admin@cardealers.com",
      password: "Password1@",
    });

    expect(adminRes.status).toBe(200);
    expect(adminRes.body.data).toHaveProperty("token");
    adminToken = adminRes.body.data.token;
  });

  const getValidCustomerData = () => ({
    firstName: "John",
    lastName: "Doe",
    email: `john.doe.${Date.now()}@example.com`, // Make email unique
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
    licenseNumber: `DL${Date.now()}`, 
  });

  const getValidManagerData = () => ({
    email: `manager.${Date.now()}@dealership.com`,
    password: "Password1@",
    firstName: "John",
    lastName: "Doe",
    phone: "08123456789",
    role: UserRole.MANAGER,
  });

  describe("Customer Registration", () => {
    it("should register a new customer successfully", async () => {
      const validCustomerData = getValidCustomerData();
      const response = await request(app)
        .post("/api/auth/register/customer")
        .send(validCustomerData);

      expect(response.status).toBe(201);
      expect(response.body.message).toBe("Customer registered successfully");
      expect(response.body.data).toHaveProperty("token");
      expect(response.body.data.user).toMatchObject({
        email: validCustomerData.email,
        firstName: validCustomerData.firstName,
        lastName: validCustomerData.lastName,
      });
    });

    it("should not register a customer with existing email", async () => {
      const validCustomerData = getValidCustomerData();

      await request(app)
        .post("/api/auth/register/customer")
        .send(validCustomerData);

      const response = await request(app)
        .post("/api/auth/register/customer")
        .send(validCustomerData);

      expect(response.status).toBe(400);
      expect(response.body.error).toContain("already registered");
    });
  });

  describe("Customer Login", () => {
    let validCustomerData: any;

    beforeEach(async () => {
      validCustomerData = getValidCustomerData();
      await request(app)
        .post("/api/auth/register/customer")
        .send(validCustomerData);
    });

    it("should login successfully with valid credentials", async () => {
      const response = await request(app)
        .post("/api/auth/login/customer")
        .send({
          email: validCustomerData.email,
          password: validCustomerData.password,
        });

      expect(response.status).toBe(200);
      expect(response.body.message).toBe("Customer login successful");
      expect(response.body.data).toHaveProperty("token");
      expect(response.body.data.user).toHaveProperty(
        "email",
        validCustomerData.email
      );
    });

    it("should not login with invalid password", async () => {
      const response = await request(app)
        .post("/api/auth/login/customer")
        .send({
          email: validCustomerData.email,
          password: "WrongPassword1@",
        });

      expect(response.status).toBe(400);
      expect(response.body.error).toBe("Invalid credentials");
    });
  });

  describe("Manager Registration", () => {
    it("should register a new manager successfully", async () => {
      const validManagerData = getValidManagerData();
      const response = await request(app)
        .post("/api/auth/register/manager")
        .set("Authorization", `Bearer ${adminToken}`)
        .send(validManagerData);

      expect(response.status).toBe(201);
      expect(response.body.message).toBe("Manager registered successfully");
      expect(response.body.data).toHaveProperty("token");
      expect(response.body.data.user).toMatchObject({
        email: validManagerData.email,
      });
    });

    it("should not register a manager without admin token", async () => {
      const validManagerData = getValidManagerData();
      const response = await request(app)
        .post("/api/auth/register/manager")
        .send(validManagerData);

      expect(response.status).toBe(401);
    });
  });

  describe("Manager Login", () => {
    let validManagerData: any;

    beforeEach(async () => {
      validManagerData = getValidManagerData();
      await request(app)
        .post("/api/auth/register/manager")
        .set("Authorization", `Bearer ${adminToken}`)
        .send(validManagerData);
    });

    it("should login successfully with valid credentials", async () => {
      const response = await request(app).post("/api/auth/login/manager").send({
        email: validManagerData.email,
        password: validManagerData.password,
      });

      expect(response.status).toBe(200);
      expect(response.body.message).toBe("Manager login successful");
      expect(response.body.data).toHaveProperty("token");
      expect(response.body.data.user).toHaveProperty(
        "email",
        validManagerData.email
      );
    });

    it("should not login with invalid password", async () => {
      const response = await request(app).post("/api/auth/login/manager").send({
        email: validManagerData.email,
        password: "WrongPassword1@",
      });

      expect(response.status).toBe(400);
      expect(response.body.error).toBe("Invalid credentials");
    });
  });
});
