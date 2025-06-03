import { Router } from "express";
import {
  createCar,
  getCars,
  getCarById,
  updateCar,
  deleteCar,
  getCarsByCategory,
} from "../controllers/car.controller";
import { validate } from "../middleware/validation.middleware";
import { authenticate, authorize } from "../middleware/auth.middleware";
import { UserRole } from "../enums/role.enum";
import { validateObjectId } from "../middleware/validateId.middleware";
import { createCarSchema, updateCarSchema } from "../schemas/validation";

const router = Router();

// All routes require authentication
router.use(authenticate);

// Public routes (authenticated users)
router.get("/", getCars);
router.get("/:id", validateObjectId, getCarById);
router.get("/category/:category", getCarsByCategory);

// Protected routes (manager only)
router.post(
  "/",
  authorize([UserRole.MANAGER, UserRole.ADMIN]),
  validate(createCarSchema),
  createCar
);

router.put(
  "/:id",
  authorize([UserRole.MANAGER, UserRole.ADMIN]),
  validateObjectId,
  validate(updateCarSchema),
  updateCar
);

router.delete(
  "/:id",
  authorize([UserRole.MANAGER, UserRole.ADMIN]),
  validateObjectId,
  deleteCar
);

export default router;
