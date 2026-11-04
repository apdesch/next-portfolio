import { index, pgTable, text, timestamp } from "drizzle-orm/pg-core";
import timestamps from "./timestamps.ts";
import users from "./users.ts";

// Better Auth's sessions: one row per signed-in browser, found by the token in the cookie.
const sessions = pgTable(
  "sessions",
  {
    id: text().primaryKey(),
    token: text().notNull().unique(),
    expiresAt: timestamp({ withTimezone: true }).notNull(),
    ipAddress: text(),
    userAgent: text(),
    userId: text()
      .notNull()
      .references(() => users.id, { onDelete: "cascade" }),
    ...timestamps,
  },
  (table) => [index().on(table.userId)],
);

export default sessions;
