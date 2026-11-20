import { index, pgTable, text, timestamp } from "drizzle-orm/pg-core";
import timestamps from "./timestamps.ts";
import users from "./users.ts";

// Better Auth's sign-in methods per user. Email and password stores the password hash here;
// the token columns are part of Better Auth's required schema and stay empty without OAuth.
const accounts = pgTable(
  "accounts",
  {
    id: text().primaryKey(),
    accountId: text().notNull(),
    providerId: text().notNull(),
    userId: text()
      .notNull()
      .references(() => users.id, { onDelete: "cascade" }),
    accessToken: text(),
    refreshToken: text(),
    idToken: text(),
    accessTokenExpiresAt: timestamp({ withTimezone: true }),
    refreshTokenExpiresAt: timestamp({ withTimezone: true }),
    scope: text(),
    password: text(),
    ...timestamps,
  },
  (table) => [index().on(table.userId)],
);

export default accounts;
