import { z } from 'zod';

/**
 * Environment variable schema for frontend configuration.
 * Only NEXT_PUBLIC_ prefixed variables are available in the browser.
 */
const envSchema = z.object({
  NEXT_PUBLIC_API_URL: z
    .string()
    .url()
    .default('http://localhost:3001')
    .describe('Backend API base URL'),
});

/**
 * Validated environment variables.
 * Validates at build time for safety.
 */
export const env = envSchema.parse({
  NEXT_PUBLIC_API_URL: process.env.NEXT_PUBLIC_API_URL,
});
