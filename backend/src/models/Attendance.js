// import mongoose from "mongoose";

// const attendanceSchema = new mongoose.Schema({
//   userId: {
//     type: mongoose.Schema.Types.ObjectId,
//     ref: "User",
//     required: true,
//   },
//   managerId: {
//     type: mongoose.Schema.Types.ObjectId,
//     ref: "User",
//     default: null,
//   },
//   // date: {
//   //   type: Date,
//   //   default: () => new Date().toDateString(), // YYYY-MM-DD
//   // },
//   date: {
//   type: Date,
//   required: true,
//   },
//   checkIn: {
//     type: Date,
//     default: null,
//   },
//   checkOut: {
//     type: Date,
//     default: null,
//   },
//   hoursWorked: {
//     type: Number,
//     default: 0,
//   },
//   status: {
//     type: String,
//     enum: ["present", "absent", "late", "half-day"],
//     default: "absent",
//   },
//   notes: {
//     type: String,
//     default: "",
//   },
//   createdAt: {
//     type: Date,
//     default: Date.now,
//   },
// });

// // Calculate hours worked when checkOut is set
// attendanceSchema.pre("save", function () {
//   if (this.checkIn && this.checkOut) {
//     const diff = this.checkOut - this.checkIn;
//     this.hoursWorked = Math.round(diff / (1000 * 60 * 60) * 100) / 100; // hours with 2 decimals

//     // Auto-mark status
//     if (this.hoursWorked === 0) {
//       this.status = "absent";
//     } else if (this.hoursWorked < 8) {
//       this.status = "half-day";
//     } else {
//       this.status = "present";
//     }
//   }
// });

// export default mongoose.model("Attendance", attendanceSchema);



import mongoose from "mongoose";
import { getTodayStart } from "../utils/dateUtils.js";


const formatDuration = (totalSeconds) => {
  const hours = Math.floor(totalSeconds / 3600)
    .toString()
    .padStart(2, "0");
  const minutes = Math.floor((totalSeconds % 3600) / 60)
    .toString()
    .padStart(2, "0");
  const seconds = Math.floor(totalSeconds % 60)
    .toString()
    .padStart(2, "0");
  return `${hours}:${minutes}:${seconds}`;
};

const attendanceSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },

  managerId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    default: null,
  },

  // Always store date as start-of-day Date object
  date: {
    type: Date,
    required: true,
  },

  checkIn: {
    type: Date,
    default: null,
  },

  checkOut: {
    type: Date,
    default: null,
  },

  hoursWorked: {
    type: Number,
    default: 0,
  },

  hoursWorkedSeconds: {
    type: Number,
    default: 0,
  },

  hoursWorkedFormatted: {
    type: String,
    default: "00:00:00",
  },

  status: {
    type: String,
    enum: ["present", "absent", "late", "half-day"],
    default: "absent",
  },

  notes: {
    type: String,
    default: "",
  },

  createdAt: {
    type: Date,
    default: Date.now,
  },
});

/**
 * Ensure date is always today at 00:00
 * Runs before validation
 */
attendanceSchema.pre("validate", function () {
  if (!this.date) {
    // const today = new Date();
    // today.setHours(0, 0, 0, 0);
    // this.date = today;
    this.date = getTodayStart();
    
  }
});

/**
 * Auto-calculate hours worked & status
 * Runs on check-out
 */
attendanceSchema.pre("save", function () {
  if (this.checkIn && this.checkOut) {
    const diffMs = Math.max(0, this.checkOut - this.checkIn);
    const totalSeconds = Math.floor(diffMs / 1000);

    this.hoursWorkedSeconds = totalSeconds;
    this.hoursWorkedFormatted = formatDuration(totalSeconds);
    this.hoursWorked = Math.round((totalSeconds / 3600) * 100) / 100;

    // Auto-mark attendance status
    if (this.hoursWorked === 0) {
      this.status = "absent";
    } else if (this.hoursWorked < 8) {
      this.status = "half-day";
    } else {
      this.status = "present";
    }
  }
});

export default mongoose.model("Attendance", attendanceSchema);
