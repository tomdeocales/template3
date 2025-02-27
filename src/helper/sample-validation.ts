// src/helper/signin-validation.ts
import type { NextFunction, Request, Response } from "express";

import { z } from "zod";

const signInSchema = z.object({
  username: z.string().email(),
  password: z.string().min(8), // Adjust as needed
});

export function validateSignIn(req: Request, res: Response, next: NextFunction): void {
  const result = signInSchema.safeParse(req.body);

  if (!result.success) {
    res.status(400).json(result.error);
    return;
  }

  next();
}
