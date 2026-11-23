// One-off: creates the admin account. Run it yourself with `pnpm admin:create`, so the
// password is typed into the prompt and never lands in a file or your shell history.
import { neon } from "@neondatabase/serverless";
import { betterAuth } from "better-auth";
import { drizzleAdapter } from "better-auth/adapters/drizzle";
import { count } from "drizzle-orm";
import { drizzle } from "drizzle-orm/neon-http";
import authTables from "../src/db/authTables.ts";
import createTerminalPrompt from "./createTerminalPrompt.ts";

const databaseUrl = process.env.DATABASE_URL;
if (!databaseUrl) throw new Error("DATABASE_URL is missing.");

const database = drizzle({ client: neon(databaseUrl), casing: "snake_case" });

const [existing] = await database
  .select({ users: count() })
  .from(authTables.users);
if (existing.users > 0) {
  console.log(
    "An admin account already exists. To change its password, run `pnpm admin:reset-password`.",
  );
  process.exit(0);
}

const prompt = createTerminalPrompt();
const email = (await prompt.ask("Admin email: ")).trim();
const password = await prompt.askHidden(
  "Password (a long passphrase is best): ",
);
const confirmation = await prompt.askHidden("Password again: ");
prompt.close();

if (password !== confirmation) {
  console.error("The passwords don't match. Nothing was created.");
  process.exit(1);
}

// The site's auth config disables sign-up, so this one-off instance enables it to create
// the single account. It shares the same tables and password hashing.
const auth = betterAuth({
  database: drizzleAdapter(database, {
    provider: "pg",
    schema: authTables,
    usePlural: true,
  }),
  emailAndPassword: { enabled: true },
});

await auth.api.signUpEmail({
  body: { name: "Adam Deschamp", email, password },
});
console.log(`Created the admin account for ${email}.`);
