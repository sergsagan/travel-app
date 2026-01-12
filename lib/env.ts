import { z } from 'zod';

import tryParseEnv from './tryParseEnv';

const envSchemaDef = z.object({
  NODE_ENV: z.string(),
  TURSO_DATABASE_URL: z.string(),
  TURSO_AUTH_TOKEN: z.string(),
});

export type envSchema = z.infer<typeof envSchemaDef>;

tryParseEnv(envSchemaDef);

// eslint-disable-next-line node/no-process-env
export default envSchemaDef.parse(process.env);
