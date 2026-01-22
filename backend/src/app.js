


// import express from "express";
// import cors from "cors";
// import cookieParser from "cookie-parser";

// import authRoutes from "./routes/authRoutes.js";
// import taskRoutes from "./routes/taskRoutes.js";
// import userRoutes from "./routes/userRoutes.js";
// import attendanceRoutes from "./routes/attendanceRoutes.js";
// import adminRoutes from "./routes/adminRoutes.js";

// import { notFound, errorHandler } from "./middleware/errorMiddleware.js";

// const app = express();

// /* ================================
//    Middleware
// ================================ */
// app.use(express.json());
// app.use(cookieParser());

// // Allowed frontend origins
// const allowedOrigins = [
//   "https://authsphere.vercel.app",
//   process.env.FRONTEND_URL,
//   process.env.FRONTEND_URL_2,
//   "http://localhost:5173",
//   "http://localhost:5174",
//   "http://localhost:5176",
// ].filter(Boolean);

// console.log("🔐 Allowed CORS Origins:", allowedOrigins);

// app.use(
//   cors({
//     origin: (origin, callback) => {
//       // allow Postman / server calls
//       if (!origin) return callback(null, true);

//       if (allowedOrigins.includes(origin)) {
//         return callback(null, true);
//       }

//       return callback(new Error("Not allowed by CORS"));
//     },
//     credentials: true,
//     methods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
//     allowedHeaders: ["Content-Type", "Authorization"],
//   })
// );

// /* ================================
//    Routes
// ================================ */
// app.use("/api/auth", authRoutes);
// app.use("/api/tasks", taskRoutes);
// app.use("/api/users", userRoutes);
// app.use("/api/attendance", attendanceRoutes);
// app.use("/api/admin", adminRoutes);

// // optional health check (clarity only)
// app.get("/api", (req, res) => {
//   res.json({ status: "OK", message: "AuthSphere API running 🚀" });
// });

// /* ================================
//    Error Handling
// ================================ */
// app.use(notFound);
// app.use(errorHandler);

// export default app;






import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";

import authRoutes from "./routes/authRoutes.js";
import taskRoutes from "./routes/taskRoutes.js";
import userRoutes from "./routes/userRoutes.js";
import attendanceRoutes from "./routes/attendanceRoutes.js";
import adminRoutes from "./routes/adminRoutes.js";

import { notFound, errorHandler } from "./middleware/errorMiddleware.js";

const app = express();

/* ================================
   Middleware
================================ */
app.use(express.json());
app.use(cookieParser());

// SIMPLE & STABLE CORS (Railway + Vercel)
app.use(
  cors({
    origin: [
      "https://authsphere.vercel.app",
      "http://localhost:5173",
    ],
    credentials: true,
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
  })
);

/* ================================
   Routes
================================ */
app.use("/api/auth", authRoutes);
app.use("/api/tasks", taskRoutes);
app.use("/api/users", userRoutes);
app.use("/api/attendance", attendanceRoutes);
app.use("/api/admin", adminRoutes);

// Health check (IMPORTANT)
app.get("/api", (req, res) => {
  res.json({ status: "OK", message: "AuthSphere API running 🚀" });
});

/* ================================
   Error Handling
================================ */
app.use(notFound);
app.use(errorHandler);

export default app;
