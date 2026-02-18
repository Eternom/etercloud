# CLAUDE.md

## Project

**EterCloud** — Game server hosting platform (SaaS).
Users subscribe to a plan, pay via Stripe, and get a game server automatically provisioned through Pterodactyl.

**Stack:** Next.js 16 (App Router) · TypeScript · Tailwind CSS v4 · Prisma (PostgreSQL) · BetterAuth · Stripe · Pterodactyl API

---

## File structure

```
app/
  (auth)/              # Login/signup pages (redirects to /dashboard if authenticated)
  dashboard/           # Protected dashboard (redirects to /login if unauthenticated)
    layout.tsx         # Auth guard
    page.tsx           # /dashboard — Overview
    servers/page.tsx   # /dashboard/servers
    billing/page.tsx   # /dashboard/billing
  api/auth/[...all]/   # BetterAuth catch-all route
components/
  display/             # Presentational components (cards, badges)
  feedback/            # User feedback components (password strength, etc.)
  form/                # Form components (login, signup)
  navigation/          # Sidebar, nav items
  ui/                  # shadcn/ui base components
lib/
  auth.ts              # Server-side BetterAuth instance (Prisma + Stripe plugin)
  auth-client.ts       # Client-side BetterAuth (signIn, signOut, signUp, useSession)
  prisma.ts            # Prisma client singleton (pg adapter) + re-exports all generated types
  stripe.ts            # Stripe client singleton
  utils.ts             # cn() helper (clsx + tailwind-merge)
prisma/
  schema.prisma        # DB schema
  generated/           # Prisma generated client (output of prisma generate)
```

---

## Key libraries

| Library | Role |
|---|---|
| `better-auth` | Authentication (email/password, sessions) |
| `@better-auth/stripe` | Stripe plugin for BetterAuth (subscriptions, webhooks) |
| `prisma` + `@prisma/adapter-pg` | ORM with PostgreSQL via `pg` pool |
| `stripe` | Stripe Node SDK |
| `lucide-react` | Icons |
| `shadcn` (via CLI) | UI component library (installs into `components/ui/`) |
| `react-hook-form` + `zod` | Forms and validation |
| `class-variance-authority` | Component variant styling |
| `tailwind-merge` + `clsx` | Class merging utility (`cn()`) |

---

## Prisma

- Generator output: `prisma/generated/` (not the default `node_modules`)
- Import client from `@/lib/prisma` (singleton with pg pool adapter)
- Import types directly from `@/lib/prisma` (re-exported from generated client)
- Commands: `bun prisma migrate dev`, `bun prisma generate`, `bun prisma studio`

---

## Auth

- Server: `import { auth } from "@/lib/auth"` → `auth.api.getSession({ headers })`
- Client: `import { signIn, signOut, signUp, useSession } from "@/lib/auth-client"`
- Auth pages: `/login`, `/signup`
- Post-login redirect: `/dashboard`
- Post-logout redirect: `/login`

---

## GitHub workflow

**Every task, no matter how small, follows this exact flow:**

1. **Create an issue** on GitHub describing the task
2. **Create a branch** from `develop` named `{issue-number}-{short-description}`
3. **Checkout the branch** locally
4. **Execute the task**
5. **Create a PR** toward `develop` referencing the issue (`Closes #N`)
6. **Close the issue** once the PR is merged

- Main branch: `main`
- Integration branch: `develop`
- Feature branches: `{issue-number}-{short-description}` (e.g. `10-dashboard-ui`)
- Always branch off `develop`, PR back into `develop`
- **PRs must NEVER target `main` — always target `develop`**
- PR titles follow conventional commits: `feat(scope): description`
- No direct commits to `main` or `develop`

### Issue format
Issues use this structure:
- `## 📋 Description`
- `## 🎯 Objectives`
- `## ✅ Tasks` (with checkboxes)
- `## 🎓 Acceptance criteria`
- `## 📚 Resources`

---

## Design

- **Simple, single-page style** — no complex multi-step flows, no modals stacked on modals
- Each dashboard page is self-contained and readable at a glance
- Prefer inline sections over separate pages when content is lightweight
- Empty states always use the shadcn `Empty` component
- Keep pages uncluttered: one primary action per page maximum

---

## Conventions

- All code and UI text in **English**
- No mock data — use empty states for UI-only work
- Use shadcn components when available (`Badge`, `Empty`, `Card`, etc.)
- Server Components by default; add `"use client"` only when needed
- Do not pass Lucide icons (or any object with methods) from Server to Client Components — wrap in a Client Component
- `cn()` from `@/lib/utils` for all className merging
- No auto-commit — always ask before committing or pushing
