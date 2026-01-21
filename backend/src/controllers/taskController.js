import Task from "../models/Task.js";
import User from "../models/User.js";
import asyncHandler from "express-async-handler";
import { getIO } from "../utils/socket.js";

const emitTaskEvent = (event, taskDoc) => {
  try {
    const io = getIO();
    const task = taskDoc?.toObject ? taskDoc.toObject() : taskDoc;
    const recipients = [
      task?.createdBy?._id?.toString?.() || task?.createdBy?.toString?.(),
      task?.assignedTo?._id?.toString?.() || task?.assignedTo?.toString?.(),
      task?.assignedByManager?._id?.toString?.() || task?.assignedByManager?.toString?.(),
    ].filter(Boolean);

    if (!recipients.length) {
      io.emit(event, task);
      return;
    }

    recipients.forEach((userId) => {
      io.to(userId).emit(event, task);
    });
  } catch (err) {
    // Socket not initialized; ignore to avoid breaking request flow
  }
};

// @desc Get all tasks for logged-in user
export const getTasks = asyncHandler(async (req, res) => {
  // Return tasks created by user or assigned to user
  const tasks = await Task.find({
    $or: [{ createdBy: req.user._id }, { assignedTo: req.user._id }],
  })
    .populate("createdBy assignedTo assignedByManager", "name email role")
    .sort({ createdAt: -1 });

  res.json(tasks);
});

// @desc Create a task
export const createTask = asyncHandler(async (req, res) => {
  const { title, description, needsReply, priority, dueDate } = req.body;

  const task = await Task.create({
    title,
    description,
    createdBy: req.user._id,
    needsReply: needsReply || false,
    priority: priority || "medium",
    dueDate: dueDate ? new Date(dueDate) : undefined,
    status: "pending",
  });

  await task.populate("createdBy", "name email");

  emitTaskEvent("task:created", task);
  res.status(201).json(task);
});

// @desc Delete task (only creator)
export const deleteTask = asyncHandler(async (req, res) => {
  const task = await Task.findById(req.params.id);
  if (!task) {
    return res.status(404).json({ message: "Task not found" });
  }

  // Only creator can delete
  if (task.createdBy.toString() !== req.user._id.toString()) {
    return res.status(403).json({ message: "Only task creator can delete" });
  }

  await Task.findByIdAndDelete(req.params.id);
  emitTaskEvent("task:deleted", { _id: task._id });
  res.json({ message: "Task deleted successfully" });
});

// @desc Submit reply to task
export const submitReply = asyncHandler(async (req, res) => {
  const { text, imageUrl, pdfUrl } = req.body;
  const taskId = req.params.id;

  const task = await Task.findById(taskId);
  if (!task) {
    return res.status(404).json({ message: "Task not found" });
  }

  // Only assigned user can reply
  if (task.assignedTo.toString() !== req.user._id.toString()) {
    return res.status(403).json({ message: "Only assigned user can reply" });
  }

  // Reply must have at least text
  if (!text || text.trim() === "") {
    return res.status(400).json({ message: "Reply text is required" });
  }

  task.reply = {
    text,
    imageUrl: imageUrl || null,
    pdfUrl: pdfUrl || null,
    submittedAt: new Date(),
    submittedBy: req.user._id,
  };
  task.replied = true;

  await task.save();
  await task.populate("createdBy assignedTo", "name email");

  emitTaskEvent("task:updated", task);
  res.json({ message: "Reply submitted successfully", task });
});

// @desc Complete task (mark as done)
export const completeTask = asyncHandler(async (req, res) => {
  const task = await Task.findById(req.params.id);

  if (!task) {
    return res.status(404).json({ message: "Task not found" });
  }

  // Only assigned user can mark as done
  if (task.assignedTo.toString() !== req.user._id.toString()) {
    return res.status(403).json({ message: "Only assigned user can complete task" });
  }

  // If reply is required, verify it's submitted
  if (task.needsReply && !task.replied) {
    return res.status(400).json({ message: "Please submit reply before completing task" });
  }

  task.done = true;
  task.status = "completed";
  task.holdReason = "";

  await task.save();
  emitTaskEvent("task:updated", task);
  res.json({ message: "Task completed successfully", task });
});

// @desc Update task status (assigned user)
export const updateTaskStatus = asyncHandler(async (req, res) => {
  const { status, holdReason } = req.body;
  const allowed = ["pending", "in-progress", "on-hold", "completed"];

  const task = await Task.findById(req.params.id);

  if (!task) {
    return res.status(404).json({ message: "Task not found" });
  }

  // Only assigned user can update their task status
  if (task.assignedTo.toString() !== req.user._id.toString()) {
    return res.status(403).json({ message: "Only assigned user can update status" });
  }

  if (!allowed.includes(status)) {
    return res.status(400).json({ message: "Invalid status" });
  }

  if (status === "on-hold" && (!holdReason || holdReason.trim() === "")) {
    return res.status(400).json({ message: "Hold reason is required" });
  }

  task.status = status;
  task.holdReason = status === "on-hold" ? holdReason : "";
  task.done = status === "completed";

  await task.save();
  await task.populate(["assignedTo", "assignedByManager", "createdBy"]);

  emitTaskEvent("task:updated", task);
  res.json({ message: "Status updated", task });
});

// @desc Get task by ID
export const getTaskById = asyncHandler(async (req, res) => {
  const task = await Task.findById(req.params.id).populate(
    "createdBy assignedTo assignedByManager reply.submittedBy",
    "name email role"
  );

  if (!task) {
    return res.status(404).json({ message: "Task not found" });
  }

  // Check if user has access
  if (
    task.createdBy._id.toString() !== req.user._id.toString() &&
    task.assignedTo._id.toString() !== req.user._id.toString()
  ) {
    return res.status(403).json({ message: "Not authorized to view this task" });
  }

  res.json(task);
});

// @desc Manager assigns task to team member
export const assignTask = asyncHandler(async (req, res) => {
  const { title, description, assignedTo, dueDate, priority, needsReply } = req.body;

  // Only managers can assign tasks
  if (req.user.role !== "manager" && req.user.role !== "admin") {
    return res.status(403).json({ message: "Only managers can assign tasks" });
  }

  // Validate assignedTo is provided
  if (!assignedTo) {
    return res.status(400).json({ message: "Please assign task to a team member" });
  }

  // Validate user exists
  const targetUser = await User.findById(assignedTo);

  if (!targetUser) {
    return res.status(404).json({ message: "User not found" });
  }

  // Check if user is managed by this manager
  if (req.user.role === "manager" && targetUser.managerId.toString() !== req.user._id.toString()) {
    return res.status(403).json({ message: "User is not in your team" });
  }

  const task = await Task.create({
    title,
    description,
    createdBy: req.user._id,
    assignedTo,
    assignedByManager: req.user._id,
    dueDate,
    priority: priority || "medium",
    needsReply: needsReply || false,
    status: "pending",
  });

  await task.populate([
    { path: "assignedTo", select: "name email" },
    { path: "assignedByManager", select: "name email" },
    { path: "createdBy", select: "name email" },
  ]);

  emitTaskEvent("task:created", task);
  res.status(201).json(task);
});

// @desc Get all tasks assigned by this manager
export const getManagerTasks = asyncHandler(async (req, res) => {
  if (req.user.role !== "manager" && req.user.role !== "admin") {
    return res.status(403).json({ message: "Only managers can view assigned tasks" });
  }

  const tasks = await Task.find({ assignedByManager: req.user._id })
    .populate("assignedTo", "name email")
    .populate("assignedByManager", "name email")
    .populate("createdBy", "name email")
    .sort({ createdAt: -1 });

  res.json(tasks);
});
