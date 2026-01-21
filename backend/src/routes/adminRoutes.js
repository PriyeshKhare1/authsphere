import express from "express";
import {
  getAllUsers,
  getRemovedUsers,
  deleteUser,
  restoreUser,
  permanentlyDeleteUser,
  updateUserRole,
} from "../controllers/adminController.js";
import { protect } from "../middleware/authMiddleware.js";
import { admin } from "../middleware/role.middleware.js";

const router = express.Router();

// Protect all admin routes
router.use(protect);
router.use(admin);

// User management
router.get("/users", getAllUsers); // Get all active users
router.get("/users/removed", getRemovedUsers); // Get all deleted/fired users (archive)
router.put("/users/:userId/role", updateUserRole); // Change user role (promote/demote)

// Soft delete (Fire/Remove user - data archived)
router.delete("/users/:userId", deleteUser); // Soft delete (archive)

// Restore deleted user (Rehire)
router.put("/users/:userId/restore", restoreUser);

// Permanent delete (DANGER - requires password confirmation)
router.delete("/users/:userId/permanent", permanentlyDeleteUser);

export default router;
