import { drizzle } from "drizzle-orm/node-postgres";
import { Pool } from "pg";

const databaseUrl = process.env.DATABASE_URL;

const globalForDb = globalThis as typeof globalThis & {
  __arenaNextJsPostgresqlPool?: Pool;
  __arenaNextJsDrizzle?: ReturnType<typeof drizzle>;
};

let pool: Pool | undefined;
let db: ReturnType<typeof drizzle> | any;

if (databaseUrl) {
  try {
    pool =
      globalForDb.__arenaNextJsPostgresqlPool ??
      new Pool({
        connectionString: databaseUrl,
      });

    if (process.env.NODE_ENV !== "production") {
      globalForDb.__arenaNextJsPostgresqlPool = pool;
    }

    db = globalForDb.__arenaNextJsDrizzle ?? drizzle(pool);
    if (process.env.NODE_ENV !== "production") {
      globalForDb.__arenaNextJsDrizzle = db;
    }
  } catch (error) {
    console.warn("Failed to initialize PostgreSQL pool:", error);
  }
}

if (!db) {
  // Graceful fallback mock client when DATABASE_URL is not set
  db = {
    select: () => ({
      from: async () => [],
    }),
    insert: () => ({
      values: () => ({
        returning: async () => [{}],
        onConflictDoUpdate: async () => {},
      }),
    }),
    execute: async () => [],
  };
}

export { pool, db };
