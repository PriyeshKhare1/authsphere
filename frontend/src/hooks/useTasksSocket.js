import { useEffect, useRef } from "react";
import { io } from "socket.io-client";

const resolveSocketURL = () => {
  const raw =
    (typeof process !== "undefined"
      ? process.env?.VITE_API_URL || process.env?.REACT_APP_API_URL
      : undefined) || "http://localhost:5000";
  return raw.endsWith("/api") ? raw.replace(/\/api$/, "") : raw;
};

export const sortTasksByDate = (list = []) =>
  [...list].sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));

export const useTasksSocket = (enabled, setTasks) => {
  const socketRef = useRef(null);

  useEffect(() => {
    if (!enabled || typeof setTasks !== "function") return undefined;

    const stored = localStorage.getItem("auth_user");
    const token = stored ? JSON.parse(stored).token : null;
    if (!token) return undefined;

    const socket = io(resolveSocketURL(), {
      auth: { token },
      transports: ["websocket"],
      reconnectionAttempts: 5,
    });

    socketRef.current = socket;

    const upsertTask = (incoming) => {
      setTasks((prev) => {
        const idx = prev.findIndex((t) => t._id === incoming._id);
        if (idx === -1) return sortTasksByDate([incoming, ...prev]);
        const next = [...prev];
        next[idx] = { ...next[idx], ...incoming };
        return sortTasksByDate(next);
      });
    };

    const removeTask = ({ _id }) => {
      setTasks((prev) => prev.filter((t) => t._id !== _id));
    };

    socket.on("task:created", upsertTask);
    socket.on("task:updated", upsertTask);
    socket.on("task:deleted", removeTask);

    return () => {
      socket.off("task:created", upsertTask);
      socket.off("task:updated", upsertTask);
      socket.off("task:deleted", removeTask);
      socket.disconnect();
    };
  }, [enabled, setTasks]);

  return socketRef;
};
