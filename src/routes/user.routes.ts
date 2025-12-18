import { Router } from "express";
import prisma from "../utils/prisma";
import { requireAuth } from "../middlewares/auth.middleware";

const router = Router();

router.get("/", requireAuth, async (_req, res) => {
  const users = await prisma.user.findMany({
    select: { id: true, name: true, email: true },
  });
  res.json(users);
});

export default router;
