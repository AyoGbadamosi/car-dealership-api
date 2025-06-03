import { Request, Response } from "express";
import { AuthenticatedRequest } from "../middleware/auth.middleware";
import {
  CreateCarInput,
  UpdateCarInput,
} from "../schemas/validation/car.validation";
import { CarService } from "../services/car.service";

const carService = new CarService();

export const createCar = async (
  req: AuthenticatedRequest,
  res: Response
): Promise<void> => {
  try {
    if (!req.user) {
      res.status(401).json({
        message: "Unauthorized - User not authenticated",
      });
      return;
    }

    const carData = req.body as CreateCarInput;
    const car = await carService.createCar(carData, req.user.id, req.user.role);

    res.status(201).json({
      message: "Car created successfully",
      data: car,
    });
  } catch (error: any) {
    if (error.code === 11000) {
      res.status(400).json({
        message: "Car with this VIN already exists",
      });
      return;
    }
    res.status(400).json({
      message: "Failed to create car",
      error: error.message,
    });
  }
};

export const getCars = async (req: Request, res: Response): Promise<void> => {
  try {
    const result = await carService.getCars(req.query);

    res.json({
      message: "Cars retrieved successfully",
      data: result,
    });
  } catch (error: any) {
    res.status(400).json({
      message: "Failed to retrieve cars",
      error: error.message,
    });
  }
};

export const getCarById = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const car = await carService.getCarById(req.params.id);

    res.json({
      message: "Car retrieved successfully",
      data: car,
    });
  } catch (error: any) {
    res.status(404).json({
      message: "Failed to retrieve car",
      error: error.message,
    });
  }
};

export const updateCar = async (
  req: AuthenticatedRequest,
  res: Response
): Promise<void> => {
  try {
    const carData = req.body as UpdateCarInput;
    const car = await carService.updateCar(req.params.id, carData);

    res.json({
      message: "Car updated successfully",
      data: car,
    });
  } catch (error: any) {
    if (error.code === 11000) {
      res.status(400).json({
        message: "Car with this VIN already exists",
      });
      return;
    }
    res.status(400).json({
      message: "Failed to update car",
      error: error.message,
    });
  }
};

export const deleteCar = async (
  req: AuthenticatedRequest,
  res: Response
): Promise<void> => {
  try {
    await carService.deleteCar(req.params.id);

    res.json({
      message: "Car deleted successfully",
    });
  } catch (error: any) {
    res.status(400).json({
      message: "Failed to delete car",
      error: error.message,
    });
  }
};

export const getCarsByCategory = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const cars = await carService.getCarsByCategory(req.params.category);

    res.json({
      message: "Cars retrieved successfully",
      data: cars,
    });
  } catch (error: any) {
    res.status(400).json({
      message: "Failed to retrieve cars",
      error: error.message,
    });
  }
};
