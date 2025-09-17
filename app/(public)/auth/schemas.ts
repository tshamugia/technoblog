import { z } from "zod";

// Social auth provider schema - for OAuth flow
export const SocialProviderSchema = z.enum(["google", "github"]);

// Optional: OAuth callback data schema if you need to handle OAuth responses
export const OAuthCallbackSchema = z.object({
  provider: SocialProviderSchema,
  code: z.string().optional(),
  state: z.string().optional(),
  error: z.string().optional(),
});

// Type exports
export type SocialProvider = z.infer<typeof SocialProviderSchema>;
export type OAuthCallbackData = z.infer<typeof OAuthCallbackSchema>;
