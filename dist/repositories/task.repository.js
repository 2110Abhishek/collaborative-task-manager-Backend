"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteTask = exports.updateTask = exports.getTaskById = exports.getAllTasks = exports.createTask = void 0;
const prisma_1 = __importDefault(require("../utils/prisma"));
const createTask = (data) => {
    return prisma_1.default.task.create({ data });
};
exports.createTask = createTask;
const getAllTasks = () => {
    return prisma_1.default.task.findMany({
        include: {
            creator: true,
            assignee: true,
        },
    });
};
exports.getAllTasks = getAllTasks;
const getTaskById = (id) => {
    return prisma_1.default.task.findUnique({
        where: { id },
        include: {
            creator: true,
            assignee: true,
        },
    });
};
exports.getTaskById = getTaskById;
const updateTask = (id, data) => {
    return prisma_1.default.task.update({
        where: { id },
        data,
    });
};
exports.updateTask = updateTask;
const deleteTask = (id) => {
    return prisma_1.default.task.delete({
        where: { id },
    });
};
exports.deleteTask = deleteTask;
