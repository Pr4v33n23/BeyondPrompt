# BeyondPrompt — Engineering Guidelines

## Engineering Approach (Senior Full-Stack)
Think like a senior full-stack engineer building a startup MVP:
- Architecture-first: design system, DB schema, API contracts before touching code
- Build the smallest genuinely useful product — DRY, YAGNI, no speculative abstractions
- Every component: production-ready, responsive, accessible (ARIA), reusable, typed
- Every async boundary: loading skeleton + empty state + error state + retry action
- Security: RLS enforced, Zod at all boundaries, no secrets in client bundles
- Performance: ISR/cache for public reads, selective projections, code splitting

## Stack
Next.js 16 App Router · React 19 · TypeScript · Supabase (Auth + Postgres + Storage) · shadcn/ui + Tailwind · TanStack Query · React Hook Form + Zod · Vitest + Testing Library

## Architecture
- Feature-sliced: `features/<domain>/components/` — one domain per folder
- Repository layer: `server/repositories/` — all Supabase queries live here
- Service layer: `server/services/` — pure business logic (scoring, XP), no DB calls
- API routes: `/api/v1/` — REST, Zod validation, `{ data, error, meta }` envelope
- Auth: `requireUser()` and `requireAdmin()` from `@/lib/auth/server` — use in every protected route/page

## Critical Gotchas
- `proxy.ts` IS the Next.js 16 middleware entry — never create `middleware.ts` alongside it (causes build error: "Both middleware file and proxy file detected")
- Next.js 16: route params are `Promise<{...}>` — always `await params` in route handlers and pages
- `await cookies()` required in server components (Next.js 15+ async API)
- `requireAdmin()` checks `profiles.role = 'admin'`; middleware only checks auth, not role
- All data is mock until repositories are wired — never ship with `server/data/mock-catalog.ts`

## Test Strategy
- Unit: pure services (`server/services/`) — `tests/unit/`
- Integration: route handlers with mocked Supabase — `tests/integration/`
- Component: critical UI interactions — `tests/component/`
- Run: `cd apps/web && npx vitest run`
- Typecheck: `cd apps/web && npx tsc --noEmit`

## Plans
Save implementation plans to `docs/superpowers/plans/YYYY-MM-DD-feature.md`
