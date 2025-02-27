// types/env.d.ts
declare namespace NodeJS {
  interface ProcessEnv {
    NODE_ENV: "development" | "production" | "test"; // Or string if you want less strict typing
    PORT: string; // Or number if you coerce it to a number in your code
    AUTH0_DOMAIN: string;
    AUTH0_CLIENT_ID: string;
    AUTH0_CLIENT_SECRET: string;
    AUTH0_AUDIENCE?: string; // Optional environment variables use ?
    AUTH0_ISSUER_BASE_URL: string;
    // Add other env vars here
  }
}
