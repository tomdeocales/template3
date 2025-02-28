// src/controller/auth.ts
import type { Request, Response } from "express";
import { AuthenticationClient } from "auth0";
import env from "../env";

export async function signIn(req: Request, res: Response): Promise<void> {
  const { username, password } = req.body;

  // Validation already handled by middleware, but double-check
  if (!username || !password) {
    res.status(400).json({ message: "Username and password are required." });
    return;
  }

  try {
    // Create Auth0 authentication client
    const auth0 = new AuthenticationClient({
      domain: env.AUTH0_DOMAIN,
      clientId: env.AUTH0_CLIENT_ID,
    });

    // Use Password Realm Grant to authenticate user
    // This is the proper way to authenticate with username/password
    const authResult = await auth0.oauth.passwordGrant({
      username,
      password,
      realm: "Username-Password-Authentication", // Default connection for username/password
      scope: "openid profile email", // Standard OIDC scopes
      audience: env.AUTH0_AUDIENCE,
    });

    // If we get here, authentication was successful
    res.status(200).json({
      message: "Sign in successful",
      access_token: authResult.access_token,
      id_token: authResult.id_token,
      expires_in: authResult.expires_in,
      token_type: authResult.token_type,
    });
  }
  catch (error) {
    // Better error handling
    const errorMessage = error instanceof Error ? error.message : String(error);
    
    // Check for specific Auth0 error messages to provide better feedback
    if (errorMessage.includes("invalid_grant") || 
        errorMessage.includes("Wrong email or password")) {
      res.status(401).json({ message: "Invalid credentials" });
      return;
    }

    // Log the actual error for debugging but don't expose it to clients
    console.error("[Auth Error]", errorMessage);
    
    res.status(500).json({ message: "Authentication failed" });
  }
}

// New function to check if a token is valid
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
      user: userInfo
    });
  }
  catch (error) {
    console.error("[Token Validation Error]", error);
    res.status(401).json({ message: "Invalid token" });
  }
}
