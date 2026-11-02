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

## Design (required)

- Public site: keep my original design. I designed it myself. Match the old portfolio's look
  (layout, colours, typography, spacing, interactions) as closely as possible. Modernise the code,
  not the visual design.
- The old repo is the design reference: rebuild its look in Tailwind v4, don't copy its code or CSS.
- New public features must follow the existing design principles. Don't introduce a new visual style.
- If the modern stack forces a visible difference, tell me and ask before shipping it.
- Approved addition: page transitions using React's `<ViewTransition>` (browser View Transitions
  API). Keep them subtle and in keeping with the original design. Pages must still work in browsers
  without support. Build them only in the final polish stage (see build order).

## Admin design (required)

- The admin area can be redesigned from scratch. It must support dark mode.
- Before building, present at least three distinct design options, each runnable in a local build
  I can open and click through.
- Do not build on any admin design until I have seen the options running locally and approved one.

## Build order (do not jump ahead)

1. Public pages only, matching the original design. Project content lives in a typed TypeScript
   file. No database, no auth.
2. Move project content into Postgres with Drizzle.
3. Admin area: sign-in, create/edit projects, image upload. Starts with three or more locally
   runnable design options (dark mode required), and building waits for my approval.
4. Polish: page transitions, once the design is complete and every feature works.

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
- Comments only explain _why_, never _what_.
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
- If you find a security issue or edge case, stop and tell me before moving forward, with
  possible fixes and their trade-offs. Let me choose.
- Feature work (pages, API, auth, admin) happens on a new branch, not on the setup branch.
- Keep work local (no push, no PR) until I've seen it running on my machine and say otherwise.
- Never commit without my approval. Show me the diff and proposed message, then wait for my OK.
- After changes, run `pnpm lint`, `pnpm typecheck` and `pnpm build` (and tests once they exist),
  then summarize what changed in plain language.
- If you are unsure about a requirement, ask instead of guessing.

## Commands

- `pnpm dev` — local dev server
- `pnpm build` — production build
- `pnpm lint` — ESLint
- `pnpm typecheck` — `next typegen && tsc --noEmit`
- `pnpm knip` — find unused files, exports and dependencies
- `pnpm format` / `pnpm format:check` — Prettier (write / verify)
