import { Router } from "express";
import { authenticate, authorize } from "../middleware/auth.middleware";
import { UserRole } from "../enums/role.enum";
import { validateObjectId } from "../middleware/validateId.middleware";
import { validate } from "../middleware/validation.middleware";
import { createPurchaseSchema } from "../schemas/validation";
import {
  createPurchase,
  getPurchaseById,
  getCustomerPurchases,
  getAllPurchases,
} from "../controllers/purchase.controller";

const router = Router();

// All routes require authentication
router.use(authenticate);

// Customer routes
router.post("/", validate(createPurchaseSchema), createPurchase);
router.get(
  "/my-purchases",
  authorize([UserRole.CUSTOMER]),
  getCustomerPurchases
);

// Admin/Manager routes
router.get("/", authorize([UserRole.ADMIN, UserRole.MANAGER]), getAllPurchases);
router.get(
  "/:id",
  authorize([UserRole.ADMIN, UserRole.MANAGER]),
  validateObjectId,
  getPurchaseById
);

export default router;
