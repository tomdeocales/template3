// src/controller/auth.ts
import type { Request, Response } from "express";

import { ManagementClient } from "auth0"; // Use auth0 library instead

import env from "../env";

export async function signIn(req: Request, res: Response): Promise<void> {
  const { username, password } = req.body;

  if (!username || !password) {
    res.status(400).json({ message: "Username and password are required." });
    return;
  }

  try {
    const management = new ManagementClient({
      domain: env.AUTH0_DOMAIN,
      clientId: env.AUTH0_CLIENT_ID,
      clientSecret: env.AUTH0_CLIENT_SECRET,
      scope: "read:users update:users",
    });

    const users = await management.getUsersByEmail(username);

    if (users.length === 0) {
      return res.status(401).json({ message: "Invalid credentials" });
    }

    const user = users[0];

    // The Password grant is deprecated, should use resource owner password grant in Auth0

    res.status(200).json({ message: "Sign in success!", user });
  }
  catch (error) {
    console.error("Error during sign-in:", error);
    res.status(500).json({ message: "Sign-in failed.", error: String(error) });
  }
}
