import { Router } from "express";
import {
  register,
  customerLogin,
  managerLogin,
  getProfile,
  adminLogin,
  changePassword,
} from "../controllers/auth.controller";
import { authenticate, authorize } from "../middleware/auth.middleware";
import { validate } from "../middleware/validation.middleware";
import {
  customerRegisterSchema,
  loginSchema,
  managerRegisterSchema,
  changePasswordSchema,
} from "../schemas/validation";
import { UserRole } from "../enums/role.enum";

const router = Router();

// Public routes
router.post("/register/customer", validate(customerRegisterSchema), register);
router.post(
  "/register/manager",
  authenticate,
  authorize([UserRole.ADMIN]),
  validate(managerRegisterSchema),
  register
);
router.post("/login/customer", validate(loginSchema), customerLogin);
router.post("/login/manager", validate(loginSchema), managerLogin);
router.post("/admin/login", validate(loginSchema), adminLogin);

// Protected routes
router.get("/profile", authenticate, getProfile);
router.post(
  "/change-password",
  authenticate,
  validate(changePasswordSchema),
  changePassword
);

export default router;
