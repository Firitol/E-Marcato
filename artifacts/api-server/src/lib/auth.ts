import { Request, Response, NextFunction } from "express";
import crypto from "crypto";
import jwt from "jsonwebtoken";

const JWT_SECRET = process.env.JWT_SECRET || crypto.randomBytes(32).toString("hex");
const JWT_EXPIRY = "7d";

export function hashPassword(password: string): string {
  return crypto.createHash("sha256").update(password + "ethiomart_salt").digest("hex");
}

export function comparePassword(password: string, hash: string): boolean {
  return hashPassword(password) === hash;
}

export function createSession(userId: number, role: string): string {
  return jwt.sign({ userId, role }, JWT_SECRET, { expiresIn: JWT_EXPIRY });
}

export function getSession(token: string): { userId: number; role: string } | null {
  try {
    const payload = jwt.verify(token, JWT_SECRET) as { userId: number; role: string };
    return { userId: payload.userId, role: payload.role };
  } catch {
    return null;
  }
}

export function deleteSession(_token: string): void {
  // JWT tokens are stateless — no server-side invalidation needed.
  // In production, maintain a short-lived blocklist or use short expiry tokens.
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
