import type { Prisma } from "@prisma/client";
import type { Author } from "./index";

// Result wrapper for consistent error handling
export type Result<T> =
  | { ok: true; data: T }
  | { ok: false; error: string; status?: number };

export function success<T>(data: T): Result<T> {
  return { ok: true, data };
}

export function failure(error: string, status = 400): Result<never> {
  return { ok: false, error, status };
}

// Enhanced types with relations
export type UserWithProfile = Prisma.UserGetPayload<{
  include: { profile: true };
}>;

export type PostWithDetails = Prisma.PostGetPayload<{
  include: {
    author: { include: { profile: true } };
    tags: { include: { tag: true } };
    _count: {
      select: {
        comments: { where: { status: "APPROVED" } };
        votes: { where: { value: "UPVOTE" } };
        bookmarks: true;
        views: true;
      };
    };
  };
}>;

export type CommentWithDetails = Prisma.CommentGetPayload<{
  include: {
    author: { include: { profile: true } };
    replies: {
      include: {
        author: { include: { profile: true } };
      };
    };
    _count: {
      select: { votes: true };
    };
  };
}>;

export type TagWithCount = Prisma.TagGetPayload<{
  include: {
    _count: { select: { posts: true } };
  };
}>;

// Post filters and pagination
export interface PostFilters {
  status?: "DRAFT" | "PUBLISHED" | "ARCHIVED";
  authorId?: string;
  tagIds?: string[];
  search?: string;
  featured?: boolean;
  sortBy?: "latest" | "popular" | "oldest" | "views";
  page?: number;
  limit?: number;
}

export interface PaginatedResponse<T> {
  data: T[];
  total: number;
  page: number;
  limit: number;
  hasMore: boolean;
}

// Data creation types
export interface CreatePostData {
  title: string;
  slug: string;
  contentMd: string;
  contentMdx?: string;
  excerpt?: string;
  coverImageUrl?: string;
  tagIds?: string[];
  status?: "DRAFT" | "PUBLISHED";
  metaTitle?: string;
  metaDescription?: string;
}

export interface UpdatePostData extends Partial<CreatePostData> {
  id: string;
}

export interface CreateUserData {
  email: string;
  name?: string;
  username?: string;
  image?: string;
  displayName: string;
  bio?: string;
}

export interface UpdateProfileData {
  displayName?: string;
  avatarUrl?: string;
  bio?: string;
  website?: string;
  location?: string;
  twitter?: string;
  github?: string;
  linkedin?: string;
}

export interface CreateTagData {
  name: string;
  slug: string;
  description?: string;
  color?: string;
  isOfficial?: boolean;
}

// API response helpers
export interface ApiResponse<T = any> {
  data?: T;
  error?: string;
  message?: string;
  status?: number;
}

// UI component types for compatibility with existing components
export interface SupabaseAuthor {
  id: string;
  displayName?: string;
  image?: string;
  bio?: string;
  role?: "user" | "author" | "moderator" | "admin";
}

export interface Tag {
  id: string;
  slug: string;
  name: string;
  post_count: number;
}

export interface Post {
  id: string;
  author_id: string;
  title: string;
  slug: string;
  content_md: string;
  status: "draft" | "published" | "archived";
  published_at: string;
  updated_at: string;
  cover_image_url?: string | null;
  reading_time_ms?: number; // Changed from number | null to match types/index.ts
  view_count: number;
  upvote_count: number;
  comment_count: number;
  author: Author;
  tags: Tag[];
  snippet?: string;
  featured_reason?: string;
  featured_at?: string;
}

export interface FeaturedPost extends Post {
  featured_reason?: string;
  featured_at?: string;
}

export interface SidebarData {
  trendingTags: Tag[];
  recommendedPosts: Post[];
  categories: Tag[];
}

// Conversion helpers for UI compatibility
export function convertPostForUI(prismaPost: PostWithDetails): Post {
  return {
    id: prismaPost.id,
    author_id: prismaPost.authorId,
    title: prismaPost.title,
    slug: prismaPost.slug,
    content_md: prismaPost.contentMd,
    status: prismaPost.status.toLowerCase() as
      | "draft"
      | "published"
      | "archived",
    published_at: prismaPost.publishedAt?.toISOString() ?? "",
    updated_at: prismaPost.updatedAt.toISOString(),
    cover_image_url: prismaPost.coverImageUrl,
    reading_time_ms: prismaPost.readingTimeMs ?? undefined,
    view_count: prismaPost.viewCount ?? 0,
    upvote_count: prismaPost.upvoteCount ?? 0,
    comment_count: prismaPost.commentCount ?? 0,
    author: {
      id: prismaPost.author.id,
      display_name: prismaPost.author.profile?.displayName ?? "Anonymous",
      avatar_url: prismaPost.author.profile?.image ?? undefined,
      bio: prismaPost.author.profile?.bio ?? undefined,
      role:
        (prismaPost.author.profile?.role.toLowerCase() as
          | "user"
          | "author"
          | "moderator"
          | "admin") ?? "user",
    },
    tags: prismaPost.tags.map((pt) => ({
      id: pt.tag.id,
      slug: pt.tag.slug,
      name: pt.tag.name,
      post_count: 0, // Would need a separate query to get this
    })),
    snippet: prismaPost.excerpt ?? undefined,
  };
}

export function convertTagForUI(prismaTag: TagWithCount): Tag {
  return {
    id: prismaTag.id,
    slug: prismaTag.slug,
    name: prismaTag.name,
    post_count: prismaTag._count.posts,
  };
}

export function convertUserForUI(prismaUser: UserWithProfile): Author {
  return {
    id: prismaUser.id,
    display_name: prismaUser.profile?.displayName ?? "Anonymous",
    avatar_url: prismaUser.profile?.image ?? undefined,
    bio: prismaUser.profile?.bio ?? undefined,
    role:
      (prismaUser.profile?.role.toLowerCase() as
        | "user"
        | "author"
        | "moderator"
        | "admin") ?? "user",
  };
}
