import {
  createTaskService,
  updateTaskService,
} from "../src/services/task.service";
import * as taskRepo from "../src/repositories/task.repository";
import prisma from "../src/utils/prisma";
import * as socket from "../src/sockets/socket";

// 🔁 MOCK PRISMA
jest.mock("../src/utils/prisma", () => ({
  user: {
    findUnique: jest.fn(),
  },
}));

// 🔁 MOCK REPOSITORY
jest.mock("../src/repositories/task.repository");

// 🔁 MOCK SOCKET EMITTERS
jest.mock("../src/sockets/socket", () => ({
  emitTaskAssigned: jest.fn(),
  emitTaskUpdated: jest.fn(),
}));

describe("Task Service", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  // 1️⃣ Reject invalid assignee
  it("should throw error if assigned user does not exist", async () => {
    (prisma.user.findUnique as jest.Mock).mockResolvedValue(null);

    await expect(
      createTaskService(
        {
          title: "Test Task",
          description: "Test",
          dueDate: new Date().toISOString(),
          priority: "LOW",
          assignedToId: "invalid-user-id",
        },
        "creator-id"
      )
    ).rejects.toThrow("Assigned user does not exist");
  });

  // 2️⃣ Create task successfully
  it("should create task when data is valid", async () => {
    (prisma.user.findUnique as jest.Mock).mockResolvedValue({ id: "user-1" });

    (taskRepo.createTask as jest.Mock).mockResolvedValue({
      id: "task-1",
      assignedToId: "user-1",
    });

    const result = await createTaskService(
      {
        title: "Valid Task",
        description: "Test",
        dueDate: new Date().toISOString(),
        priority: "LOW",
        assignedToId: "user-1",
      },
      "creator-id"
    );

    expect(result.id).toBe("task-1");
    expect(taskRepo.createTask).toHaveBeenCalled();
  });

  // 3️⃣ Emit socket event on assignment
  it("should emit socket event when task is assigned", async () => {
    (prisma.user.findUnique as jest.Mock).mockResolvedValue({ id: "user-2" });

    (taskRepo.createTask as jest.Mock).mockResolvedValue({
      id: "task-2",
      assignedToId: "user-2",
    });

    await createTaskService(
      {
        title: "Notify Task",
        description: "Test",
        dueDate: new Date().toISOString(),
        priority: "HIGH",
        assignedToId: "user-2",
      },
      "creator-id"
    );

    expect(socket.emitTaskAssigned).toHaveBeenCalledWith(
      "user-2",
      expect.any(Object)
    );
  });
});
