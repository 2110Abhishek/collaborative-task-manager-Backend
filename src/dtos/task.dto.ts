import { z } from "zod";

export const CreateTaskDto = z.object({
  title: z.string().min(1, "Title is required"),
  description: z.string().optional(),
  dueDate: z.string().optional(), // browser-friendly
  priority: z.enum(["LOW", "MEDIUM", "HIGH", "URGENT"]),
  assignedToId: z.string().uuid().optional(),
});

export const UpdateTaskDto = z.object({
  title: z.string().optional(),
  description: z.string().optional(),
  dueDate: z.string().optional(),
  priority: z.enum(["LOW", "MEDIUM", "HIGH", "URGENT"]).optional(),
  status: z.enum(["TODO", "IN_PROGRESS", "REVIEW", "COMPLETED"]).optional(),
  assignedToId: z.string().uuid().optional(),
});
