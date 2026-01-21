import User from "../models/User.js";
import LoginHistory from "../models/LoginHistory.js";
import Attendance from "../models/Attendance.js";
import { getIO } from "../utils/socket.js";
import asyncHandler from "express-async-handler";

export const getAllUsers = async (req, res) => {
  const users = await User.find({ isDeleted: { $ne: true } }).select("-password");
  res.json(users);
};

export const getAllUsersAdmin = async (req, res) => {
  try {
    // Check if user is admin
    if (req.user.role !== "admin") {
      return res.status(403).json({ message: "Not authorized" });
    }

    const users = await User.find({ isDeleted: { $ne: true } })
      .select("-password")
      .populate("managerId", "name email role");

    res.json(users);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const updateUser = async (req, res) => {
  try {
    // Only admin can update users
    if (req.user.role !== "admin") {
      return res.status(403).json({ message: "Not authorized" });
    }

    const { role, managerId } = req.body;
    const user = await User.findById(req.params.id);

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    const previousManagerId = user.managerId ? user.managerId.toString() : null;

    if (role) user.role = role;
    if (managerId !== undefined) user.managerId = managerId || null;

    await user.save();

    // Keep historical attendance aligned with current manager assignment
    await Attendance.updateMany(
      { userId: user._id },
      { managerId: user.managerId || null }
    );

    const updated = await User.findById(user._id)
      .select("-password")
      .populate("managerId", "name email role");

    try {
      const io = getIO();
      const payload = {
        userId: updated._id.toString(),
        managerId: updated.managerId?._id?.toString() || null,
      };

      const targets = [previousManagerId, payload.managerId].filter(Boolean);
      if (targets.length === 0) {
        io.emit("manager:assignments-updated", payload);
      } else {
        targets.forEach((id) => io.to(id).emit("manager:assignments-updated", payload));
      }
    } catch (err) {
      // Socket not initialized; continue without blocking response
    }

    res.json(updated);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const getUserLoginHistory = async (req, res) => {
  const { id } = req.params;
  const history = await LoginHistory.find({ user: id });
  res.json(history);
};

export const getManagerTeam = asyncHandler(async (req, res) => {
  if (req.user.role !== "manager" && req.user.role !== "admin") {
    return res.status(403).json({ message: "Not authorized" });
  }

  const targetManagerId = req.user.role === "manager" ? req.user._id : req.query.managerId || req.user._id;

  const users = await User.find({ managerId: targetManagerId })
    .select("name email role managerId")
    .populate("managerId", "name email role");

  res.json(users);
});
