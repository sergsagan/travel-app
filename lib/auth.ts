import type { User } from 'better-auth';

import { betterAuth } from 'better-auth';
import { drizzleAdapter } from 'better-auth/adapters/drizzle';
import db from './db/index';
import { getEnv } from './env';
import { createAuthMiddleware } from "@better-auth/core/api";

const env = getEnv();

export type UserWithId = Omit<User, 'id'> & { id: number };

export const auth = betterAuth({
  hooks: {
    after: createAuthMiddleware(async (ctx) => {
      if (ctx.path === '/get-session' && !ctx.context.session) {
        return ctx.json({
          session: null,
          user: null,
        });
      }
    })
  },
  database: drizzleAdapter(db, {
    provider: 'sqlite',
  }),
  socialProviders: {
    github: {
      clientId: env.AUTH_GITHUB_CLIENT_ID,
      clientSecret: env.AUTH_GITHUB_CLIENT_SECRET,
    },
  },
});
