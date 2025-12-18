import { Server } from "socket.io";
import http from "http";

let io: Server;

export const initSocket = (server: http.Server) => {
  io = new Server(server, {
    cors: {
      origin: process.env.CLIENT_URL,
      credentials: true,
    },
  });

  io.on("connection", (socket) => {
    console.log("🔌 Socket connected:", socket.id);

    // Join global task room
    socket.join("global:tasks");

    // Join user-specific room
    socket.on("join:user", (userId: string) => {
      socket.join(`user:${userId}`);
    });

    socket.on("disconnect", () => {
      console.log("❌ Socket disconnected:", socket.id);
    });
  });
};

/* =======================
   SOCKET EMIT HELPERS
======================= */

export const emitTaskUpdated = (task: any) => {
  io.to("global:tasks").emit("task:updated", task);
};

export const emitTaskAssigned = (userId: string, task: any) => {
  io.to(`user:${userId}`).emit("task:assigned", task);
};
