import express from "express";

import { signIn } from "../controller/auth";
import { validateSignIn } from "../helper";

export const authRoutes = express.Router();

authRoutes.post("/signin", validateSignIn, signIn);
