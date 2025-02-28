// src/helper/auth-validation.ts
import type { NextFunction, Request, Response } from "express";

import { z } from "zod";

const signInSchema = z.object({
  username: z.string().email("Invalid email format"),
  password: z.string().min(8, "Password must be at least 8 characters"),
});

export function validateSignIn(req: Request, res: Response, next: NextFunction): void {
  const result = signInSchema.safeParse(req.body);

  if (!result.success) {
    const formattedErrors = result.error.format();
    res.status(400).json({
      message: "Validation failed",
      errors: formattedErrors,
    });
    return;
  }

  next();
}

// Validate token middleware
export function requireAuth(req: Request, res: Response, next: NextFunction): void {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    res.status(401).json({ message: "Authentication required" });
    return;
  }

  // Pass to next middleware - actual token verification will happen later
  next();
}
