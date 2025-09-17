import { ArrowRight } from "lucide-react";
import { FeaturedPosts } from "@/components/FeaturedPosts";
import Footer from "@/components/Footer";
import Header from "@/components/Header";
import { PostCard } from "@/components/PostCard";
import { Sidebar } from "@/components/Sidebar";
import { Button } from "@/components/ui";
import { mockFeaturedPosts, mockLatestPosts, mockSidebarData } from "@/lib";

export default function Home() {
  return (
    <div className="min-h-screen flex flex-col">
      {/* Fullscreen Featured News Carousel */}
      <FeaturedPosts posts={mockFeaturedPosts} />

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
                  <Button variant="outline" className="hidden sm:flex">
                    View All Posts
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Button>
                </div>

                <div className="grid gap-6 md:grid-cols-2">
                  {mockLatestPosts.map((post) => (
                    <PostCard key={post.id} post={post} />
                  ))}
                </div>

                {/* Mobile View All Button */}
                <div className="mt-6 sm:hidden">
                  <Button variant="outline" className="w-full">
                    View All Posts
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Button>
                </div>
              </section>
            </div>

            {/* Sidebar */}
            <Sidebar data={mockSidebarData} className="hidden lg:block" />
          </div>
        </div>
      </main>
    </div>
  );
}
