// import express from "express";
// import cors from "cors";
// import authRoutes from "./routes/auth.routes.js";
// import taskRoutes from "./routes/task.routes.js";
// import userRoutes from "./routes/user.routes.js";

// const app = express();

// app.use(cors());
// app.use(express.json());

// app.use("/api/auth", authRoutes);
// app.use("/api/tasks", taskRoutes);
// app.use("/users", userRoutes); // new

// export default app;


import express from "express";
import cors from "cors";
import authRoutes from "./routes/authRoutes.js";
import taskRoutes from "./routes/taskRoutes.js";
import userRoutes from "./routes/userRoutes.js";
import attendanceRoutes from "./routes/attendanceRoutes.js";
import adminRoutes from "./routes/adminRoutes.js";
import { notFound, errorHandler } from "./middleware/errorMiddleware.js";

const app = express();

// CORS Configuration (allow common dev ports + env overrides)
const allowedOrigins = [
  process.env.FRONTEND_URL,
  process.env.FRONTEND_URL_2,
  "http://localhost:5173",
  "http://localhost:5174",
  "http://localhost:5176",
].filter(Boolean);

app.use(
  cors({
    origin: (origin, callback) => {
      if (!origin || allowedOrigins.includes(origin)) {
        return callback(null, true);
      }
      return callback(new Error("Not allowed by CORS"));
    },
    credentials: true,
    optionsSuccessStatus: 200,
  })
);
app.use(express.json());

app.use("/api/auth", authRoutes);
app.use("/api/tasks", taskRoutes);
app.use("/api/users", userRoutes);
app.use("/api/attendance", attendanceRoutes);
app.use("/api/admin", adminRoutes); // Admin user management

app.use(notFound);
app.use(errorHandler);

export default app;
