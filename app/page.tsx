import { ArrowRight } from "lucide-react";
import { FeaturedPosts } from "@/components/FeaturedPosts";
import { PostCard } from "@/components/PostCard";
import { Sidebar } from "@/components/Sidebar";
import { Button } from "@/components/ui";
// Use Prisma services
import { getFeaturedPosts, getLatestPosts } from "@/services/posts";
import { getTrendingTags } from "@/services/tags";
import type {
  Post as UIPost,
  SidebarData as UISidebarData,
  Tag as UITag,
} from "@/types";

// Helper function to transform posts for UI compatibility
function transformPostForUI(post: any): UIPost {
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

async function getHomePageData() {
  try {
    const [featuredPosts, latestPosts, trendingTags] = await Promise.all([
      getFeaturedPosts(6),
      getLatestPosts(6),
      getTrendingTags(8),
    ]);

    const sidebarData: UISidebarData = {
      trendingTags: trendingTags.map((tag) => ({
        id: tag.id,
        slug: tag.slug,
        name: tag.name,
        color: undefined, // Color not provided by the new service
        post_count: tag.post_count || 0,
      })),
      recommendedPosts: latestPosts.slice(0, 3).map(transformPostForUI),
      categories: [
        {
          id: "frontend",
          slug: "frontend",
          name: "Frontend",
          post_count: 45,
          icon: "Layout",
          description: "React.js, Vue.js, Angular",
          color: "#3B82F6",
        },
        {
          id: "backend",
          slug: "backend",
          name: "Backend",
          post_count: 32,
          icon: "Server",
          description: "Next.js, Node.js, Nest.js",
          color: "#10B981",
        },
        {
          id: "devops",
          slug: "devops",
          name: "DevOps",
          post_count: 18,
          icon: "Cloud",
          description: "Docker, AWS, CI/CD",
          color: "#F59E0B",
        },
        {
          id: "mobile",
          slug: "mobile",
          name: "Mobile",
          post_count: 12,
          icon: "Smartphone",
          description: "React Native, Flutter",
          color: "#8B5CF6",
        },
        {
          id: "ai-ml",
          slug: "ai-ml",
          name: "AI & ML",
          post_count: 15,
          icon: "Brain",
          description: "ML, AI, TensorFlow",
          color: "#EF4444",
        },
      ],
    };

    return {
      featuredPosts: featuredPosts.map(transformPostForUI),
      latestPosts: latestPosts.map(transformPostForUI),
      sidebarData,
    };
  } catch (error) {
    console.error("Error loading homepage data:", error);
    // Return fallback data
    return {
      featuredPosts: [],
      latestPosts: [],
      sidebarData: {
        trendingTags: [],
        recommendedPosts: [],
        categories: [
          {
            id: "frontend",
            slug: "frontend",
            name: "Frontend",
            post_count: 45,
            icon: "Layout",
            description: "React.js, Vue.js, Angular",
            color: "#3B82F6",
          },
          {
            id: "backend",
            slug: "backend",
            name: "Backend",
            post_count: 32,
            icon: "Server",
            description: "Next.js, Node.js, Nest.js",
            color: "#10B981",
          },
          {
            id: "devops",
            slug: "devops",
            name: "DevOps",
            post_count: 18,
            icon: "Cloud",
            description: "Docker, AWS, CI/CD",
            color: "#F59E0B",
          },
          {
            id: "mobile",
            slug: "mobile",
            name: "Mobile",
            post_count: 12,
            icon: "Smartphone",
            description: "React Native, Flutter",
            color: "#8B5CF6",
          },
          {
            id: "ai-ml",
            slug: "ai-ml",
            name: "AI & ML",
            post_count: 15,
            icon: "Brain",
            description: "ML, AI, TensorFlow",
            color: "#EF4444",
          },
        ],
      },
    };
  }
}

export default async function Home() {
  const { featuredPosts, latestPosts, sidebarData } = await getHomePageData();

  return (
    <div className="min-h-screen flex flex-col">
      {/* Fullscreen Featured News Carousel */}
      <FeaturedPosts posts={featuredPosts} />

      {/* Main Content */}
      <main className="flex-1 bg-background">
        <div className="container mx-auto px-4 py-8">
          <div className="grid gap-8 lg:grid-cols-4">
            {/* Main Content Area */}
            <div className="lg:col-span-3 space-y-12">
              {/* Latest Posts Section */}
              <section>
                <div className="flex items-center justify-between mb-6">
                  <div>
                    <h2 className="text-2xl font-bold tracking-tight">
                      Latest Posts
                    </h2>
                    <p className="text-muted-foreground">
                      Stay up to date with our newest technical content
                    </p>
                  </div>
                  <Button variant="outline" className="hidden sm:flex" asChild>
                    <a href="/posts">
                      View All Posts
                      <ArrowRight className="ml-2 h-4 w-4" />
                    </a>
                  </Button>
                </div>

                <div className="grid gap-6 md:grid-cols-2">
                  {latestPosts.map((post) => (
                    <PostCard key={post.id} post={post} />
                  ))}
                </div>

                {/* Mobile View All Button */}
                <div className="mt-6 sm:hidden">
                  <Button variant="outline" className="w-full" asChild>
                    <a href="/posts">
                      View All Posts
                      <ArrowRight className="ml-2 h-4 w-4" />
                    </a>
                  </Button>
                </div>
              </section>
            </div>

            {/* Sidebar */}
            <Sidebar data={sidebarData} className="hidden lg:block" />
          </div>
        </div>
      </main>
    </div>
  );
}
