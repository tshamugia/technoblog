# Technical Plan & Design (Tech PDR)

Last updated: 2025-09-16

This document specifies the technical stack, architecture, and a pragmatic step-by-step plan to implement the MVP and subsequent releases described in PRD.md.

---

## 1) Tech Stack Overview

- Framework: Next.js 15+ (App Router, Server Components by default)
- Language & Types: TypeScript (strict), Zod for validation
- UI: Tailwind CSS + shadcn/ui components
- Auth/DB/Storage: Supabase (Postgres, Auth, Storage)
- Cache/Queues: Redis (cache), BullMQ (background jobs)
- Media: Next.js Image (images), Mux (recommended) for video streaming; fallback to external embeds
- Search: Postgres full-text search (MVP), optional pgvector later
- Analytics/Telemetry: Vercel Analytics or Plausible (privacy-friendly) + OpenTelemetry compatible logs/metrics
- Testing: Vitest or Jest + React Testing Library, Playwright for e2e
- Tooling: Biome 
- State Management: Zustand
- Data Fetching & Caching: TanstakQuery
---

## 2) Architecture

### 2.1 Application Layers
- Routes (App Router): server components for read pages; client components for interactions
- Actions: server actions for mutations with Zod validation
- Services: all DB access and business logic in `services/`
- Components: shared UI in `components/`, route-local UI colocated
- Config: `config/` for Redis, Supabase clients; environment validation

### 2.2 Caching Strategy
- Redis keys
  - `post:slug:{slug}` → post + author + tags
  - `tag:{id}` → tag details
  - `leaderboard:{period}` → precomputed leaderboard
  - `search:q:{hash}` → cache popular queries briefly (30–120s)
- Invalidation
  - On post create/update/delete: delete `post:*` and related `leaderboard:*`
  - On tag updates: delete `tag:{id}` and related post keys

### 2.3 Background Jobs
- BullMQ queues
  - `metrics` → increment view counters, compute reading time
  - `rank` → periodic recalculation of post scores and leaderboards
  - `media` → process webhooks for Mux/video status

### 2.4 Security
- RBAC enforced in server actions and services (never client-only)
- Input validation via Zod at all boundaries
- Sanitization for user content (Markdown → HTML) with an allowlist
- Rate limiting (per-IP and per-user) on auth and write endpoints
- Secrets via env vars; no secrets committed

### 2.5 Observability
- Structured logs (request id, user id, route, latency)
- Error tracking (Sentry or similar)
- Metrics (p50/p90/p99 latency, cache hit rate, queue lag)

---

## 3) Data Model (Implementation Hints)

Implement ERD from PRD with PostgreSQL via Supabase. Suggested extras:
- `posts.reading_time_ms` computed on publish or first render
- `comments.status` enum: approved|pending|removed
- `votes` unique(user_id, post_id)
- Materialized view for leaderboards (optional), else cached in Redis

---

## 4) Environments & Config

- `.env.local` for local dev; `.env` in production via platform secrets
- Required envs (examples):
  - `NEXT_PUBLIC_SUPABASE_URL`, `SUPABASE_SERVICE_ROLE_KEY` (secure server-side only)
  - `REDIS_URL`
  - `MUX_TOKEN_ID`, `MUX_TOKEN_SECRET` (if using Mux)
  - `NODE_ENV`, `NEXT_RUNTIME` defaults
- Add `config/env.ts` with Zod schema to validate required env vars at startup

---

## 5) Project Structure (aligned with repo standards)

```
app/
  (public)/
      posts/
        page.ts
        layout.ts
        error.ts
        components/   #local components
        types/        #local types
  (private)/
  api/
components/     # shared components, UI
library/
services/
config/
db/
types/           # shared types
```

Notes
- DB queries live in `services/`
- Reusable server actions in `services/` or colocated near route
- shadcn/ui for consistent UI primitives

---

## 6) Step-by-Step Implementation Plan

### Phase 0: Foundations
1. Tooling & Quality
   - Configure  Biome (existing `biome.json`) and TypeScript strict mode.
2. Environment & Config
   - Create `config/env.ts` with Zod validation for required secrets.
   - Add `config/redis.ts` and `db/client.ts` (Supabase) singletons.
3. UI Kit
   - Install Tailwind + shadcn/ui preset; set base theme, typography.

Deliverables: clean lint/typecheck, CI step for lint/type.

### Phase 1: Auth & RBAC
1. Integrate Supabase Auth (email/password or magic link).
2. Create `profiles` table and role management (user, author, moderator, admin).
3. Implement server-side guards (middleware or services-level checks).
4. Add basic account pages (login/register/profile) using Server Actions.

Deliverables: secure login, role-aware session, protected (private) routes.

### Phase 2: Posts (MVP)
1. Data Model: `posts`, `post_revisions`, `tags`, `post_tags`.
2. Authoring
   - Create draft → edit MD/MDX with code blocks; preview.
   - Sanitize rendered HTML; compute reading time.
   - Publish/unpublish; slug/canonical handling.
3. Reading
   - Post page (RSC) with SEO meta, author, tags, related posts.
   - Tag pages and listings with pagination.
4. Caching
   - Redis cache for post-by-slug and tag pages; invalidate on write.

Deliverables: author can publish; readers can browse and read.

### Phase 3: Engagement (Comments, Votes, Leaderboard)
1. Comments (nested or shallow nesting for MVP)
   - Create/edit window; delete by author/mod; spam protection.
2. Upvotes
   - Unique(user_id, post_id), toggle upvote; prevent abuse.
3. Ranking
   - Score function with time decay; background job to recompute.
4. Leaderboard pages (weekly/monthly/all-time).

Deliverables: interactive community features.

### Phase 4: Search & Archives
1. Full-text search using Postgres (tsvector/tsquery) across title, content, tags.
2. Filters: tag, author, date range.
3. Archives by year/month; author archives.

Deliverables: effective discovery experience.

### Phase 5: Analytics & Notifications
1. Track views (queue increments), reading time estimate.
2. Simple author analytics dashboard.
3. Notifications: mentions, replies, moderation changes (DB + UI list; optional email later).

Deliverables: insights and feedback loop for authors.

### Phase 6: Media & Video
1. Images via Next.js Image + Supabase Storage; optimize and generate blur placeholders.
2. Video via Mux (webhooks for processing state) or external embeds as fallback.

Deliverables: reliable media pipeline.

### Phase 7: Hardening & SEO
1. Security: rate limits on auth/writes; content sanitization audit; RBAC checks.
2. Accessibility: keyboard navigation, labels, color contrast.
3. SEO: sitemap, robots, canonical, Open Graph images; structured data where relevant.
4. Observability: error tracking + dashboards for latency and cache hits.

Deliverables: production-ready polish.

---

## 7) ADRs (recommended)

- ADR-001: Video strategy (Mux vs. embeds) and cost implications.
- ADR-002: Search roadmap (BM25 full-text now; hybrid with pgvector later).
- ADR-003: Ranking formula and decay constants; recalculation cadence.

---

## 8) Open Tasks / Tickets (MVP cut)

- Env validation module (`config/env.ts`)
- Redis client (`config/redis.ts`), Supabase client (`db/client.ts`)
- Auth routes and server actions
- DB schema migration scripts (Supabase SQL) for users/profiles/posts/tags/comments/votes
- Post CRUD services, Tag services, Comment services
- RSC pages: Home, Post, Tag, Author, Search, Archives
- Caching layer and invalidation hooks
- Rate limiting middleware for sensitive routes
- Basic analytics counters and dashboard

---

## 9) Risks & Mitigations (Tech)

- XSS via Markdown → sanitize with allowlist and test cases
- Cache staleness → explicit invalidations on writes; short TTLs for derived lists
- Cost of video at scale → start with embeds; add Mux in V2 with quotas
- Search performance → proper indexes, materialized search vectors, analyze/log slow queries
