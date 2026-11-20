import { type SQL, sql } from "drizzle-orm";
import type { PgColumn, PgTable } from "drizzle-orm/pg-core";

// The position after the last row, worked out inside the INSERT itself, so adding an item
// takes one database round trip instead of a read followed by a write.
const getNextPositionSql = (
  table: PgTable,
  positionColumn: PgColumn,
): SQL<number> =>
  sql<number>`(select coalesce(max(${positionColumn}), 0) + 1 from ${table})`;

export default getNextPositionSql;
