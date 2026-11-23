import { bigint, integer, pgTable, text } from "drizzle-orm/pg-core";

// Better Auth's sign-in rate limit, kept in Postgres because Vercel runs several server
// instances that don't share memory. One row per client IP and path.
const rateLimits = pgTable("rate_limits", {
  id: text().primaryKey(),
  key: text().notNull().unique(),
  count: integer().notNull(),
  // Milliseconds since 1970, as Better Auth stores it.
  lastRequest: bigint({ mode: "number" }).notNull(),
});

export default rateLimits;
