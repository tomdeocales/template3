// src/controller/auth.ts
import type { Request, Response } from "express";

import { AuthenticationClient } from "auth0";

import env from "../env";

// Define a type for the Auth0 response
interface Auth0TokenResponse {
  access_token?: string;
  id_token?: string;
  expires_in?: number;
  token_type?: string;
}

export async function signIn(req: Request, res: Response): Promise<void> {
  const { username, password } = req.body;

  if (!username || !password) {
    res.status(400).json({ message: "Username and password are required." });
    return;
  }

  try {
    const auth0 = new AuthenticationClient({
      domain: env.AUTH0_DOMAIN,
      clientId: env.AUTH0_CLIENT_ID,
    });

    // Cast the response to our interface
    const authResult = await auth0.oauth.passwordGrant({
      username,
      password,
      realm: "Username-Password-Authentication",
      scope: "openid profile email",
      audience: env.AUTH0_AUDIENCE,
    }) as Auth0TokenResponse;

    // Create a response object with default values
    res.status(200).json({
      message: "Sign in successful",
      access_token: authResult.access_token || "",
      id_token: authResult.id_token || "",
      expires_in: authResult.expires_in || 0,
      token_type: authResult.token_type || "Bearer",
    });
  }
  catch (error) {
    const errorMessage = error instanceof Error ? error.message : String(error);

    if (errorMessage.includes("invalid_grant")
      || errorMessage.includes("Wrong email or password")) {
      res.status(401).json({ message: "Invalid credentials" });
      return;
    }

    console.error("[Auth Error]", errorMessage);

    res.status(500).json({ message: "Authentication failed" });
  }
}

export async function validateToken(req: Request, res: Response): Promise<void> {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    res.status(401).json({ message: "Missing or invalid authorization token" });
    return;
  }

  const token = authHeader.split(" ")[1];

  try {
    const auth0 = new AuthenticationClient({
      domain: env.AUTH0_DOMAIN,
      clientId: env.AUTH0_CLIENT_ID,
    });

    // Validate the token with Auth0
    const userInfo = await auth0.getProfile(token);

    res.status(200).json({
      message: "Token is valid",
      user: userInfo,
    });
  }
  catch (error) {
    console.error("[Token Validation Error]", error);
    res.status(401).json({ message: "Invalid token" });
  }
}
