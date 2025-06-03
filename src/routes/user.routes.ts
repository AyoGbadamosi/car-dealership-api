import { Router } from "express";
import { authenticate, authorize } from "../middleware/auth.middleware";
import { UserRole } from "../enums/role.enum";
import { validateObjectId } from "../middleware/validateId.middleware";
import {
  getAllCustomers,
  getCustomerById,
  getAllManagers,
  getManagerById,
} from "../controllers/user.controller";

const router = Router();

// All routes are protected and admin-only
router.use(authenticate);

// Customer routes
router.get(
  "/customers",
  authorize([UserRole.ADMIN, UserRole.MANAGER]),
  getAllCustomers
);
router.get(
  "/customers/:id",
  validateObjectId,
  authorize([UserRole.ADMIN, UserRole.MANAGER]),
  getCustomerById
);

// Manager routes
router.get("/managers", authorize([UserRole.ADMIN]), getAllManagers);
router.get(
  "/managers/:id",
  validateObjectId,
  authorize([UserRole.ADMIN]),
  getManagerById
);

export default router;
