import type { Request, Response } from "express";

// Remove this line if you're using axios instead of AuthenticationClient
// import { AuthenticationClient } from "auth0";
import axios from "axios";

import env from "../env";

// Rest of your code...

export async function validateToken(req: Request, res: Response): Promise<void> {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    res.status(401).json({ message: "Missing or invalid authorization token" });
    return;
  }

  const token = authHeader.split(" ")[1];

  try {
    // Use Auth0's userinfo endpoint directly
    const response = await axios.get(`https://${env.AUTH0_DOMAIN}/userinfo`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    // If the request succeeds, the token is valid
    const userInfo = response.data;

    res.status(200).json({
      message: "Token is valid",
      user: userInfo,
    });
  }
  catch (error) {
    const errorMessage = error instanceof Error ? error.message : String(error);

    if (env.NODE_ENV !== "production") {
      console.error("[Token Validation Error]", errorMessage);
    }

    res.status(401).json({ message: "Invalid token" });
  }
}
