import "server-only";
import { betterAuth } from "better-auth";
import { drizzleAdapter } from "better-auth/adapters/drizzle";
import { nextCookies } from "better-auth/next-js";
import authTables from "@/db/auth-tables";
import getDb from "@/db/client";

const oneHourInSeconds = 60 * 60;

// Reads BETTER_AUTH_SECRET (signs session cookies) and BETTER_AUTH_URL from the environment.
const auth = betterAuth({
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
