import 'dotenv/config';
import { drizzle } from 'drizzle-orm/libsql';

import { getEnv } from '../env'
import * as schema from './schema';

const env = getEnv()

const db = drizzle({
  connection: {
    url: env.TURSO_DATABASE_URL,
    authToken: env.NODE_ENV === 'development' ? undefined : env.TURSO_AUTH_TOKEN,
  },
  casing: 'snake_case',
  schema,
});

export default db;
