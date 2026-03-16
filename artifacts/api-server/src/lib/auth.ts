import { Request, Response, NextFunction } from "express";
import crypto from "crypto";

export function hashPassword(password: string): string {
  return crypto.createHash("sha256").update(password + "ethiomart_salt").digest("hex");
}

export function comparePassword(password: string, hash: string): boolean {
  return hashPassword(password) === hash;
}

export function generateToken(): string {
  return crypto.randomBytes(32).toString("hex");
}

// Simple in-memory session store (fine for demo; use Redis in production)
const sessions = new Map<string, { userId: number; role: string; expiresAt: Date }>();

export function createSession(userId: number, role: string): string {
  const token = generateToken();
  const expiresAt = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000); // 7 days
  sessions.set(token, { userId, role, expiresAt });
  return token;
}

export function getSession(token: string): { userId: number; role: string } | null {
  const session = sessions.get(token);
  if (!session) return null;
  if (session.expiresAt < new Date()) {
    sessions.delete(token);
    return null;
  }
  return { userId: session.userId, role: session.role };
}

export function deleteSession(token: string): void {
  sessions.delete(token);
}

export function getTokenFromRequest(req: Request): string | null {
  const authHeader = req.headers.authorization;
  if (authHeader?.startsWith("Bearer ")) {
    return authHeader.slice(7);
  }
  const cookieToken = req.cookies?.token;
  if (cookieToken) return cookieToken;
  return null;
}

export function requireAuth(req: Request, res: Response, next: NextFunction): void {
  const token = getTokenFromRequest(req);
  if (!token) {
    res.status(401).json({ error: "Unauthorized", message: "Authentication required" });
    return;
  }
  const session = getSession(token);
  if (!session) {
    res.status(401).json({ error: "Unauthorized", message: "Invalid or expired session" });
    return;
  }
  (req as any).userId = session.userId;
  (req as any).userRole = session.role;
  next();
}

export function optionalAuth(req: Request, _res: Response, next: NextFunction): void {
  const token = getTokenFromRequest(req);
  if (token) {
    const session = getSession(token);
    if (session) {
      (req as any).userId = session.userId;
      (req as any).userRole = session.role;
    }
  }
  next();
}

export function requireRole(...roles: string[]) {
  return (req: Request, res: Response, next: NextFunction): void => {
    const userRole = (req as any).userRole;
    if (!roles.includes(userRole)) {
      res.status(403).json({ error: "Forbidden", message: "Insufficient permissions" });
      return;
    }
    next();
  };
}
