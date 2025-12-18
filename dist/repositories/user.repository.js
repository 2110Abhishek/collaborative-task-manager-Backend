"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.createUser = exports.findUserByEmail = void 0;
const client_1 = require("@prisma/client");
const prisma = new client_1.PrismaClient();
const findUserByEmail = (email) => prisma.user.findUnique({ where: { email } });
exports.findUserByEmail = findUserByEmail;
const createUser = (data) => prisma.user.create({ data });
exports.createUser = createUser;
