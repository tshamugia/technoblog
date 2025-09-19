import { z } from "zod";

const envSchema = z.object({
  // NextAuth.js
  NEXTAUTH_URL: z.string().url(),
  NEXTAUTH_SECRET: z
    .string()
    .min(32, "NEXTAUTH_SECRET must be at least 32 characters"),

  // OAuth Providers
  GITHUB_CLIENT_ID: z.string().min(1, "GitHub Client ID is required"),
  GITHUB_CLIENT_SECRET: z.string().min(1, "GitHub Client Secret is required"),
  GOOGLE_CLIENT_ID: z.string().min(1, "Google Client ID is required"),
  GOOGLE_CLIENT_SECRET: z.string().min(1, "Google Client Secret is required"),

  // Database (Prisma)
  DATABASE_URL: z.string().url(),
  DIRECT_URL: z.string().url(),

  // Redis
  REDIS_URL: z.string().url(),

  // Application
  NODE_ENV: z
    .enum(["development", "production", "test"])
    .default("development"),
});

function validateEnv() {
  try {
    return envSchema.parse(process.env);
  } catch (error) {
    if (error instanceof z.ZodError) {
      const missingVars = error.issues.map(
        (issue) => `${issue.path.join(".")}: ${issue.message}`
      );
      throw new Error(
        `Environment validation failed:\n${missingVars.join(
          "\n"
        )}\n\nPlease check your .env.local file.`
      );
    }
    throw error;
  }
}

export const env = validateEnv();
export type Env = z.infer<typeof envSchema>;
