import "server-only";
import { betterAuth } from "better-auth";
import { drizzleAdapter } from "better-auth/adapters/drizzle";
import { nextCookies } from "better-auth/next-js";
import authTables from "@/db/authTables";
import getDb from "@/db/getDb";
import getAuthOrigins from "@/lib/getAuthOrigins";

const oneHourInSeconds = 60 * 60;

// Reads BETTER_AUTH_SECRET (signs session cookies) from the environment. The address comes
// from BETTER_AUTH_URL locally and from Vercel's own variables on deployments.
const auth = betterAuth({
  ...getAuthOrigins(process.env),
  database: drizzleAdapter(getDb(), {
    provider: "pg",
    schema: authTables,
    usePlural: true,
  }),
  // One admin account, created by `pnpm admin:create`; nobody can register.
  emailAndPassword: { enabled: true, disableSignUp: true },
  // Signed out after a day without use; each hour of activity pushes that back.
  session: { expiresIn: 24 * oneHourInSeconds, updateAge: oneHourInSeconds },
  // On in production only (Better Auth's default). Stored in Postgres because Vercel's
  // server instances don't share memory.
  rateLimit: {
    storage: "database",
    customRules: { "/sign-in/email": { window: 5 * 60, max: 3 } },
  },
  // Must stay last: lets Server Actions set the session cookie.
  plugins: [nextCookies()],
});

export default auth;
