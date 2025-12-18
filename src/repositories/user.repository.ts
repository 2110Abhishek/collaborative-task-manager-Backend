import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export const findUserByEmail = (email: string) =>
  prisma.user.findUnique({ where: { email } });

export const createUser = (data: any) =>
  prisma.user.create({ data });
