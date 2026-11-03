import { timestamp } from "drizzle-orm/pg-core";

// Shared by every table: when a row was created and when it was last edited.
const timestamps = {
  createdAt: timestamp({ withTimezone: true }).notNull().defaultNow(),
  updatedAt: timestamp({ withTimezone: true })
    .notNull()
    .defaultNow()
    .$onUpdate(() => new Date()),
};

export default timestamps;
