"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.me = exports.login = exports.register = void 0;
const auth_dto_1 = require("../dtos/auth.dto");
const auth_service_1 = require("../services/auth.service");
const prisma_1 = __importDefault(require("../utils/prisma"));
const register = async (req, res) => {
    try {
        const data = auth_dto_1.RegisterDto.parse(req.body);
        const user = await (0, auth_service_1.registerUser)(data);
        res.status(201).json({
            id: user.id,
            email: user.email,
            name: user.name,
        });
    }
    catch (err) {
        return res.status(400).json({
            message: err.errors?.[0]?.message || err.message || "Invalid data",
        });
    }
};
exports.register = register;
const login = async (req, res) => {
    console.log("LOGIN BODY:", req.body); // 🔥 ADD THIS
    const data = auth_dto_1.LoginDto.parse(req.body);
    const { token, user } = await (0, auth_service_1.loginUser)(data.email, data.password);
    res.cookie("token", token, {
        httpOnly: true,
        sameSite: "lax",
    });
    res.json({
        id: user.id,
        email: user.email,
        name: user.name,
    });
};
exports.login = login;
const me = async (req, res) => {
    const user = req.user;
    if (!user) {
        return res.status(401).json({ message: "Unauthorized" });
    }
    const dbUser = await prisma_1.default.user.findUnique({
        where: { id: user.id },
        select: { id: true, email: true, name: true },
    });
    res.json(dbUser);
};
exports.me = me;
