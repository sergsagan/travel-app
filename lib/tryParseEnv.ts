/* eslint-disable node/no-process-env */
import type { ZodObject, ZodRawShape } from 'zod';

import { ZodError } from 'zod';

export default function tryParseEnv<T extends ZodRawShape>(
  envSchema: ZodObject<T>,
  buildEnv: Record<string, string | undefined> = process.env,
) {
  try {
    envSchema.parse(buildEnv);
  }
  catch (error) {
    if (error instanceof ZodError) {
      let message = 'Missing required values in .env:\n';
      error.issues.forEach((issue) => {
        // @ts-expect-error Zod issue.path may be number or string
        message += `${issue.path[0]}\n`;
      });
      const e = new Error(message);
      e.stack = '';
      throw e;
    }
    else {
      console.error(error);
    }
  }
}
