// src/routes/auth.ts
import express from "express";

import { signIn, validateToken } from "../controller/auth";
import { requireAuth, validateSignIn } from "../helper/sample-validation";

export const authRoutes = express.Router();

/**
 * @swagger
 * /api/auth/signin:
 *   post:
 *     summary: Authenticate a user and get access token
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - username
 *               - password
 *             properties:
 *               username:
 *                 type: string
 *                 format: email
 *               password:
 *                 type: string
 *                 format: password
 *     responses:
 *       200:
 *         description: Authentication successful
 *       401:
 *         description: Invalid credentials
 *       400:
 *         description: Validation error
 *       500:
 *         description: Server error
 */
authRoutes.post("/signin", validateSignIn, signIn);

/**
 * @swagger
 * /api/auth/validate:
 *   get:
 *     summary: Validate an authentication token
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Token is valid
 *       401:
 *         description: Invalid token
 */
authRoutes.get("/validate", requireAuth, validateToken);
