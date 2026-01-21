import express from "express";
import { protect } from "../middleware/authMiddleware.js";
import { createTask, getTasks, submitReply, completeTask, assignTask, getManagerTasks, deleteTask, getTaskById, updateTaskStatus } from "../controllers/taskController.js";

const router = express.Router();

router.route("/").get(protect, getTasks).post(protect, createTask);
router.route("/:id").get(protect, getTaskById).delete(protect, deleteTask);
router.route("/assign").post(protect, assignTask); // Manager assigns task
router.route("/manager/all").get(protect, getManagerTasks); // Get tasks assigned by manager
router.route("/:id/reply").post(protect, submitReply);
router.route("/:id/complete").put(protect, completeTask);
router.route("/:id/status").put(protect, updateTaskStatus);

export default router;
