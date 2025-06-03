import Manager from "../models/Manager";
import Customer from "../models/Customer";
import Admin from "../models/Admin";
import { generateToken } from "../utils/jwt";
import { UserRole } from "../enums/role.enum";
import {
  CustomerRegisterInput,
  ManagerRegisterInput,
  LoginInput,
} from "../schemas/validation/auth.validation";
import {
  formatManagerResponse,
  formatCustomerResponse,
} from "../utils/format.utils";
import { IAdmin } from "../interfaces/index";

export class AuthService {
  async registerManager(managerData: ManagerRegisterInput) {
    const existingManager = await Manager.findOne({
      where: { email: managerData.email },
    });

    if (existingManager) {
      throw new Error("Email already registered");
    }
    const user = await Manager.create({
      ...managerData,
      role: UserRole.MANAGER,
    });

    const token = generateToken(user);
    const { password: _, ...userResponse } = user.toObject();

    return {
      user: userResponse,
      token,
    };
  }

  async registerCustomer(customerData: CustomerRegisterInput) {
    const existingCustomer = await Customer.findOne({
      email: customerData.email,
    });

    if (existingCustomer) {
      throw new Error("Email already registered");
    }

    const user = await Customer.create({
      ...customerData,
      role: UserRole.CUSTOMER,
    });

    const token = generateToken(user);
    const { password: _, ...userResponse } = user.toObject();

    return {
      user: userResponse,
      token,
    };
  }

  async customerLogin(credentials: LoginInput) {
    const customer = await Customer.findOne({ email: credentials.email });
    if (!customer) {
      throw new Error("Invalid credentials");
    }

    const isPasswordValid = await customer.comparePassword(
      credentials.password
    );
    if (!isPasswordValid) {
      throw new Error("Invalid credentials");
    }

    customer.lastLogin = new Date();
    await customer.save();

    const token = generateToken(customer);
    const userResponse = formatCustomerResponse(customer);

    return {
      user: userResponse,
      token,
    };
  }

  async managerLogin(credentials: LoginInput) {
    const manager = await Manager.findOne({ email: credentials.email });
    if (!manager) {
      throw new Error("Invalid credentials");
    }

    const isPasswordValid = await manager.comparePassword(credentials.password);
    if (!isPasswordValid) {
      throw new Error("Invalid credentials");
    }

    manager.lastLogin = new Date();
    await manager.save();

    const token = generateToken(manager);
    const userResponse = formatManagerResponse(manager);

    return {
      user: userResponse,
      token,
    };
  }

  async getProfile(userId: string, role: UserRole) {
    if (role === UserRole.MANAGER) {
      const user = await Manager.findById(userId);
      if (!user) {
        throw new Error("Manager not found");
      }
      return formatManagerResponse(user);
    } else {
      const user = await Customer.findById(userId);
      if (!user) {
        throw new Error("Customer not found");
      }
      return formatCustomerResponse(user);
    }
  }

  async adminLogin(credentials: LoginInput) {
    const admin = await Admin.findOne({ email: credentials.email });
    if (!admin) {
      throw new Error("Invalid credentials");
    }

    const isPasswordValid = await admin.comparePassword(credentials.password);
    if (!isPasswordValid) {
      throw new Error("Invalid credentials");
    }

    const token = generateToken(admin as IAdmin);

    return {
      user: {
        id: admin._id,
        email: admin.email,
        role: admin.role,
      },
      token,
    };
  }

  async changePassword(
    userId: string,
    role: UserRole,
    currentPassword: string,
    newPassword: string
  ) {
    let user;

    switch (role) {
      case UserRole.ADMIN:
        user = await Admin.findById(userId);
        break;
      case UserRole.MANAGER:
        user = await Manager.findById(userId);
        break;
      case UserRole.CUSTOMER:
        user = await Customer.findById(userId);
        break;
      default:
        throw new Error("Invalid user role");
    }

    if (!user) {
      throw new Error("User not found");
    }

    const isPasswordValid = await user.comparePassword(currentPassword);
    if (!isPasswordValid) {
      throw new Error("Current password is incorrect");
    }

    user.password = newPassword;
    await user.save();

    return {
      message: "Password changed successfully",
    };
  }
}
