"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteTaskService = exports.updateTaskService = exports.getTasksService = exports.createTaskService = void 0;
const taskRepo = __importStar(require("../repositories/task.repository"));
const socket_1 = require("../sockets/socket");
const prisma_1 = __importDefault(require("../utils/prisma"));
const createTaskService = async (data, creatorId) => {
    if (data.assignedToId) {
        const user = await prisma_1.default.user.findUnique({
            where: { id: data.assignedToId },
        });
        if (!user) {
            throw new Error("Assigned user does not exist");
        }
    }
    const task = await taskRepo.createTask({
        ...data,
        creatorId,
        status: "TODO",
        dueDate: data.dueDate ? new Date(data.dueDate) : null,
    });
    // 🔔 Notify assigned user
    if (task.assignedToId) {
        (0, socket_1.emitTaskAssigned)(task.assignedToId, task);
    }
    // 🔄 Notify all users
    (0, socket_1.emitTaskUpdated)(task);
    return task;
};
exports.createTaskService = createTaskService;
const getTasksService = () => {
    return taskRepo.getAllTasks();
};
exports.getTasksService = getTasksService;
const updateTaskService = async (id, data) => {
    const existingTask = await taskRepo.getTaskById(id);
    if (!existingTask)
        throw new Error("Task not found");
    const updatedTask = await taskRepo.updateTask(id, data);
    // 🔔 Assignment changed
    if (data.assignedToId &&
        data.assignedToId !== existingTask.assignedToId) {
        (0, socket_1.emitTaskAssigned)(data.assignedToId, updatedTask);
    }
    // 🔄 Broadcast update
    (0, socket_1.emitTaskUpdated)(updatedTask);
    return updatedTask;
};
exports.updateTaskService = updateTaskService;
const deleteTaskService = async (id) => {
    const task = await taskRepo.getTaskById(id);
    if (!task)
        throw new Error("Task not found");
    const deleted = await taskRepo.deleteTask(id);
    // 🔄 Notify all users
    (0, socket_1.emitTaskUpdated)({ id, deleted: true });
    return deleted;
};
exports.deleteTaskService = deleteTaskService;
