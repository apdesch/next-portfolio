# Portfolio (Next.js refactor)

Rebuild of my 2021 MERN portfolio (github.com/apdesch/react-portfolio) on the current stack.
The old repo is reference only. Do not copy its code; rebuild each piece the modern way.

I'm an experienced React/TypeScript engineer returning after six years away.
When you use a concept that is new since 2020 (Server Components, Server Actions,
Tailwind v4, App Router conventions), explain it in two or three sentences.

IMPORTANT: My name is Adam Deschamp. Always spell it exactly this way in code, metadata,
copy and docs. Never shorten it to "Adam Desch" (the `apdesch` handle and domain are fine as is).

## Stack
- Next.js 16 (App Router), TypeScript strict, Tailwind CSS v4, pnpm
- Later stages: Postgres (Neon) + Drizzle, Better Auth, Zod, Vitest, Playwright

## Hosting
- Target: Vercel Hobby plan (free, personal non-commercial use), connected to the GitHub repo.
  - Merges to `main` deploy to production; every pull request gets a preview URL.
  - GitHub Actions runs CI (lint, typecheck, tests, build) on every PR; Vercel handles deploys.
  - Environment variables and secrets live in Vercel project settings, never in the repo.
- Current state: apdesch.com points to a DigitalOcean Droplet running the old MERN portfolio.
  Keep it live until the new site is fully working on Vercel.
- Migration plan (do not start until I ask):
  1. Export the old MongoDB content and uploaded images from the Droplet.
  2. Add apdesch.com to the Vercel project and update DNS records.
  3. Confirm the new site works on the domain, then I shut down the Droplet and close DigitalOcean.

## Build order (do not jump ahead)
1. Public pages only. Project content lives in a typed TypeScript file. No database, no auth.
2. Move project content into Postgres with Drizzle.
3. Admin area: sign-in, create/edit projects, image upload.

## Code style (required)
- Functional style. No classes. Prefer pure functions that take input and return output.
- No mutation: use `const`, spread, `map`, `filter`, `reduce`. Never `let` unless unavoidable.
- Keep side effects (database, network, file I/O) in clearly named modules; keep everything else pure.
- Descriptive names everywhere. No single letters or abbreviations, including callbacks:
  `projects.map((project) => ...)`, not `projects.map((p) => ...)`.
- Function names start with a verb and say what they return or do:
  `getPublishedProjects`, `formatProjectDate`, `sortProjectsByNewest`.
- Booleans start with `is`, `has` or `should`.
- One job per function. If a function needs a comment to explain what it does, split or rename it.
- Early returns instead of nested `if`/`else`. No nested ternaries.
- Comments only explain *why*, never *what*.
- TypeScript: no `any`. Exported functions have explicit return types.

## No bloat (required)
- Write only what the current task needs. No speculative options, abstractions or "future" hooks.
- No unused code: no unused variables, exports, files, props, types or dependencies.
- No commented-out code.
- Extract a shared helper only when it is used in two or more places.
- Ask before adding any dependency. Prefer what Next.js, React and the platform already provide.

## How to work with me
- Plan first. Before writing code, list the files you will create or change and why. Wait for my OK.
- Keep each change small enough for me to review in a few minutes.
- Never commit without my approval. Show me the diff and proposed message, then wait for my OK.
- After changes, run `pnpm lint`, `pnpm typecheck` and `pnpm build` (and tests once they exist),
  then summarize what changed in plain language.
- If you are unsure about a requirement, ask instead of guessing.

## Commands
- `pnpm dev` — local dev server
- `pnpm build` — production build
- `pnpm lint` — ESLint
- `pnpm typecheck` — `tsc --noEmit`
- `pnpm knip` — find unused files, exports and dependencies
