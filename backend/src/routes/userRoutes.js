import express from "express";
import { protect } from "../middleware/authMiddleware.js";
import { getAllUsers, getUserLoginHistory, getAllUsersAdmin, updateUser, getManagerTeam } from "../controllers/userController.js";

const router = express.Router();

router.get("/", protect, getAllUsers);
router.get("/all", protect, getAllUsersAdmin); // Admin gets all users
router.get("/team", protect, getManagerTeam); // Manager team members
router.get("/:id/history", protect, getUserLoginHistory);
router.put("/:id", protect, updateUser); // Update user role and manager

export default router;
