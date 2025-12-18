"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.emitTaskAssigned = exports.emitTaskUpdated = exports.initSocket = void 0;
const socket_io_1 = require("socket.io");
let io;
const initSocket = (server) => {
    io = new socket_io_1.Server(server, {
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
        socket.on("join:user", (userId) => {
            socket.join(`user:${userId}`);
        });
        socket.on("disconnect", () => {
            console.log("❌ Socket disconnected:", socket.id);
        });
    });
};
exports.initSocket = initSocket;
/* =======================
   SOCKET EMIT HELPERS
======================= */
const emitTaskUpdated = (task) => {
    io.to("global:tasks").emit("task:updated", task);
};
exports.emitTaskUpdated = emitTaskUpdated;
const emitTaskAssigned = (userId, task) => {
    io.to(`user:${userId}`).emit("task:assigned", task);
};
exports.emitTaskAssigned = emitTaskAssigned;
