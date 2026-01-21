// // import express from "express";
// // import cors from "cors";
// // import authRoutes from "./routes/auth.routes.js";
// // import taskRoutes from "./routes/task.routes.js";
// // import userRoutes from "./routes/user.routes.js";

// // const app = express();

// // app.use(cors());
// // app.use(express.json());

// // app.use("/api/auth", authRoutes);
// // app.use("/api/tasks", taskRoutes);
// // app.use("/users", userRoutes); // new

// // export default app;


// import express from "express";
// import cors from "cors";
// import authRoutes from "./routes/authRoutes.js";
// import taskRoutes from "./routes/taskRoutes.js";
// import userRoutes from "./routes/userRoutes.js";
// import attendanceRoutes from "./routes/attendanceRoutes.js";
// import adminRoutes from "./routes/adminRoutes.js";
// import { notFound, errorHandler } from "./middleware/errorMiddleware.js";

// const app = express();

// // CORS Configuration (allow common dev ports + env overrides)
// const allowedOrigins = [
//   process.env.FRONTEND_URL,
//   process.env.FRONTEND_URL_2,
//   "http://localhost:5173",
//   "http://localhost:5174",
//   "http://localhost:5176",
// ].filter(Boolean);

// // Debug: Log allowed origins
// console.log("🔐 Allowed CORS Origins:", allowedOrigins);

// app.use(
//   cors({
//     origin: (origin, callback) => {
//       console.log("📨 Request from origin:", origin);
//       if (!origin || allowedOrigins.includes(origin)) {
//         return callback(null, true);
//       }
//       console.log("❌ CORS blocked origin:", origin);
//       return callback(new Error("Not allowed by CORS"));
//     },
//     credentials: true,
//     optionsSuccessStatus: 200,
//   })
// );
// app.use(express.json());

// app.use("/api/auth", authRoutes);
// app.use("/api/tasks", taskRoutes);
// app.use("/api/users", userRoutes);
// app.use("/api/attendance", attendanceRoutes);
// app.use("/api/admin", adminRoutes); // Admin user management

// app.use(notFound);
// app.use(errorHandler);

// export default app;


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

// // Parse JSON & cookies
// app.use(express.json());
// app.use(cookieParser());

// // Allowed origins (Frontend URLs)
// const allowedOrigins = [
//   "https://authsphere.vercel.app",        // ✅ Vercel production
//   process.env.FRONTEND_URL,               // optional env-based
//   process.env.FRONTEND_URL_2,             // optional
//   "http://localhost:5173",                // local dev
//   "http://localhost:5174",
//   "http://localhost:5176",
// ].filter(Boolean);

// // Debug log (safe to keep)
// console.log("🔐 Allowed CORS Origins:", allowedOrigins);

// // CORS configuration
// app.use(
//   cors({
//     origin: (origin, callback) => {
//       console.log("📨 Request from origin:", origin);

//       // Allow Postman / server-to-server requests
//       if (!origin) return callback(null, true);

//       if (allowedOrigins.includes(origin)) {
//         return callback(null, true);
//       }

//       console.log("❌ CORS blocked origin:", origin);
//       return callback(new Error("Not allowed by CORS"));
//     },
//     credentials: true,
//     methods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
//     allowedHeaders: ["Content-Type", "Authorization"],
//     optionsSuccessStatus: 200,
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

// Allowed frontend origins
const allowedOrigins = [
  "https://authsphere.vercel.app",
  process.env.FRONTEND_URL,
  process.env.FRONTEND_URL_2,
  "http://localhost:5173",
  "http://localhost:5174",
  "http://localhost:5176",
].filter(Boolean);

console.log("🔐 Allowed CORS Origins:", allowedOrigins);

app.use(
  cors({
    origin: (origin, callback) => {
      // allow Postman / server calls
      if (!origin) return callback(null, true);

      if (allowedOrigins.includes(origin)) {
        return callback(null, true);
      }

      return callback(new Error("Not allowed by CORS"));
    },
    credentials: true,
    methods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
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

// optional health check (clarity only)
app.get("/api", (req, res) => {
  res.json({ status: "OK", message: "AuthSphere API running 🚀" });
});

/* ================================
   Error Handling
================================ */
app.use(notFound);
app.use(errorHandler);

export default app;
