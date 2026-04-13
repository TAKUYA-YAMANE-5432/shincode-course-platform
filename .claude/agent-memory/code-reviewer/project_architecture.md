---
name: project_architecture
description: Core architectural decisions, patterns, and conventions observed in shincode-course-platform
type: project
---

Next.js 16.2.3 / React 19 / TypeScript 5 / Tailwind CSS 4 / Supabase (Postgres + Auth) course platform.

Key architectural decisions:

- `lib/supabase/client.ts` — Browser client using `createBrowserClient` from `@supabase/ssr`
- `lib/supabase/server.ts` — Server client using `createServerClient` from `@supabase/ssr`, `cookies()` is properly awaited
- `lib/supabase/middleware.ts` — `updateSession()` helper that calls `getClaims()` and sets `Cache-Control: no-store` headers
- `lib/supabase/public.ts` — Cookie-free public client for `'use cache'` functions
- `proxy.ts` (project root) — **NOT named `middleware.ts`**; this is the critical bug: the middleware logic exists but is never executed by Next.js because the file is named `proxy.ts` instead of `middleware.ts`
- `lib/courses.ts` — All public data-fetching with `'use cache'` + `cacheTag('courses')` + `cacheLife('hours')`, uses `createPublicClient()`
- `app/admin/actions.ts` — `requireAdmin()` helper for admin Server Actions; uses `getClaims()` + profiles.role check
- Admin pages: each page re-implements auth check inline (getClaims + profile role check) rather than relying on middleware

**Why (concerning):** middleware never fires, so route protection is only enforced at the component level — there is no edge-level redirect guard.

**How to apply:** Always flag the `proxy.ts` naming issue as Critical in reviews. Recommend renaming to `middleware.ts` and exporting as `middleware` function.
