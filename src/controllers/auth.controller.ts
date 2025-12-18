import { Request, Response } from "express";
import { RegisterDto, LoginDto } from "../dtos/auth.dto";
import { loginUser, registerUser } from "../services/auth.service";
import prisma from "../utils/prisma";

export const register = async (req: Request, res: Response) => {
  try {
    const data = RegisterDto.parse(req.body);
    const user = await registerUser(data);

    res.status(201).json({
      id: user.id,
      email: user.email,
      name: user.name,
    });
  } catch (err: any) {
    return res.status(400).json({
      message: err.errors?.[0]?.message || err.message || "Invalid data",
    });
  }
};


export const login = async (req: Request, res: Response) => {
  console.log("LOGIN BODY:", req.body); // 🔥 ADD THIS

  const data = LoginDto.parse(req.body);
  const { token, user } = await loginUser(data.email, data.password);

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


export const me = async (req: Request, res: Response) => {
  const user = (req as any).user as { id: string } | undefined;

  if (!user) {
    return res.status(401).json({ message: "Unauthorized" });
  }

  const dbUser = await prisma.user.findUnique({
    where: { id: user.id },
    select: { id: true, email: true, name: true },
  });

  res.json(dbUser);
};

