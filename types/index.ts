/**
 * Shared type definitions for the TechnoBlog application
 * Based on the data model specified in PRD.md
 */

export interface User {
  id: string;
  email: string;
  created_at: string;
}

export interface Profile {
  user_id: string;
  display_name: string;
  avatar_url?: string;
  bio?: string;
  role: "user" | "author" | "moderator" | "admin";
}

export interface Author {
  id: string;
  display_name: string;
  avatar_url?: string;
  bio?: string;
  role: string;
}

export interface Tag {
  id: string;
  slug: string;
  name: string;
  description?: string;
  post_count?: number;
}

export interface Post {
  id: string;
  author_id: string;
  title: string;
  slug: string;
  content_md: string;
  content_mdx?: string;
  cover_image_url?: string | null;
  status: "draft" | "published" | "archived";
  published_at?: string;
  updated_at: string;
  reading_time_ms?: number;
  view_count?: number;
  upvote_count?: number;
  comment_count?: number;
  author: Author;
  tags: Tag[];
  snippet?: string; // For card previews
}

export interface Comment {
  id: string;
  post_id: string;
  author_id: string;
  parent_id?: string;
  body: string;
  created_at: string;
  status: "approved" | "pending" | "removed";
  author: Author;
  replies?: Comment[];
}

export interface Vote {
  id: string;
  user_id: string;
  post_id: string;
  value: 1 | -1;
  created_at: string;
}

// UI-specific types
export interface NavigationItem {
  label: string;
  href: string;
  external?: boolean;
}

export interface FeaturedPost extends Post {
  featured_reason?: string;
  featured_at?: string;
}

export interface SidebarData {
  trendingTags: Tag[];
  recommendedPosts: Post[];
  categories: Category[];
}

// Response wrapper types for API consistency
export type Result<T> =
  | { ok: true; data: T }
  | { ok: false; error: string; status?: number };

// Common props for reusable components
export interface BaseComponentProps {
  className?: string;
  children?: React.ReactNode;
}

export interface PostCardProps extends BaseComponentProps {
  post: Post;
  variant?: "default" | "featured" | "compact";
  showAuthor?: boolean;
  showTags?: boolean;
  showSnippet?: boolean;
}

// About page types
export interface TeamMember {
  id: string;
  name: string;
  role: string;
  bio: string;
  avatar_url: string;
  social_links?: {
    twitter?: string;
    linkedin?: string;
    github?: string;
    website?: string;
  };
}

export interface AboutPageData {
  mission: string;
  vision: string;
  values: string[];
  team: TeamMember[];
  contact: {
    email: string;
    address?: string;
    phone?: string;
  };
  stats: {
    posts_published: number;
    authors: number;
    readers: number;
    years_active: number;
  };
}

// Posts page types
export interface Category {
  id: string;
  slug: string;
  name: string;
  description?: string;
  post_count: number;
  color?: string;
  icon?: string;
}

export interface PostsPageData {
  posts: Post[];
  categories: Category[];
  popularTags: Tag[];
  totalCount: number;
}

export type ViewMode = "grid" | "list" | "compact";

export interface PostsFilter {
  category?: string;
  tags?: string[];
  search?: string;
  sortBy?: "latest" | "popular" | "oldest";
}

export interface PostCardVariant {
  variant: ViewMode;
  post: Post;
  category?: Category;
}

// Post details page types
export interface PostDetailsData {
  post: Post;
  relatedPosts: Post[];
  comments: Comment[];
  userVote?: Vote;
}

export interface CodeBlockProps {
  code: string;
  language: string;
  filename?: string;
  showLineNumbers?: boolean;
}

export interface VideoPlayerProps {
  url: string;
  title?: string;
  thumbnail?: string;
  autoplay?: boolean;
}

export interface LikeButtonProps {
  postId: string;
  isLiked: boolean;
  likeCount: number;
  onToggleLike: (postId: string) => void;
}

export interface ShareButtonsProps {
  url: string;
  title: string;
  description?: string;
}
