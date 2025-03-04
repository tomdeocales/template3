// src/controller/auth.ts
import type { Request, Response } from "express";

import axios from "axios";

import env from "../env";

export async function signIn(req: Request, res: Response): Promise<void> {
  const { username, password } = req.body;

  if (!username || !password) {
    res.status(400).json({ message: "Username and password are required." });
    return;
  }

  try {
    // Use Auth0's token endpoint for authentication
    const tokenResponse = await axios.post(`${env.AUTH0_ISSUER_BASE_URL}oauth/token`, {
      grant_type: "password",
      username,
      password,
      client_id: env.AUTH0_CLIENT_ID,
      client_secret: env.AUTH0_CLIENT_SECRET,
      audience: env.AUTH0_AUDIENCE,
      scope: "offline_access openid profile email",
    });

    // Extract the tokens
    const { access_token, refresh_token, id_token, expires_in } = tokenResponse.data;

    // Return tokens to client
    res.status(200).json({
      message: "Authentication successful",
      access_token,
      refresh_token,
      id_token,
      expires_in,
    });
  }
  catch (error) {
    // Handle various error types
    if (axios.isAxiosError(error) && error.response) {
      // Auth0 returned an error
      const statusCode = error.response.status;
      const errorData = error.response.data;

      if (statusCode === 401 || statusCode === 403) {
        res.status(401).json({ message: "Invalid credentials" });
      }
      else {
        res.status(statusCode).json({
          message: "Authentication failed",
          error: errorData.error_description || errorData.error,
        });
      }
    }
    else {
      // Server or network error
      res.status(500).json({ message: "Authentication service unavailable", error: String(error) });
    }
  }
}

export async function validateToken(req: Request, res: Response): Promise<void> {
  try {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      res.status(401).json({ message: "Valid token required" });
      return;
    }

    const token = authHeader.split(" ")[1];

    // Use the same URL pattern that worked for signIn
    const response = await axios.get(`https://${env.AUTH0_DOMAIN}/userinfo`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    // If we get here, the token is valid
    res.status(200).json({
      message: "Token is valid",
      user: response.data,
    });
  }
  catch (error) {
    // Add more detailed error handling
    if (axios.isAxiosError(error) && error.response) {
      const statusCode = error.response.status;
      const errorData = error.response.data;

      res.status(statusCode).json({
        message: "Token validation failed",
        error: errorData.error_description || errorData.error || "Invalid token",
      });
    }
    else {
      res.status(401).json({
        message: "Invalid token",
        error: String(error),
      });
    }
  }
}
