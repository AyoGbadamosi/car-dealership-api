import { Request, Response } from "express";
import { UserService } from "../services/user.service";

const userService = new UserService();

// Get all customers
export const getAllCustomers = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const customers = await userService.getAllCustomers();
    res.json({
      message: "Customers retrieved successfully",
      data: customers,
    });
  } catch (error: any) {
    res.status(400).json({
      message: "Failed to retrieve customers",
      error: error.message,
    });
  }
};

// Get customer by ID
export const getCustomerById = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const customer = await userService.getCustomerById(req.params.id);
    res.json({
      message: "Customer retrieved successfully",
      data: customer,
    });
  } catch (error: any) {
    res.status(404).json({
      message: "Failed to retrieve customer",
      error: error.message,
    });
  }
};

// Get all managers
export const getAllManagers = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const managers = await userService.getAllManagers();
    res.json({
      message: "Managers retrieved successfully",
      data: managers,
    });
  } catch (error: any) {
    res.status(400).json({
      message: "Failed to retrieve managers",
      error: error.message,
    });
  }
};

// Get manager by ID
export const getManagerById = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const manager = await userService.getManagerById(req.params.id);
    res.json({
      message: "Manager retrieved successfully",
      data: manager,
    });
  } catch (error: any) {
    res.status(404).json({
      message: "Failed to retrieve manager",
      error: error.message,
    });
  }
};
