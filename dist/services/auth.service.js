"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.loginUser = exports.registerUser = void 0;
const bcrypt_1 = __importDefault(require("bcrypt"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const user_repository_1 = require("../repositories/user.repository");
const registerUser = async (data) => {
    const existing = await (0, user_repository_1.findUserByEmail)(data.email);
    if (existing)
        throw new Error("User already exists");
    const hashed = await bcrypt_1.default.hash(data.password, 10);
    return (0, user_repository_1.createUser)({ ...data, password: hashed });
};
exports.registerUser = registerUser;
const loginUser = async (email, password) => {
    const user = await (0, user_repository_1.findUserByEmail)(email);
    if (!user)
        throw new Error("Invalid credentials");
    const match = await bcrypt_1.default.compare(password, user.password);
    if (!match)
        throw new Error("Invalid credentials");
    const token = jsonwebtoken_1.default.sign({ id: user.id }, process.env.JWT_SECRET, {
        expiresIn: "1d",
    });
    return { user, token };
};
exports.loginUser = loginUser;
