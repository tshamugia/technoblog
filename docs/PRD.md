# Product Requirements Document (Technical)

Last updated: 2025-09-16

## 1) Vision & Objectives

Build a developer-centric publishing platform for technical guides, implementation posts, and videos. Enable creators to produce high-quality content with code, and help readers discover, learn, and engage.

Objectives
- Empower authors to draft, preview, publish, and analyze content easily.
- Help readers find relevant, high-quality posts quickly via tags and search.
- Foster healthy community engagement (comments, upvotes, moderation).
- Provide maintainable foundations with strong security, performance, and scalability.


---

## 2) Success Metrics (KPIs)

- Time to publish: Median < 10 minutes from new draft to publish for experienced authors.
- Reader engagement: Avg time on page > 2 minutes; comment rate > 1% of sessions.
- Search effectiveness: Search to click-through rate (CTR) > 25%.
- Performance: Median TTFB < 200ms cached, < 500ms uncached; LCP < 2.5s on 75th percentile.
- Reliability: 99.9% uptime for public read endpoints; RPO < 24h, RTO < 2h.

---

## 3) Personas

### Author
- Creates/edit posts and videos; reviews analytics.
- Needs: Powerful editor (Markdown/MDX), code blocks, media, scheduled publishing, insights.

### Reader
- Discovers, reads, comments, and upvotes content.
- Needs: Fast pages, accurate search, tag/topic discovery, reading list/bookmarks.

### Moderator
- Reviews flagged content, manages tags, enforces guidelines.
- Needs: Moderation queue, approve/reject tools, audit trail.

### Admin
- Configures platform, manages users and roles.
- Needs: User management, global settings, safety controls, audit log.

---

## 4) Key User Journeys

- Author: Create Draft → Write (Markdown/MDX + code) → Preview → Add tags/media → Publish → View analytics.
- Reader: Open Home/Tag page → Search/Filter → Read → Upvote/Comment → Follow tag/author → Bookmark.
- Moderator: Review moderation queue → Approve/Reject → Manage tags → Resolve reports.
- Admin: Manage users/roles → Configure settings → Review audit logs.

---

## 5) Functional Requirements

### 5.1 Authentication & RBAC
- Sign up/in, passwordless or email+password; session management.
- Roles: user, author, moderator, admin.
- Enforcement at server layer (not only UI).

### 5.2 Posts
- Create, edit (drafts), preview, publish, unpublish, delete.
- Markdown/MDX, code blocks with syntax highlighting, rich embeds (YouTube, GitHub Gist, CodeSandbox).
- Post revisions (track changes; keep last N versions).
- Slugs, canonical URLs, cover image, reading time, authorship attribution.

### 5.3 Media (Videos & Images)
- Upload images; optimize via Next.js Image and CDN.
- Video: upload/embeds; recommended: Mux integration (transcoding, thumbnails, streaming) or external embed.

### 5.4 Tagging & Discovery
- Create/manage tags; assign multiple tags per post.
- Tag pages (description, cover); trending tags; related tags.

### 5.5 Search
- Full-text search with relevance; filters by tag, author, date.
- Optional semantic search via pgvector for later phase.

### 5.6 Comments
- Nested comments; basic formatting; edit window; delete by author/mods.
- Moderation tools: flagging, spam detection, rate limiting.

### 5.7 Ranking & Leaderboard
- Score = f(upvotes, views, time decay). Configurable weights.
- Leaderboard for top authors over time ranges (weekly/monthly/all-time).

### 5.8 User Dashboard
- Drafts, recently edited, published posts, analytics summary.
- Notifications: mentions, replies, moderation status changes.

### 5.9 Archives
- Browsing by year/month; tag archives; author archives.

### 5.10 Analytics
- Page views, reading time estimate, engagement (upvotes/comments).
- Author-level insights; basic site analytics dashboard.

### 5.11 Security & Safety
- Input validation (Zod), CSRF/XSS protections, content sanitization.
- Rate limiting sensitive endpoints, brute-force prevention.

---

## 6) Non-Functional Requirements (NFRs)

- Performance: SSR target TTFB < 200ms (cached); client LCP < 2.5s p75.
- Scalability: Stateless Next.js; scalable Postgres; object storage for media; Redis cache.
- Reliability: Nightly backups; restore tested quarterly.
- Security: OWASP Top 10; secrets via environment variables; least-privilege RBAC.
- Accessibility: WCAG 2.1 AA for core flows.
- SEO: Clean URLs, metadata, sitemaps, robots, Open Graph/Twitter cards.
- Observability: Structured logs, metrics (p50/p90/p99 latency), error tracking.
- Internationalization: Prepare for i18n (copy separated, RTL-ready) in later phase.

---

## 7) Architecture Overview

Tech stack (per project standards)
- Next.js 15+ (App Router, Server Components default)
- TypeScript
- Tailwind CSS + shadcn/ui
- Supabase (Postgres + Auth + Storage)
- Redis (cache)

High-level design
- Server Components for read-heavy pages; Client Components for interactive parts.
- Data access isolated in services/ with typed queries. Server Actions near routes for page-specific mutations.
- Caching: Redis for hot reads (e.g., post by slug, tag pages, leaderboards). Cache keys: post:{slug}, tag:{id}, leaderboard:{period}. Invalidate on writes.
- Media: Supabase Storage for images; Mux (recommended) for video streaming and thumbnails.
- Background jobs: BullMQ

---

## 8) Data Model (ERD Sketch)

- users (id, email, created_at)
- profiles (user_id FK, display_name, avatar_url, bio, role)
- posts (id, author_id FK, title, slug, content_md, content_mdx, cover_image_url, status[draft|published|archived], published_at, updated_at, reading_time_ms)
- post_revisions (id, post_id FK, version, content_md, created_at)
- tags (id, slug, name, description)
- post_tags (post_id FK, tag_id FK)
- comments (id, post_id FK, author_id FK, parent_id FK nullable, body, created_at, status)
- votes (id, user_id FK, post_id FK, value[1|-1], created_at)
- views (post_id FK, date, count)
- notifications (id, user_id FK, type, payload_json, read_at, created_at)
- follows (follower_id FK, target_type[author|tag], target_id, created_at)
- bookmarks (user_id FK, post_id FK, created_at)
- audit_logs (id, actor_id FK, action, entity_type, entity_id, payload_json, created_at)

Indexes
- posts.slug (unique), posts.published_at DESC
- post_tags(post_id, tag_id), tags.slug (unique)
- comments(post_id, parent_id), votes(post_id, user_id unique)
- views(post_id, date), follows(follower_id, target_type, target_id)

---

## 9) API & Validation

- Use Server Actions for mutations (createPost, updatePost, vote, comment) with Zod validation.
- Organize read endpoints by resource (e.g., /api/posts?tag=nextjs&q=… ).
- Consistent Result<T> type responses; handle known errors with specific status codes.
- Rate limit: per-IP + per-user buckets on auth and write endpoints.

---
