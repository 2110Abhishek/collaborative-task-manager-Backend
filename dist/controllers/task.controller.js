"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteTask = exports.updateTask = exports.createTask = exports.getTasks = void 0;
const task_service_1 = require("../services/task.service");
const task_dto_1 = require("../dtos/task.dto");
/**
 * GET /api/tasks
 */
const getTasks = async (_req, res) => {
    const tasks = await (0, task_service_1.getTasksService)();
    res.json(tasks);
};
exports.getTasks = getTasks;
/**
 * POST /api/tasks
 */
const createTask = async (req, res) => {
    const authReq = req;
    const data = task_dto_1.CreateTaskDto.parse(authReq.body);
    const userId = authReq.user.id;
    const task = await (0, task_service_1.createTaskService)(data, userId);
    res.status(201).json(task);
};
exports.createTask = createTask;
/**
 * PATCH /api/tasks/:id
 */
const updateTask = async (req, res) => {
    const { id } = req.params;
    const data = task_dto_1.UpdateTaskDto.parse(req.body);
    const task = await (0, task_service_1.updateTaskService)(id, data);
    res.json(task);
};
exports.updateTask = updateTask;
/**
 * DELETE /api/tasks/:id
 */
const deleteTask = async (req, res) => {
    const { id } = req.params;
    await (0, task_service_1.deleteTaskService)(id);
    res.status(204).send();
};
exports.deleteTask = deleteTask;
