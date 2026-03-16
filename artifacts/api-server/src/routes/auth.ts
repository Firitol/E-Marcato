import { Router } from "express";
import { db } from "@workspace/db";
import { usersTable } from "@workspace/db";
import { eq } from "drizzle-orm";
import {
  hashPassword,
  comparePassword,
  createSession,
  deleteSession,
  getTokenFromRequest,
  requireAuth,
} from "../lib/auth.js";

const router = Router();

router.post("/register", async (req, res) => {
  try {
    const { email, password, firstName, lastName, phone } = req.body;
    if (!email || !password || !firstName || !lastName) {
      res.status(400).json({ error: "Bad Request", message: "Missing required fields" });
      return;
    }
    const existing = await db.select().from(usersTable).where(eq(usersTable.email, email)).limit(1);
    if (existing.length > 0) {
      res.status(400).json({ error: "Bad Request", message: "Email already registered" });
      return;
    }
    const [user] = await db.insert(usersTable).values({
      email,
      password: hashPassword(password),
      firstName,
      lastName,
      phone,
      role: "customer",
    }).returning();

    const token = createSession(user.id, user.role);
    const { password: _, ...safeUser } = user;
    res.status(201).json({ user: safeUser, token });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

router.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      res.status(400).json({ error: "Bad Request", message: "Email and password required" });
      return;
    }
    const [user] = await db.select().from(usersTable).where(eq(usersTable.email, email)).limit(1);
    if (!user || !comparePassword(password, user.password)) {
      res.status(401).json({ error: "Unauthorized", message: "Invalid credentials" });
      return;
    }
    if (!user.isActive) {
      res.status(401).json({ error: "Unauthorized", message: "Account is deactivated" });
      return;
    }
    const token = createSession(user.id, user.role);
    const { password: _, ...safeUser } = user;
    res.json({ user: safeUser, token });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

router.get("/me", requireAuth, async (req, res) => {
  try {
    const userId = (req as any).userId;
    const [user] = await db.select().from(usersTable).where(eq(usersTable.id, userId)).limit(1);
    if (!user) {
      res.status(404).json({ error: "Not Found" });
      return;
    }
    const { password: _, ...safeUser } = user;
    res.json(safeUser);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

router.post("/logout", (req, res) => {
  const token = getTokenFromRequest(req);
  if (token) deleteSession(token);
  res.json({ success: true, message: "Logged out successfully" });
});

export default router;
