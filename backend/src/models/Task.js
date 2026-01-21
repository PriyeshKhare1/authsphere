import mongoose from "mongoose";

const taskSchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: String,
  createdBy: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true }, // User who created the task
  assignedTo: { type: mongoose.Schema.Types.ObjectId, ref: "User" }, // Who it's assigned to
  assignedByManager: { type: mongoose.Schema.Types.ObjectId, ref: "User" }, // Manager who assigned it
  dueDate: Date,
  priority: { type: String, enum: ["low", "medium", "high"], default: "medium" },
  status: { type: String, enum: ["pending", "in-progress", "on-hold", "completed"], default: "pending" },
  holdReason: { type: String, default: "" },
  needsReply: { type: Boolean, default: false }, // Does task require a reply?
  replied: { type: Boolean, default: false }, // Has user replied?
  reply: {
    text: String,
    imageUrl: String, // URL to uploaded image
    pdfUrl: String, // URL to uploaded PDF
    submittedAt: Date,
    submittedBy: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  },
  done: { type: Boolean, default: false },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now },
});

export default mongoose.model("Task", taskSchema);
