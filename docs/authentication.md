# Authentication System Documentation

This project uses NextAuth.js v4 with Supabase for secure user authentication and authorization.

## Features

- **Social OAuth**: Google and GitHub authentication
- **JWT Sessions**: Secure stateless session management
- **Role-Based Access Control (RBAC)**: User, Author, Moderator, Admin roles
- **Type Safety**: Full TypeScript support with custom types
- **Route Protection**: Middleware-based authentication
- **Error Handling**: Comprehensive error pages and user feedback
- **Security**: Environment validation, secure cookies, XSS protection

## Quick Start

### 1. Environment Setup

Copy `.env.local.example` to `.env.local` and configure:

```bash
# NextAuth.js Configuration
NEXTAUTH_URL=http://localhost:3000
NEXTAUTH_SECRET=your-32-character-secret-key-here

# GitHub OAuth Provider
GITHUB_CLIENT_ID=your-github-client-id
GITHUB_CLIENT_SECRET=your-github-client-secret

# Google OAuth Provider  
GOOGLE_CLIENT_ID=your-google-client-id
GOOGLE_CLIENT_SECRET=your-google-client-secret

# Supabase Configuration
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
SUPABASE_SERVICE_ROLE_KEY=your-supabase-service-role-key
SUPABASE_ANON_KEY=your-supabase-anon-key
```

### 2. Database Setup

Execute the SQL schema in your Supabase project:

```bash
# Run the schema in Supabase SQL Editor
cat db/schema.sql
```

This creates:
- NextAuth.js required tables
- User profiles table with RBAC
- Automatic triggers and RLS policies

### 3. OAuth Provider Setup

#### GitHub OAuth App
1. Go to GitHub Settings > Developer settings > OAuth Apps
2. Create new OAuth App with:
   - Homepage URL: `http://localhost:3000`
   - Callback URL: `http://localhost:3000/api/auth/callback/github`

#### Google OAuth App
1. Go to Google Cloud Console > APIs & Services > Credentials
2. Create OAuth 2.0 Client ID with:
   - Authorized origins: `http://localhost:3000`
   - Authorized redirect URIs: `http://localhost:3000/api/auth/callback/google`

## Usage

### Client-Side Authentication

```tsx
import { useAuth } from "@/hooks/useAuth";
import { signIn, signOut } from "next-auth/react";

function LoginButton() {
  const { isAuthenticated, user, isLoading } = useAuth();

  if (isLoading) return <div>Loading...</div>;

  if (isAuthenticated) {
    return (
      <div>
        <p>Welcome, {user?.name}!</p>
        <button onClick={() => signOut()}>Sign Out</button>
      </div>
    );
  }

  return (
    <div>
      <button onClick={() => signIn("github")}>Sign in with GitHub</button>
      <button onClick={() => signIn("google")}>Sign in with Google</button>
    </div>
  );
}
```

### Server-Side Authentication

```tsx
import { getCurrentUser, requireAuth, hasRole } from "@/services/auth";

// Get current user (returns null if not authenticated)
export async function getUserData() {
  const user = await getCurrentUser();
  if (!user) return { error: "Not authenticated" };
  return { user };
}

// Require authentication (throws error if not authenticated)
export async function createPost() {
  const user = await requireAuth();
  // User is guaranteed to be authenticated here
}

// Check role permissions
export async function moderateContent() {
  if (!(await hasRole("moderator"))) {
    throw new Error("Insufficient permissions");
  }
  // User has moderator or admin role
}
```

### Role-Based Access Control

```tsx
import { useAuth } from "@/hooks/useAuth";

function AdminPanel() {
  const { isAdmin, canModerate } = useAuth();

  if (!isAdmin()) {
    return <div>Access denied</div>;
  }

  return <div>Admin panel content</div>;
}

function PostActions({ post }) {
  const { canEdit } = useAuth();

  return (
    <div>
      {canEdit(post.authorId) && (
        <button>Edit Post</button>
      )}
    </div>
  );
}
```

## API Routes

### Protected API Routes

```tsx
// app/api/protected/route.ts
import { requireAuth } from "@/services/auth";
import { NextResponse } from "next/server";

export async function GET() {
  try {
    const user = await requireAuth();
    return NextResponse.json({ user });
  } catch (error) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
}
```

### Role-Protected API Routes

```tsx
// app/api/admin/route.ts
import { requireRole } from "@/services/auth";
import { NextResponse } from "next/server";

export async function GET() {
  try {
    await requireRole("admin");
    // Admin-only logic here
    return NextResponse.json({ message: "Admin data" });
  } catch (error) {
    return NextResponse.json({ error: "Insufficient permissions" }, { status: 403 });
  }
}
```

## Route Protection

Routes are automatically protected by middleware based on patterns:

- **Public Routes**: `/`, `/posts/*`, `/about`
- **Auth Routes**: `/auth/*` (redirects authenticated users)
- **Protected Routes**: Everything else requires authentication
- **Admin Routes**: `/admin/*` requires admin/moderator role

## User Roles

| Role | Permissions |
|------|-------------|
| **user** | Basic access, view content |
| **author** | Create and edit own posts |
| **moderator** | Edit any content, moderate comments |
| **admin** | Full access, user management |

## Security Features

- **Environment Validation**: Zod schemas validate all required environment variables
- **Secure Cookies**: HTTPOnly, Secure, SameSite protection
- **JWT Security**: 30-day expiration with 24-hour refresh
- **CSRF Protection**: Built-in NextAuth.js CSRF protection
- **Session Management**: Secure session handling with automatic cleanup

## Error Handling

- **Authentication Errors**: Comprehensive error page with user-friendly messages
- **Route Protection**: Automatic redirects for unauthorized access
- **API Errors**: Consistent error responses with proper HTTP status codes
- **Validation**: Zod schemas for all user inputs

## Customization

### Adding New OAuth Providers

1. Install provider package: `npm install next-auth/providers/[provider]`
2. Add provider configuration to `config/auth.ts`
3. Add environment variables to `config/env.ts`
4. Update OAuth redirect URLs

### Custom User Fields

1. Update database schema in `db/schema.sql`
2. Update TypeScript types in `types/auth.ts`
3. Update user services in `services/users.ts`

### Role Modifications

1. Update role enum in `types/auth.ts`
2. Update role hierarchy in authentication utilities
3. Update database constraints in schema

## Deployment

### Environment Variables

Set all required environment variables in your production environment:

- Use strong, randomly generated `NEXTAUTH_SECRET` (32+ characters)
- Configure OAuth apps with production URLs
- Use Supabase production credentials
- Set `NEXTAUTH_URL` to your production domain

### Security Checklist

- [ ] Strong `NEXTAUTH_SECRET` configured
- [ ] OAuth apps configured with production URLs
- [ ] Supabase RLS policies enabled
- [ ] Environment variables secured (never commit)
- [ ] HTTPS enabled in production
- [ ] Error tracking configured (e.g., Sentry)

## Troubleshooting

### Common Issues

1. **OAuth Redirect Mismatch**: Ensure OAuth app URLs match `NEXTAUTH_URL`
2. **Database Connection**: Verify Supabase credentials and schema
3. **Environment Variables**: Check all required variables are set
4. **Session Issues**: Clear cookies and check `NEXTAUTH_SECRET`

### Debug Mode

Set `NODE_ENV=development` to enable:
- Detailed error messages
- Debug information in dashboard
- Console logging for auth events

## API Reference

### Authentication Functions

- `getCurrentUser()`: Get current authenticated user
- `requireAuth()`: Require authentication (throws if not authenticated)
- `hasRole(role)`: Check if user has specific role
- `hasAnyRole(roles)`: Check if user has any of the specified roles
- `canEdit(resourceUserId)`: Check if user can edit resource
- `canModerate()`: Check if user can moderate content
- `isAdmin()`: Check if user is admin

### User Management Functions

- `getUserProfile(userId)`: Get user by ID
- `getUserByUsername(username)`: Get user by username
- `updateUserProfile(userId, data)`: Update user profile
- `updateUserRole(userId, role)`: Update user role (admin only)
- `getAllUsers(page, limit, search)`: Get paginated user list (admin only)
- `deleteUser(userId)`: Delete user (admin only)

This authentication system provides a secure, scalable foundation for user management in your Next.js application.