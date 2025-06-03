import { Request, Response } from "express";
import { AuthenticatedRequest } from "../middleware/auth.middleware";
import { PurchaseService } from "../services/purchase.service";
import { UserRole } from "../enums/role.enum";

const purchaseService = new PurchaseService();

export const createPurchase = async (
  req: AuthenticatedRequest,
  res: Response
): Promise<void> => {
  try {
    if (!req.user || req.user.role !== UserRole.CUSTOMER) {
      res.status(403).json({
        message: "Only customers can make purchases",
      });
      return;
    }

    const { carId, purchasePrice, paymentMethod } = req.body;
    const customerId = req.user.id;

    const purchase = await purchaseService.createPurchase(
      carId,
      customerId,
      purchasePrice,
      paymentMethod
    );

    res.status(201).json({
      message: "Purchase completed successfully",
      data: purchase,
    });
  } catch (error: any) {
    if (error.code === 11000) {
      res.status(400).json({ message: "Car has already been purchased" });
      return;
    }
    res.status(400).json({
      message: "Failed to create purchase",
      error: error.message,
    });
  }
};

export const getPurchaseById = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const purchase = await purchaseService.getPurchaseById(req.params.id);

    res.json({
      message: "Purchase retrieved successfully",
      data: purchase,
    });
  } catch (error: any) {
    res.status(404).json({
      message: "Failed to retrieve purchase",
      error: error.message,
    });
  }
};

export const getCustomerPurchases = async (
  req: AuthenticatedRequest,
  res: Response
): Promise<void> => {
  try {
    const customerId = req.user?.id;
    const purchases = await purchaseService.getCustomerPurchases(customerId!);

    res.json({
      message: "Customer purchases retrieved successfully",
      data: purchases,
    });
  } catch (error: any) {
    res.status(400).json({
      message: "Failed to retrieve customer purchases",
      error: error.message,
    });
  }
};

export const getAllPurchases = async (
  req: AuthenticatedRequest,
  res: Response
): Promise<void> => {
  try {
    const purchases = await purchaseService.getAllPurchases();

    res.json({
      message: "All purchases retrieved successfully",
      data: purchases,
    });
  } catch (error: any) {
    res.status(400).json({
      message: "Failed to retrieve purchases",
      error: error.message,
    });
  }
};
