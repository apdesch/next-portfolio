// Resets the admin password, since the site sends no "forgot password" emails. Run it
// yourself with `pnpm admin:reset-password`, so the new password is typed into the prompt
// and never lands in a file or your shell history. Every signed-in browser is signed out.
import { neon } from "@neondatabase/serverless";
import { hashPassword } from "better-auth/crypto";
import { and, eq } from "drizzle-orm";
import { drizzle } from "drizzle-orm/neon-http";
import authTables from "../src/db/auth-tables.ts";
import createTerminalPrompt from "./terminal-prompt.ts";

// Better Auth's limits for email and password accounts (src/lib/auth.ts keeps the defaults).
const minimumPasswordLength = 8;
const maximumPasswordLength = 128;

const databaseUrl = process.env.DATABASE_URL;
if (!databaseUrl) throw new Error("DATABASE_URL is missing.");

const database = drizzle({ client: neon(databaseUrl), casing: "snake_case" });
const { users, accounts, sessions } = authTables;

const prompt = createTerminalPrompt();
// Better Auth stores emails in lowercase.
const email = (await prompt.ask("Admin email: ")).trim().toLowerCase();
const [user] = await database
  .select({ id: users.id })
  .from(users)
  .where(eq(users.email, email));

if (!user) {
  prompt.close();
  // Only someone with the database credentials can run this, so naming the account is safe.
  const [adminUser] = await database.select({ email: users.email }).from(users);
  console.error(
    adminUser
      ? `No account uses that email. The admin account is ${adminUser.email}.`
      : "There's no admin account yet. Create one with `pnpm admin:create`.",
  );
  process.exit(1);
}

const password = await prompt.askHidden(
  "New password (a long passphrase is best): ",
);
const confirmation = await prompt.askHidden("New password again: ");
prompt.close();

if (password !== confirmation) {
  console.error("The passwords don't match. Nothing was changed.");
  process.exit(1);
}
if (
  password.length < minimumPasswordLength ||
  password.length > maximumPasswordLength
) {
  console.error(
    `Use ${minimumPasswordLength} to ${maximumPasswordLength} characters. Nothing was changed.`,
  );
  process.exit(1);
}

const [updatedAccount] = await database
  .update(accounts)
  .set({ password: await hashPassword(password) })
  .where(
    and(eq(accounts.userId, user.id), eq(accounts.providerId, "credential")),
  )
  .returning({ id: accounts.id });
if (!updatedAccount) {
  console.error("That account has no password sign-in. Nothing was changed.");
  process.exit(1);
}

await database.delete(sessions).where(eq(sessions.userId, user.id));
console.log(
  `Reset the password for ${email}. Every signed-in browser was signed out.`,
);
