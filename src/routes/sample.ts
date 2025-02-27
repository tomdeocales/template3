// src/routes/auth.ts (Example)
import express from "express";

import { signIn } from "../controller/auth";
import { validateSignIn } from "../helper/sample-validation";
// Adjust path
export const authRoutes = express.Router();

authRoutes.post("/signin", signIn);
