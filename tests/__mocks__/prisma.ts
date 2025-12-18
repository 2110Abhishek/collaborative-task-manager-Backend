export const prisma = {
  user: {
    findUnique: jest.fn(),
  },
  task: {
    create: jest.fn(),
    findUnique: jest.fn(),
    update: jest.fn(),
    delete: jest.fn(),
    findMany: jest.fn(),
  },
};
