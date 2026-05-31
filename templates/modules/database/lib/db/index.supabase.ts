import { drizzle } from 'drizzle-orm/postgres-js';
import postgres from 'postgres';
import { env } from '../../env';
import * as schema from './schema';

export { createClient } from '@supabase/supabase-js';

const url = env.DATABASE_URL;

if (!url.startsWith('postgresql://') && !url.startsWith('postgres://')) {
  throw new Error(
    'DATABASE_URL must be a postgresql:// URL for Supabase. Regenerate with database=supabase or update your connection string.',
  );
}

const client = postgres(url, { prepare: false });

export const db = drizzle(client, { schema });
export * from './schema';
