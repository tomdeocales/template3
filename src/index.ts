import type { Request, Response } from "express";

import cors from "cors";
import express from "express";
import swaggerUi from "swagger-ui-express";

import { swaggerSpec } from "./config";
import env from "./env";
import { error, logger, notFound } from "./middleware";
import { authRoutes } from "./routes/sample"; // Import auth routes

const app = express();

// Middleware
app.use(cors());
app.use(express.json());
app.use(logger());
// API Routes

app.get("/api/", (req, res) => {
  res.json({ message: "API is running" });
});

app.use("/api/auth", authRoutes);
// API Routes
app.get("/api/", (req: Request, res: Response) => {
  res.json({
    name: "Test API",
    version: "1.0.0",
    status: "running",
    uptime: process.uptime(),
    timestamp: new Date().toISOString(),
  });
});

// API documentation
app.use("/api/docs", swaggerUi.serve, swaggerUi.setup(swaggerSpec));

app.use(notFound());
app.use(error());

// Start Server
app.listen(env.PORT, () => {
  // eslint-disable-next-line no-console
  console.log(`Server running on http://localhost:${env.PORT}`);
});
