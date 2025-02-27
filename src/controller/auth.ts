// src/controller/auth.ts
import type { Request, Response } from "express";

import { ManagementClient } from "auth0";

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
    });

    // Get the response from the Auth0 API
    const usersResponse = await management.users.getAll({
      q: `email:"${username}"`,
      search_engine: "v3",
    });

    // The response might be an object with data property or directly an array
    // Let's handle both cases
    const usersList = Array.isArray(usersResponse) ? usersResponse : usersResponse.data || [];

    if (usersList.length === 0) {
      res.status(401).json({ message: "Invalid credentials" });
      return; // Add return statement here
    }

    const user = usersList[0];

    // The Password grant is deprecated, should use resource owner password grant in Auth0

    res.status(200).json({ message: "Sign in success!", user });
  }
  catch (error) {
    res.status(500).json({ message: "Sign-in failed.", error: String(error) });
  }
}
