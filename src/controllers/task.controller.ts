import { Request, Response, RequestHandler } from "express";
import {
  createTaskService,
  deleteTaskService,
  getTasksService,
  updateTaskService,
} from "../services/task.service";
import { CreateTaskDto, UpdateTaskDto } from "../dtos/task.dto";
import { AuthenticatedRequest } from "../types/auth-request";

/**
 * GET /api/tasks
 */
export const getTasks: RequestHandler = async (
  _req: Request,
  res: Response
) => {
  const tasks = await getTasksService();
  res.json(tasks);
};

/**
 * POST /api/tasks
 */
export const createTask: RequestHandler = async (
  req: Request,
  res: Response
) => {
  const authReq = req as AuthenticatedRequest;

  const data = CreateTaskDto.parse(authReq.body);
  const userId = authReq.user.id;

  const task = await createTaskService(data, userId);
  res.status(201).json(task);
};

/**
 * PATCH /api/tasks/:id
 */
export const updateTask: RequestHandler = async (
  req: Request,
  res: Response
) => {
  const { id } = req.params;
  const data = UpdateTaskDto.parse(req.body);

  const task = await updateTaskService(id, data);
  res.json(task);
};

/**
 * DELETE /api/tasks/:id
 */
export const deleteTask: RequestHandler = async (
  req: Request,
  res: Response
) => {
  const { id } = req.params;

  await deleteTaskService(id);
  res.status(204).send();
};
