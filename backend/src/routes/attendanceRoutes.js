import express from "express";
import { protect } from "../middleware/authMiddleware.js";
import { checkIn, checkOut, getTodayAttendance, getTeamAttendance, updateAttendanceStatus, resetTodayAttendance, getMyAttendanceHistory } from "../controllers/attendanceController.js";

const router = express.Router();

router.post("/checkin", protect, checkIn);
router.post("/checkout", protect, checkOut);
router.get("/today", protect, getTodayAttendance);
router.get("/team", protect, getTeamAttendance);
router.get("/history", protect, getMyAttendanceHistory);
router.put("/update-status", protect, updateAttendanceStatus);
router.post("/reset-today", protect, resetTodayAttendance);

export default router;
