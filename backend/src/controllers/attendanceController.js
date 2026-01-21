import Attendance from "../models/Attendance.js";
import { getTodayStart } from "../utils/dateUtils.js";




export const checkIn = async (req, res) => {
  try {
    // const today = new Date().toDateString();

    const today = getTodayStart();


    const existing = await Attendance.findOne({
      userId: req.user._id,
      date: today,
    });

    if (existing && existing.checkIn) {
      return res.status(400).json({ message: "Already checked in today" });
    }

    const attendance = await Attendance.create({
      userId: req.user._id,
      managerId: req.user.managerId,
      date: today,
      checkIn: new Date(),
      status: "present",
    });

    res.status(201).json({ message: "Checked in successfully", attendance });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const checkOut = async (req, res) => {
  try {
     // const today = new Date().toDateString();
     const today = getTodayStart();


    const attendance = await Attendance.findOne({
      userId: req.user._id,
      date: today,
    });

    if (!attendance) {
      return res.status(404).json({ message: "No check-in found for today" });
    }

    if (attendance.checkOut) {
      return res.status(400).json({ message: "Already checked out today" });
    }

    attendance.checkOut = new Date();
    await attendance.save();

    res.json({ message: "Checked out successfully", attendance });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const getTodayAttendance = async (req, res) => {
  try {
    // const today = new Date().toDateString();
    const today = getTodayStart();

    const attendance = await Attendance.findOne({
      userId: req.user._id,
      date: today,
    });

    res.json(attendance || { message: "No attendance record for today" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const getTeamAttendance = async (req, res) => {
  try {
    if (req.user.role !== "manager" && req.user.role !== "admin") {
      return res.status(403).json({ message: "Not authorized" });
    }

    let query = {};
    if (req.user.role === "manager") {
      query.managerId = req.user._id;
    }

    const attendance = await Attendance.find(query)
      .populate("userId", "name email")
      .sort({ date: -1 });

    res.json(attendance);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get the current user's attendance history (recent first)
export const getMyAttendanceHistory = async (req, res) => {
  try {
    const history = await Attendance.find({ userId: req.user._id })
      .sort({ date: -1 })
      .limit(14); // last 2 weeks is enough for dashboard

    res.json(history);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Manager/Admin updates employee attendance status
export const updateAttendanceStatus = async (req, res) => {
  try {
    if (req.user.role !== "manager" && req.user.role !== "admin") {
      return res.status(403).json({ message: "Not authorized" });
    }

    const { attendanceId, status } = req.body;
    
    if (!attendanceId || !status) {
      return res.status(400).json({ message: "Missing attendanceId or status" });
    }

    const validStatuses = ["present", "absent", "half-day", "late"];
    if (!validStatuses.includes(status)) {
      return res.status(400).json({ message: "Invalid status" });
    }

    const attendance = await Attendance.findById(attendanceId);
    if (!attendance) {
      return res.status(404).json({ message: "Attendance record not found" });
    }

    // Verify manager can only update their team's records
    if (req.user.role === "manager" && attendance.managerId.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: "Cannot update other team's records" });
    }

    attendance.status = status;
    await attendance.save();

    res.json({ message: "Attendance updated successfully", attendance });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Reset today's attendance (delete checkout)
export const resetTodayAttendance = async (req, res) => {
  try {
    const today = getTodayStart();

    const attendance = await Attendance.findOne({
      userId: req.user._id,
      date: today,
    });

    if (!attendance) {
      return res.status(404).json({ message: "No attendance record for today" });
    }

    // Reset checkout time and recalculate status
    attendance.checkOut = null;
    attendance.hoursWorked = 0;
    attendance.status = "present"; // Back to present since they're still working
    
    await attendance.save();

    res.json({ message: "Today's attendance reset successfully", attendance });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
