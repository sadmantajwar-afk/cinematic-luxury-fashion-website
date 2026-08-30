import { db } from "@/db";
import { sql } from "drizzle-orm";

export const dynamic = "force-dynamic";

export async function GET() {
  let dbStatus = "not-configured";

  if (process.env.DATABASE_URL) {
    try {
      await db.execute(sql`select 1`);
      dbStatus = "connected";
    } catch {
      dbStatus = "error";
    }
  }

  return Response.json({
    status: "ok",
    database: dbStatus,
    timestamp: new Date().toISOString(),
  });
}
