import { BookOpen, Hash, TrendingUp } from "lucide-react";
import Link from "next/link";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import type { SidebarData } from "@/types";
import { PostCard } from "./PostCard";

interface SidebarProps {
  data: SidebarData;
  className?: string;
}

export function Sidebar({ data, className }: SidebarProps) {
  return (
    <aside className={className}>
      <div className="space-y-6">
        {/* Trending Tags */}
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="flex items-center text-lg">
              <TrendingUp className="mr-2 h-5 w-5" />
              Trending Tags
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex flex-wrap gap-2">
              {data.trendingTags.map((tag) => (
                <Link key={tag.id} href={`/tags/${tag.slug}`}>
                  <Badge
                    variant="secondary"
                    className="hover:bg-primary hover:text-primary-foreground transition-colors cursor-pointer"
                  >
                    <Hash className="mr-1 h-3 w-3" />
                    {tag.name}
                    {tag.post_count && (
                      <span className="ml-1 text-xs opacity-70">
                        {tag.post_count}
                      </span>
                    )}
                  </Badge>
                </Link>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Recommended Posts */}
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="flex items-center text-lg">
              <BookOpen className="mr-2 h-5 w-5" />
              Recommended
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {data.recommendedPosts.map((post) => (
              <PostCard
                key={post.id}
                post={post}
                variant="compact"
                showSnippet={false}
                showTags={false}
              />
            ))}
          </CardContent>
        </Card>

        {/* Categories */}
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="flex items-center text-lg">
              <Hash className="mr-2 h-5 w-5" />
              Categories
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              {data.categories.map((category) => (
                <Link
                  key={category.id}
                  href={`/categories/${category.slug}`}
                  className="flex items-center justify-between py-2 px-3 rounded-md hover:bg-muted transition-colors group"
                >
                  <span className="text-sm font-medium group-hover:text-primary">
                    {category.name}
                  </span>
                  {category.post_count && (
                    <Badge variant="outline" className="text-xs">
                      {category.post_count}
                    </Badge>
                  )}
                </Link>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Newsletter Signup (optional) */}
        <Card className="bg-gradient-to-br from-primary/10 to-primary/5 border-primary/20">
          <CardHeader className="pb-3">
            <CardTitle className="text-lg">Stay Updated</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground mb-4">
              Get notified about new posts and updates directly in your inbox.
            </p>
            <div className="space-y-2">
              <input
                type="email"
                placeholder="Enter your email"
                className="w-full px-3 py-2 text-sm border rounded-md focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
              />
              <button
                type="button"
                className="w-full bg-primary text-primary-foreground hover:bg-primary/90 px-3 py-2 text-sm font-medium rounded-md transition-colors"
              >
                Subscribe
              </button>
            </div>
          </CardContent>
        </Card>
      </div>
    </aside>
  );
}
