import mongoose from "mongoose";

const loginHistorySchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  checkIn: Date,
  checkOut: Date,
});

export default mongoose.model("LoginHistory", loginHistorySchema);
