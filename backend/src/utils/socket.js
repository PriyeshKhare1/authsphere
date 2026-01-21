import { Server } from "socket.io";
import jwt from "jsonwebtoken";
import User from "../models/User.js";

let io;

const getAllowedOrigins = () => {
  const fromEnv = process.env.FRONTEND_URL || process.env.CLIENT_URL;
  if (!fromEnv) return "*";
  return fromEnv.split(",").map((origin) => origin.trim());
};

export const initSocket = (server) => {
  io = new Server(server, {
    cors: {
      origin: getAllowedOrigins(),
      methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
      credentials: true,
    },
  });

  io.use(async (socket, next) => {
    try {
      const token = socket.handshake.auth?.token || socket.handshake.query?.token;
      if (!token) return next(new Error("Unauthorized"));

      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      const user = await User.findById(decoded.id).select("_id role");
      if (!user) return next(new Error("Unauthorized"));

      socket.user = { id: user._id.toString(), role: user.role };
      next();
    } catch (err) {
      next(new Error("Unauthorized"));
    }
  });

  io.on("connection", (socket) => {
    if (socket.user?.id) {
      socket.join(socket.user.id);
    }

    socket.on("disconnect", () => {
      // No-op hook for future metrics
    });
  });

  return io;
};

export const getIO = () => {
  if (!io) {
    throw new Error("Socket.io not initialized");
  }
  return io;
};
