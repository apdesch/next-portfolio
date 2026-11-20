import { index, pgTable, text, timestamp } from "drizzle-orm/pg-core";
import timestamps from "./timestamps.ts";

// Required by Better Auth for short-lived tokens (such as password resets), even if unused.
const verifications = pgTable(
  "verifications",
  {
    id: text().primaryKey(),
    identifier: text().notNull(),
    value: text().notNull(),
    expiresAt: timestamp({ withTimezone: true }).notNull(),
    ...timestamps,
  },
  (table) => [index().on(table.identifier)],
);

export default verifications;
