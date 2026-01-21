// // import Task from "../models/Task.js";

// // export const createTask = async (req, res) => {
// //   const { title, description, assignedTo, needsReply } = req.body;
// //   const task = await Task.create({
// //     title,
// //     description,
// //     assignedTo,
// //     needsReply,
// //     createdBy: req.user._id,
// //   });
// //   res.status(201).json(task);
// // };

// // export const getTasks = async (req, res) => {
// //   const tasks = await Task.find().populate("assignedTo", "name email");
// //   res.json(tasks);
// // };

// // export const updateTaskReply = async (req, res) => {
// //   const { taskId } = req.params;
// //   const { reply } = req.body;
// //   const task = await Task.findById(taskId);
// //   if (!task) return res.status(404).json({ message: "Task not found" });
// //   task.reply = reply;
// //   task.replied = true;
// //   await task.save();
// //   res.json(task);
// // };

// // export const markTaskDone = async (req, res) => {
// //   const { taskId } = req.params;
// //   const task = await Task.findById(taskId);
// //   if (!task) return res.status(404).json({ message: "Task not found" });
// //   task.done = true;
// //   await task.save();
// //   res.json(task);
// // };



// import Task from "../models/Task.js";
// import User from "../models/User.js";
// import asyncHandler from "express-async-handler";

// // @desc Get all tasks for logged-in user
// export const getTasks = asyncHandler(async (req, res) => {
//   // Return tasks created by user or assigned to user
//   const tasks = await Task.find({
//     $or: [{ createdBy: req.user._id }, { assignedTo: req.user._id }],
//   })
//     .populate("createdBy assignedTo assignedByManager", "name email role")
//     .sort({ createdAt: -1 });

//   res.json(tasks);
// });

// // @desc Create a task
// export const createTask = asyncHandler(async (req, res) => {
//   const { title, description, needsReply, priority } = req.body;
//   const task = await Task.create({
//     title,
//     description,
//     createdBy: req.user._id,
//     needsReply: needsReply || false,
//     priority: priority || "medium",
//   });
//   res.status(201).json(task);
// });

// // @desc Mark task done
// export const markTaskDone = asyncHandler(async (req, res) => {
//   const task = await Task.findById(req.params.taskId);
//   if (!task) throw new Error("Task not found");

//   task.done = true;
//   await task.save();
//   res.json(task);
// });

// // @desc Update reply
// export const updateTaskReply = asyncHandler(async (req, res) => {
//   const { reply } = req.body;
//   const task = await Task.findById(req.params.taskId);
//   if (!task) throw new Error("Task not found");

//   task.reply = reply;
//   task.replied = true;
//   await task.save();
//   res.json(task);
// });

// // @desc Manager assigns task to team member
// export const assignTask = asyncHandler(async (req, res) => {
//   const { title, description, userId, dueDate, priority } = req.body;

//   // Only managers can assign tasks
//   if (req.user.role !== "manager" && req.user.role !== "admin") {
//     return res.status(403).json({ message: "Only managers can assign tasks" });
//   }

//   // Validate userId is team member of this manager
//   const targetUser = await User.findById(userId);
  
//   if (!targetUser) {
//     return res.status(404).json({ message: "User not found" });
//   }

//   // Check if user is managed by this manager
//   if (req.user.role === "manager" && targetUser.managerId.toString() !== req.user._id.toString()) {
//     return res.status(403).json({ message: "User is not in your team" });
//   }

//   const task = await Task.create({
//     title,
//     description,
//     createdBy: req.user._id,
//     assignedTo: userId,
//     assignedByManager: req.user._id,
//     dueDate,
//     priority: priority || "medium",
//     status: "pending",
//   });

//   const populated = await task.populate([
//     { path: "assignedTo", select: "name email" },
//     { path: "assignedByManager", select: "name email" },
//   ]);

//   res.status(201).json(populated);
// });

// // @desc Get all tasks assigned by this manager
// export const getManagerTasks = asyncHandler(async (req, res) => {
//   if (req.user.role !== "manager" && req.user.role !== "admin") {
//     return res.status(403).json({ message: "Only managers can view assigned tasks" });
//   }

//   let query = { assignedByManager: req.user._id };
  
//   const tasks = await Task.find(query)
//     .populate("assignedTo", "name email")
//     .populate("assignedByManager", "name email")
//     .sort({ createdAt: -1 });

//   res.json(tasks);
// });
