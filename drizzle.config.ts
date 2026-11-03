import { defineConfig } from "drizzle-kit";

// drizzle-kit runs outside Next.js, so it doesn't load .env.local on its own.
process.loadEnvFile(".env.local");

// Neon recommends the direct (unpooled) connection for migrations.
const databaseUrl = process.env.DATABASE_URL_UNPOOLED;

if (!databaseUrl) {
  throw new Error(
    "DATABASE_URL_UNPOOLED is missing. Run `vercel env pull .env.local` first.",
  );
}

const drizzleConfig = defineConfig({
  dialect: "postgresql",
  schema: "./src/db/tables",
  out: "./drizzle",
  casing: "snake_case",
  dbCredentials: { url: databaseUrl },
});

export default drizzleConfig;
