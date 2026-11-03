import { pgEnum } from "drizzle-orm/pg-core";

// A fixed set, so Postgres rejects typos; adding a category takes a small migration.
// Its own module because drizzle-kit only creates enums that a schema file exports.
const projectCategory = pgEnum("project_category", [
  "app",
  "logo",
  "branding",
  "design",
]);

export default projectCategory;
