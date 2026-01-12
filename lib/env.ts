import { z } from 'zod';

import tryParseEnv from './tryParseEnv';

const envSchema = z.object({
  NODE_ENV: z.string(),
  TURSO_DATABASE_URL: z.string(),
  TURSO_AUTH_TOKEN: z.string(),
});

export type Env = z.infer<typeof envSchema>;

export function getEnv(): Env {
  // eslint-disable-next-line node/no-process-env
  const parsed = envSchema.parse(process.env)
  tryParseEnv(envSchema, parsed)
  return parsed
}
