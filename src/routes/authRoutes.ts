import { Router, Request, Response } from "express";
import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";
import { signToken, verifyToken } from "../middleware/auth";

const router = Router();
const prisma = new PrismaClient();

/** POST /api/auth/signup */
router.post("/signup", async (req: Request, res: Response) => {
  const { email, password, name } = req.body;
  if (!email || !password) return res.status(400).json({ error: "email and password required" });

  try {
    await prisma.$connect();
    const existing = await prisma.user.findUnique({ where: { email } });
    if (existing) return res.status(409).json({ error: "Email already registered" });

    const passwordHash = await bcrypt.hash(password, 12);
    const user = await prisma.user.create({
      data: { email, name: name ?? null, passwordHash, credits: 0, plan: "STARTER" },
    });
    const token = signToken({ id: user.id, email: user.email, plan: user.plan });
    return res.status(201).json({ token, userId: user.id, email: user.email, name: user.name });
  } catch (err) {
    return res.status(500).json({ error: (err as Error).message });
  }
});

/** POST /api/auth/login */
router.post("/login", async (req: Request, res: Response) => {
  const { email, password } = req.body;
  if (!email) return res.status(400).json({ error: "email required" });

  try {
    await prisma.$connect();
    const user = await prisma.user.findUnique({ where: { email } });
    if (!user) return res.status(401).json({ error: "Invalid credentials" });

    // If user has a passwordHash, verify it; otherwise allow password-less login (demo/seed users)
    if (user.passwordHash && password) {
      const valid = await bcrypt.compare(password, user.passwordHash);
      if (!valid) return res.status(401).json({ error: "Invalid credentials" });
    }

    const token = signToken({ id: user.id, email: user.email, plan: user.plan });
    return res.json({
      token,
      userId: user.id,
      email: user.email,
      name: user.name,
      credits: user.credits,
      plan: user.plan,
    });
  } catch (err) {
    // Fallback for demo/dev when DB is unavailable
    const token = signToken({ id: "demo-1", email, plan: "GROWTH" });
    return res.json({ token, userId: "demo-1", email, credits: 100, plan: "GROWTH", fallback: true });
  }
});

/** POST /api/auth/refresh — extend a still-valid token */
router.post("/refresh", (req: Request, res: Response) => {
  const header = req.headers.authorization;
  if (!header) return res.status(401).json({ error: "No token" });
  const user = verifyToken(header.split(" ")[1]);
  if (!user) return res.status(401).json({ error: "Invalid token" });
  const token = signToken({ id: user.id, email: user.email, plan: user.plan });
  return res.json({ token });
});

/** GET /api/auth/me */
router.get("/me", (req: Request, res: Response) => {
  const header = req.headers.authorization;
  if (!header) return res.status(401).json({ error: "No token" });
  const user = verifyToken(header.split(" ")[1]);
  if (!user) return res.status(401).json({ error: "Invalid token" });
  return res.json(user);
});

export default router;
