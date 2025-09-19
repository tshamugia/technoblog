import { Calendar, Clock, Eye } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import type { Post } from "@/types";

interface RelatedPostsSidebarProps {
  posts: Post[];
  className?: string;
}

function formatDate(dateString: string) {
  return new Date(dateString).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
  });
}

function formatReadingTime(ms?: number) {
  if (!ms) return "5 min";
  const minutes = Math.ceil(ms / 60000);
  return `${minutes} min`;
}

export default function RelatedPostsSidebar({
  posts,
  className,
}: RelatedPostsSidebarProps) {
  if (posts.length === 0) {
    return null;
  }

  return (
    <Card className={cn("sticky top-24", className)}>
      <CardHeader>
        <CardTitle className="text-lg">Related Posts</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {posts.map((post) => (
          <Link
            key={post.id}
            href={`/posts/${post.slug}`}
            className="group block"
          >
            <article className="space-y-3 p-3 rounded-lg border border-transparent hover:border-border hover:bg-muted/50 transition-colors">
              {/* Thumbnail */}
              {post.cover_image_url && (
                <div className="relative aspect-video w-full overflow-hidden rounded-md">
                  <Image
                    src={post.cover_image_url}
                    alt={post.title}
                    fill
                    className="object-cover transition-transform duration-200 group-hover:scale-105"
                    sizes="(max-width: 768px) 100vw, (max-width: 1200px) 33vw, 25vw"
                  />
                </div>
              )}

              {/* Content */}
              <div className="space-y-2">
                <h3 className="font-semibold leading-tight text-sm group-hover:text-primary transition-colors line-clamp-2">
                  {post.title}
                </h3>

                {post.snippet && (
                  <p className="text-xs text-muted-foreground line-clamp-2">
                    {post.snippet}
                  </p>
                )}

                {/* Tags */}
                {post.tags.length > 0 && (
                  <div className="flex flex-wrap gap-1">
                    {post.tags.slice(0, 2).map((tag) => (
                      <Badge
                        key={tag.id}
                        variant="secondary"
                        className="text-xs px-1.5 py-0.5"
                      >
                        {tag.name}
                      </Badge>
                    ))}
                    {post.tags.length > 2 && (
                      <Badge
                        variant="outline"
                        className="text-xs px-1.5 py-0.5"
                      >
                        +{post.tags.length - 2}
                      </Badge>
                    )}
                  </div>
                )}

                {/* Meta */}
                <div className="flex items-center justify-between text-xs text-muted-foreground">
                  <div className="flex items-center space-x-2">
                    <Avatar className="h-4 w-4">
                      <AvatarImage src={post.author.avatar_url} />
                      <AvatarFallback className="text-xs">
                        {post.author.display_name.charAt(0)}
                      </AvatarFallback>
                    </Avatar>
                    <span className="truncate max-w-20">
                      {post.author.display_name}
                    </span>
                  </div>

                  <div className="flex items-center space-x-2">
                    <div className="flex items-center space-x-1">
                      <Calendar className="h-3 w-3" />
                      <span>
                        {formatDate(post.published_at || post.updated_at)}
                      </span>
                    </div>
                    <div className="flex items-center space-x-1">
                      <Clock className="h-3 w-3" />
                      <span>{formatReadingTime(post.reading_time_ms)}</span>
                    </div>
                  </div>
                </div>

                {/* Stats */}
                {(post.view_count || post.upvote_count) && (
                  <div className="flex items-center space-x-3 text-xs text-muted-foreground">
                    {post.view_count && (
                      <div className="flex items-center space-x-1">
                        <Eye className="h-3 w-3" />
                        <span>{post.view_count.toLocaleString()}</span>
                      </div>
                    )}
                    {post.upvote_count && (
                      <div className="flex items-center space-x-1">
                        <span>↑</span>
                        <span>{post.upvote_count}</span>
                      </div>
                    )}
                  </div>
                )}
              </div>
            </article>
          </Link>
        ))}
      </CardContent>
    </Card>
  );
}
