import prisma from "../utils/prisma";

export const createTask = (data: any) => {
  return prisma.task.create({ data });
};

export const getAllTasks = () => {
  return prisma.task.findMany({
    include: {
      creator: true,
      assignee: true,
    },
  });
};

export const getTaskById = (id: string) => {
  return prisma.task.findUnique({
    where: { id },
    include: {
      creator: true,
      assignee: true,
    },
  });
};

export const updateTask = (id: string, data: any) => {
  return prisma.task.update({
    where: { id },
    data,
  });
};

export const deleteTask = (id: string) => {
  return prisma.task.delete({
    where: { id },
  });
};
