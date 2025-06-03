import { Request, Response } from "express";
import { UserRole } from "../enums/role.enum";
import {
  CustomerRegisterInput,
  ManagerRegisterInput,
  LoginInput,
} from "../schemas/validation/auth.validation";
import { AuthService } from "../services/auth.service";

interface AuthenticatedRequest extends Request {
  user?: {
    id: string;
    role: UserRole;
    email: string;
  };
}

const authService = new AuthService();

export const register = async (req: Request, res: Response): Promise<void> => {
  try {
    const isManagerRegistration = req.path.includes("/register/manager");
    let result;

    if (isManagerRegistration) {
      const managerData = req.body as ManagerRegisterInput;
      result = await authService.registerManager(managerData);
    } else {
      const customerData = req.body as CustomerRegisterInput;
      result = await authService.registerCustomer(customerData);
    }

    res.status(201).json({
      message: `${
        isManagerRegistration ? "Manager" : "Customer"
      } registered successfully`,
      data: result,
    });
  } catch (error: any) {
    if (error.code === 11000) {
      const field = Object.keys(error.keyPattern)[0];
      const value = error.keyValue[field];

      if (field === "licenseNumber") {
        res.status(400).json({
          message: "Registration failed",
          error: `License number ${value} is already registered`,
        });
        return;
      }

      if (field === "email") {
        res.status(400).json({
          message: "Registration failed",
          error: `Email ${value} is already registered`,
        });
        return;
      }
    }

    res.status(400).json({
      message: "Registration failed",
      error: error.message,
    });
  }
};

export const customerLogin = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const credentials = req.body as LoginInput;
    const result = await authService.customerLogin(credentials);

    res.json({
      message: "Customer login successful",
      data: result,
    });
  } catch (error: any) {
    res.status(400).json({
      message: "Customer login failed",
      error: error.message,
    });
  }
};

export const managerLogin = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const credentials = req.body as LoginInput;
    const result = await authService.managerLogin(credentials);

    res.json({
      message: "Manager login successful",
      data: result,
    });
  } catch (error: any) {
    res.status(400).json({
      message: "Manager login failed",
      error: error.message,
    });
  }
};

export const getProfile = async (
  req: AuthenticatedRequest,
  res: Response
): Promise<void> => {
  try {
    if (!req.user) {
      res.status(401).json({ message: "User not authenticated" });
      return;
    }

    const { role, id } = req.user;
    const user = await authService.getProfile(id, role);

    res.json({
      message: "Profile retrieved successfully",
      data: user,
    });
  } catch (error: any) {
    res.status(400).json({
      message: "Failed to retrieve profile",
      error: error.message,
    });
  }
};

export const adminLogin = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const credentials = req.body as LoginInput;
    const result = await authService.adminLogin(credentials);

    res.json({
      message: "Admin login successful",
      data: result,
    });
  } catch (error: any) {
    res.status(400).json({
      message: "Admin login failed",
      error: error.message,
    });
  }
};

export const changePassword = async (
  req: AuthenticatedRequest,
  res: Response
): Promise<void> => {
  try {
    if (!req.user) {
      res.status(401).json({ message: "User not authenticated" });
      return;
    }

    const { currentPassword, newPassword } = req.body;
    const { id, role } = req.user;

    const result = await authService.changePassword(
      id,
      role,
      currentPassword,
      newPassword
    );

    res.json(result);
  } catch (error: any) {
    res.status(400).json({
      message: "Password change failed",
      error: error.message,
    });
  }
};
