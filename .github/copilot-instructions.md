# Project Standards & Coding Guidelines

This document defines coding standards, best practices, and architectural guidelines for the internal resources platform. It aims to ensure consistency, maintainability, and scalability across the codebase.

## 1) Overview

An internal platform that centralizes HR, Engineering, Onboarding, and department tools.

Core features:

- Authentication & Security (RBAC)
- User Dashboard
- Admin Dashboard
- Search Posts
- Read, Create posts
- Admin Panel
- comments, tags, voting

Tech stack:

- Next.js 15+ (App Router)
- TypeScript
- Tailwind CSS + shadcn/ui
- Supabase (DB)
- Redis (cache)

---

## 2) Core Principles

- SOLID
  - Single Responsibility: Each function/class does one thing.
  - Open/Closed: Extend without modifying existing behavior.
  - Liskov Substitution: Subtypes should be interchangeable.
  - Interface Segregation: Prefer small, focused interfaces.
  - Dependency Inversion: Depend on abstractions, not concrete implementations.
- Prefer composition over inheritance.
- Type safety first (no `any` without strong justification).
- Readability over cleverness.

---

## 3) Folder Structure (Next.js App Router)

# organize by feature/module, colocate related files.
# organize each page as modules with their own layout, components, services, and actions.
# keep shared code in top-level folders.
# organize imports in index.ts files where it improves clarity.

```
app/
  (private)/
    dashboard/
      page.tsx
      layout.tsx
      components/
      actions/
      services/             # API clients, business logic, DB access
      type.ts
  (public)/
    login/
    register/

components/           # Shared UI (shadcn/ui, common)
library/              # Utilities, helpers (pure, testable)
db/                   # DB schema, Supabase integration
services/             # Cross-module reusable services
config/               # App-wide configs (Redis, Supabase)
styles/               # Global styles
types/                # Global types
public/               # Static assets
```

Notes:

- Keep DB queries in `services/`.
- Server Actions live near routes in `actions/` or in `services/` if reusable.
- Prefer small, reusable components; colocate route-only components.
- each page as modules with their own `layout.tsx`, `components/`, `services/`, and `actions/`.

---

## 4) Naming & Declarations

- camelCase: variables and functions (`getUserProfile`)
- PascalCase: React components, classes (`UserCard`)
- UPPER_CASE: constants (`DEFAULT_PAGE_SIZE`)
- Booleans prefixed with `is/has/should` (`isActive`, `hasAccess`)

Function style:

- Exported utilities: named functions.
- Inline handlers: arrow functions.

```ts
export function getUserProfile(id: string) {
  // ...
}

const handleClick = () => {
  // ...
};
```

---

## 5) TypeScript & Error Handling

- Avoid `any`. Use generics and narrow types.
- Create typed results and errors.

```ts
type Result<T> =
  | { ok: true; data: T }
  | { ok: false; error: string; status?: number };

export function fail(message: string, status = 400): Result<never> {
  return { ok: false, error: message, status };
}
```

- Validate inputs at boundaries (API routes, server actions) with Zod.

```ts
import { z } from "zod";

export const UserIdSchema = z.object({
  userId: z.string().uuid(),
});
```

---

## 6) Backend Standards (Server Actions / API Routes)

- Use async/await.
- Validate inputs (Zod) and sanitize before DB insertion.
- Organize API by resource (`/api/users`, `/api/departments`).
- Return typed, consistent JSON responses.

```ts
// Example: API Route
import { NextResponse } from "next/server";
import { z } from "zod";
import { getUsers } from "@/services/users";

const QuerySchema = z.object({ q: z.string().optional() });

export async function GET(req: Request) {
  try {
    const url = new URL(req.url);
    const parse = QuerySchema.safeParse({
      q: url.searchParams.get("q") ?? undefined,
    });
    if (!parse.success) {
      return NextResponse.json({ error: "Invalid query" }, { status: 400 });
    }

    const users = await getUsers(parse.data.q);
    return NextResponse.json(users);
  } catch (error) {
    // Consider logging here
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}
```

Guidelines:

- Keep business logic in `services/`.
- Handle known errors with specific status codes; avoid leaking internal details.
- Prefer idempotent operations for safe retries.

---

## 7) Data & Caching (Supabase + Redis)

- DB access only in `services/`.
- Strongly typed Supabase queries.
- Cache hot reads in Redis; invalidate on writes.

```ts
// Cached user fetch
import redis from "@/config/redis";
import { supabase } from "@/db/client";

const ONE_HOUR = 60 * 60;

export async function getUserCached(userId: string) {
  const cacheKey = `user:${userId}`;

  const cached = await redis.get(cacheKey);
  if (cached) return JSON.parse(cached);

  const { data, error } = await supabase
    .from("users")
    .select("*")
    .eq("id", userId)
    .single();
  if (error) throw error;

  await redis.set(cacheKey, JSON.stringify(data), "EX", ONE_HOUR);
  return data;
}

export async function updateUser(
  userId: string,
  payload: Record<string, unknown>
) {
  const { data, error } = await supabase
    .from("users")
    .update(payload)
    .eq("id", userId)
    .select()
    .single();
  if (error) throw error;

  await redis.del(`user:${userId}`); // Invalidate cache
  return data;
}
```

---

## 8) Frontend Standards (Next.js + Tailwind + shadcn/ui)

- Use Server Components by default. Use Client Components only when:
  - You need state, refs, browsers APIs, or event handlers.
  - You use client-only libraries.
- Keep components small and reusable.
- Use Tailwind utilities; factor repeated patterns into classes or small components.
- Use shadcn/ui for consistency.
- Follow a11y best practices (labels, roles, keyboard nav, color contrast).
- export default all TSX components.

```tsx
import { Card } from "@/components/ui/card";

type UserCardProps = { name: string; role: string };

export default function UserCard({ name, role }: UserCardProps) {
  return (
    <Card className="p-4 shadow-sm" aria-label={`User ${name}`}>
      <h3 className="text-lg font-bold">{name}</h3>
      <p className="text-sm text-muted-foreground">{role}</p>
    </Card>
  );
}
```

---

## 9) Security

- Secrets via environment variables only (never commit .env).
- Sanitize all API inputs.
- Enforce RBAC in backend logic (not just UI).
- Avoid returning sensitive fields (tokens, passwords).
- Rate-limit sensitive endpoints when exposed.

---

## 10) Linting & Formatting

- ESLint for linting, Prettier for formatting.
- No `any` unless justified.
- Run `eslint --fix` before committing.

Example scripts:

- `npm lint`
- `npm format`
- `npm typecheck`

---

## 11) Commit Messages (Conventional Commits)

Format: `type(scope): message`

Types:

- feat, fix, chore, docs, refactor, perf

Examples:

- feat(users): add profile picture upload
- fix(auth): resolve token refresh bug
- refactor(api): move validation to middleware

---

## 12) Pull Request Checklist

Before opening a PR:

- [ ] Linted, formatted, and type-checked
- [ ] Added/updated tests for new logic
- [ ] Updated docs/README as needed
- [ ] Considered cache invalidation
- [ ] Verified a11y and responsiveness
- [ ] No secrets or sensitive data leaked

---
