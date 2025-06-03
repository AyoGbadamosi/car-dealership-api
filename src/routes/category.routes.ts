import { Router } from "express";
import {
  createCategory,
  getCategories,
  getCategoryById,
  updateCategory,
  deleteCategory,
} from "../controllers/category.controller";
import { validate } from "../middleware/validation.middleware";
import {
  createCategorySchema,
  updateCategorySchema,
} from "../schemas/validation";
import { authenticate, authorize } from "../middleware/auth.middleware";
import { validateObjectId } from "../middleware/validateId.middleware";
import { UserRole } from "../enums/role.enum";

const router = Router();

// All routes require authentication
router.use(authenticate);

// Public routes (authenticated users)
router.get("/", getCategories);
router.get("/:id", validateObjectId, getCategoryById);

// Protected routes (manager only)
router.post(
  "/",
  authorize([UserRole.MANAGER, UserRole.ADMIN]),
  validate(createCategorySchema),
  createCategory
);

router.put(
  "/:id",
  authorize([UserRole.MANAGER, UserRole.ADMIN]),
  validateObjectId,
  validate(updateCategorySchema),
  updateCategory
);

router.delete(
  "/:id",
  authorize([UserRole.MANAGER, UserRole.ADMIN]),
  validateObjectId,
  deleteCategory
);

export default router;
