import * as taskRepo from "../repositories/task.repository";
import { emitTaskAssigned,emitTaskUpdated } from "../sockets/socket";
import prisma from "../utils/prisma";

export const createTaskService = async (
  data: any,
  creatorId: string
) => {
  if (data.assignedToId) {
    const user = await prisma.user.findUnique({
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
    emitTaskAssigned(task.assignedToId, task);
  }

  // 🔄 Notify all users
  emitTaskUpdated(task);

  return task;
};


export const getTasksService = () => {
  return taskRepo.getAllTasks();
};

export const updateTaskService = async (id: string, data: any) => {
  const existingTask = await taskRepo.getTaskById(id);
  if (!existingTask) throw new Error("Task not found");

  const updatedTask = await taskRepo.updateTask(id, data);

  // 🔔 Assignment changed
  if (
    data.assignedToId &&
    data.assignedToId !== existingTask.assignedToId
  ) {
    emitTaskAssigned(data.assignedToId, updatedTask);
  }

  // 🔄 Broadcast update
  emitTaskUpdated(updatedTask);

  return updatedTask;
};


export const deleteTaskService = async (id: string) => {
  const task = await taskRepo.getTaskById(id);
  if (!task) throw new Error("Task not found");

  const deleted = await taskRepo.deleteTask(id);

  // 🔄 Notify all users
  emitTaskUpdated({ id, deleted: true });

  return deleted;
};
