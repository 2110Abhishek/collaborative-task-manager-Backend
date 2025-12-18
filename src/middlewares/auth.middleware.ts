import { Request, Response, NextFunction, RequestHandler } from "express";
import jwt from "jsonwebtoken";

export const requireAuth: RequestHandler = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const token = req.cookies.token;

  if (!token) {
    return res.status(401).json({ message: "Unauthorized" });
  }

  try {
    const payload = jwt.verify(token, process.env.JWT_SECRET!) as {
      id: string;
    };

    // attach user dynamically
    (req as any).user = { id: payload.id };

    next();
  } catch {
    return res.status(401).json({ message: "Invalid token" });
  }
};
