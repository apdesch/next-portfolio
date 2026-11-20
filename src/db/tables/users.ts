import { boolean, pgTable, text } from "drizzle-orm/pg-core";
import timestamps from "./timestamps.ts";

// Better Auth's user table. The admin account is the only row (sign-up is disabled).
// Better Auth creates the text IDs itself.
const users = pgTable("users", {
  id: text().primaryKey(),
  name: text().notNull(),
  email: text().notNull().unique(),
  emailVerified: boolean().notNull().default(false),
  image: text(),
  ...timestamps,
});

export default users;
