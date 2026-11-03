// Fails the build if any Client Component ever imports database code.
import "server-only";
import { neon } from "@neondatabase/serverless";
import { drizzle, type NeonHttpDatabase } from "drizzle-orm/neon-http";

const getDatabaseUrl = (): string => {
  const databaseUrl = process.env.DATABASE_URL;
  if (!databaseUrl) {
    throw new Error(
      "DATABASE_URL is missing. Run `vercel env pull .env.local` first.",
    );
  }
  return databaseUrl;
};

// Neon's HTTP driver is stateless, so creating a client per call is cheap and avoids
// reading DATABASE_URL at import time (which would break builds without it).
const getDb = (): NeonHttpDatabase =>
  drizzle({ client: neon(getDatabaseUrl()), casing: "snake_case" });

export default getDb;
