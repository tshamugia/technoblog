import type { Metadata } from "next";
// Use Prisma services
import { getAllPosts } from "@/services/posts";
import { getAllTags } from "@/services/tags";
import PostsPageClient from "./components/PostsPageClient";

export const metadata: Metadata = {
  title: "All Posts | TechnoBlog",
  description:
    "Browse all our technology and development articles. Filter by categories, tags, and search for specific topics.",
  keywords: [
    "technology",
    "development",
    "programming",
    "tutorials",
    "articles",
  ],
};

// Helper function to transform posts for UI compatibility (same as in homepage)
function transformPostForUI(post: any) {
  return {
    id: post.id,
    author_id: post.author?.id || "",
    title: post.title,
    slug: post.slug,
    content_md: post.content_md,
    content_mdx: post.content_mdx,
    cover_image_url: post.cover_image_url,
    status: post.status?.toLowerCase() as any,
    published_at: post.published_at,
    updated_at: post.updated_at,
    reading_time_ms: post.reading_time_ms || undefined,
    view_count: post.view_count || 0,
    upvote_count: post.upvote_count || 0,
    comment_count: post.comment_count || 0,
    author: {
      id: post.author?.id || "",
      display_name: post.author?.name || "Anonymous",
      avatar_url: post.author?.image,
      bio: post.author?.profile?.bio,
      role: post.author?.role || "user",
    },
    tags:
      post.tags?.map((tag: any) => ({
        id: tag.id,
        slug: tag.slug,
        name: tag.name,
        color: tag.color,
      })) || [],
    snippet: post.excerpt,
  };
}

async function getPostsPageData() {
  try {
    const [postsResult, tagsResult] = await Promise.all([
      getAllPosts(),
      getAllTags(),
    ]);

    return {
      posts: postsResult.map(transformPostForUI),
      totalCount: postsResult.length,
      popularTags: tagsResult.map((tag) => ({
        id: tag.id,
        slug: tag.slug,
        name: tag.name,
        color: undefined, // Color not provided by the new service
      })),
      categories: [
        {
          id: "all",
          slug: "all",
          name: "All Posts",
          post_count: postsResult.length,
          icon: "Layout",
          description: "Browse all our articles across every topic",
        },
        {
          id: "frontend",
          slug: "frontend",
          name: "Frontend",
          post_count: 45,
          icon: "Layout",
          description: "React.js, Vue.js, Angular, HTML, CSS",
          color: "#3B82F6",
        },
        {
          id: "backend",
          slug: "backend",
          name: "Backend",
          post_count: 32,
          icon: "Server",
          description: "Next.js, Node.js, Nest.js, APIs",
          color: "#10B981",
        },
        {
          id: "devops",
          slug: "devops",
          name: "DevOps",
          post_count: 18,
          icon: "Cloud",
          description: "Docker, Kubernetes, AWS, CI/CD",
          color: "#F59E0B",
        },
        {
          id: "mobile",
          slug: "mobile",
          name: "Mobile",
          post_count: 12,
          icon: "Smartphone",
          description: "React Native, Flutter, iOS, Android",
          color: "#8B5CF6",
        },
        {
          id: "ai-ml",
          slug: "ai-ml",
          name: "AI & ML",
          post_count: 15,
          icon: "Brain",
          description: "Machine Learning, AI, TensorFlow, PyTorch",
          color: "#EF4444",
        },
        {
          id: "database",
          slug: "database",
          name: "Database",
          post_count: 8,
          icon: "Database",
          description: "PostgreSQL, MongoDB, Redis, SQL",
          color: "#06B6D4",
        },
        {
          id: "web",
          slug: "web",
          name: "Web Development",
          post_count: 22,
          icon: "Globe",
          description: "Full-stack, JAMstack, Web APIs, PWA",
          color: "#84CC16",
        },
      ],
    };
  } catch (error) {
    console.error("Error loading posts page data:", error);
    return {
      posts: [],
      totalCount: 0,
      popularTags: [],
      categories: [
        {
          id: "all",
          slug: "all",
          name: "All Posts",
          post_count: 0,
          icon: "Layout",
          description: "Browse all our articles across every topic",
        },
        {
          id: "frontend",
          slug: "frontend",
          name: "Frontend",
          post_count: 0,
          icon: "Layout",
          description: "React.js, Vue.js, Angular, HTML, CSS",
          color: "#3B82F6",
        },
        {
          id: "backend",
          slug: "backend",
          name: "Backend",
          post_count: 0,
          icon: "Server",
          description: "Next.js, Node.js, Nest.js, APIs",
          color: "#10B981",
        },
        {
          id: "devops",
          slug: "devops",
          name: "DevOps",
          post_count: 0,
          icon: "Cloud",
          description: "Docker, Kubernetes, AWS, CI/CD",
          color: "#F59E0B",
        },
        {
          id: "mobile",
          slug: "mobile",
          name: "Mobile",
          post_count: 0,
          icon: "Smartphone",
          description: "React Native, Flutter, iOS, Android",
          color: "#8B5CF6",
        },
        {
          id: "ai-ml",
          slug: "ai-ml",
          name: "AI & ML",
          post_count: 0,
          icon: "Brain",
          description: "Machine Learning, AI, TensorFlow, PyTorch",
          color: "#EF4444",
        },
        {
          id: "database",
          slug: "database",
          name: "Database",
          post_count: 0,
          icon: "Database",
          description: "PostgreSQL, MongoDB, Redis, SQL",
          color: "#06B6D4",
        },
        {
          id: "web",
          slug: "web",
          name: "Web Development",
          post_count: 0,
          icon: "Globe",
          description: "Full-stack, JAMstack, Web APIs, PWA",
          color: "#84CC16",
        },
      ],
    };
  }
}

export default async function PostsPage() {
  const initialData = await getPostsPageData();

  return <PostsPageClient initialData={initialData} />;
}
