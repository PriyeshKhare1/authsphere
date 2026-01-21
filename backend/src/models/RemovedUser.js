import mongoose from "mongoose";

const removedUserSchema = new mongoose.Schema({
  // Original user data
  originalUserId: { type: mongoose.Schema.Types.ObjectId, required: true }, // Original _id from users collection
  name: { type: String, required: true },
  email: { type: String, required: true },
  role: { type: String, enum: ["admin", "manager", "user"], required: true },
  managerId: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  
  // Deletion metadata
  deletedAt: { type: Date, default: Date.now },
  deletedBy: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  deletionReason: { type: String, default: "No reason provided" },
  
  // Original user creation date
  originalCreatedAt: { type: Date },
  
  // Email verification status at time of deletion
  wasEmailVerified: { type: Boolean, default: false },
});

export default mongoose.model("RemovedUser", removedUserSchema);
