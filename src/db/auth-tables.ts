// Better Auth looks tables up by model name; with `usePlural: true`, "user" maps to "users".
// Relative imports with extensions so the admin account script can load this in plain Node.
import accounts from "./tables/accounts.ts";
import rateLimits from "./tables/rate-limits.ts";
import sessions from "./tables/sessions.ts";
import users from "./tables/users.ts";
import verifications from "./tables/verifications.ts";

const authTables = { users, sessions, accounts, verifications, rateLimits };

export default authTables;
