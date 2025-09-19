import { ArrowUp, Clock, Eye } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import type { PostCardProps } from "@/types";

function formatReadingTime(timeMs?: number): string {
  if (!timeMs) return "";
  const minutes = Math.ceil(timeMs / (1000 * 60));
  return `${minutes} min read`;
}

function formatDate(dateString: string): string {
  const date = new Date(dateString);
  return date.toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
}

function formatNumber(num?: number): string {
  if (!num) return "0";
  if (num >= 1000) {
    return `${(num / 1000).toFixed(1)}k`;
  }
  return num.toString();
}

export function PostCard({
  post,
  variant = "default",
  showAuthor = true,
  showTags = true,
  showSnippet = true,
  className,
}: PostCardProps) {
  const isFeatured = variant === "featured";
  const isCompact = variant === "compact";

  return (
    <Card
      className={cn(
        "group hover:shadow-lg transition-all duration-200 overflow-hidden",
        isFeatured && "border-primary",
        className,
      )}
    >
      {/* Cover Image */}
      {post.cover_image_url && !isCompact && (
        <div className="relative aspect-video overflow-hidden">
          <Image
            src={post.cover_image_url}
            alt={post.title}
            fill
            className="object-cover group-hover:scale-105 transition-transform duration-200"
          />
          {isFeatured && (
            <div className="absolute top-2 left-2">
              <Badge
                variant="secondary"
                className="bg-primary text-primary-foreground"
              >
                Featured
              </Badge>
            </div>
          )}
        </div>
      )}

      <CardHeader className={cn("pb-2", isCompact && "py-3")}>
        {/* Meta Info */}
        {showAuthor && (
          <div className="flex items-center space-x-2 text-sm text-muted-foreground mb-2">
            <time dateTime={post.published_at || post.updated_at}>
              {formatDate(post.published_at || post.updated_at)}
            </time>
            {post.reading_time_ms && (
              <>
                <span>•</span>
                <div className="flex items-center space-x-1">
                  <Clock className="h-3 w-3" />
                  <span>{formatReadingTime(post.reading_time_ms)}</span>
                </div>
              </>
            )}
          </div>
        )}

        {/* Title with Avatar */}
        <Link href={`/posts/${post.slug}`}>
          <div className="flex items-start space-x-3 group/title">
            <Avatar
              className={cn(
                "flex-shrink-0 transition-transform group-hover/title:scale-105",
                isFeatured ? "h-10 w-10" : "h-8 w-8",
                isCompact && "h-6 w-6",
              )}
            >
              <AvatarImage
                src={post.author.avatar_url}
                alt={post.author.display_name}
              />
              <AvatarFallback
                className={cn(
                  "text-primary-foreground bg-primary font-medium",
                  isFeatured ? "text-sm" : "text-xs",
                  isCompact && "text-xs",
                )}
              >
                {post.author.display_name.charAt(0).toUpperCase()}
              </AvatarFallback>
            </Avatar>
            <div className="flex-1 min-w-0">
              <h3
                className={cn(
                  "font-semibold leading-tight line-clamp-2 group-hover:text-primary transition-colors",
                  isFeatured ? "text-xl" : "text-lg",
                  isCompact && "text-base",
                )}
              >
                {post.title}
              </h3>
              {!isCompact && (
                <p className="text-sm text-muted-foreground mt-1">
                  by {post.author.display_name}
                </p>
              )}
            </div>
          </div>
        </Link>
      </CardHeader>

      <CardContent className={cn("pt-0", isCompact && "py-0 pb-3")}>
        {/* Snippet */}
        {showSnippet && post.snippet && !isCompact && (
          <p className="text-muted-foreground text-sm line-clamp-3 mb-4">
            {post.snippet}
          </p>
        )}

        {/* Tags */}
        {showTags && post.tags.length > 0 && (
          <div className="flex flex-wrap gap-1 mb-4">
            {post.tags.slice(0, 3).map((tag) => (
              <Link key={tag.id} href={`/tags/${tag.slug}`}>
                <Badge
                  variant="outline"
                  className="text-xs hover:bg-primary hover:text-primary-foreground transition-colors"
                >
                  {tag.name}
                </Badge>
              </Link>
            ))}
            {post.tags.length > 3 && (
              <Badge variant="outline" className="text-xs">
                +{post.tags.length - 3}
              </Badge>
            )}
          </div>
        )}

        {/* Meta Information */}
        <div className="flex items-center justify-between text-xs text-muted-foreground">
          <div className="flex items-center space-x-3">
            {post.reading_time_ms && (
              <div className="flex items-center space-x-1">
                <Clock className="h-3 w-3" />
                <span>{formatReadingTime(post.reading_time_ms)}</span>
              </div>
            )}
            {post.view_count !== undefined && (
              <div className="flex items-center space-x-1">
                <Eye className="h-3 w-3" />
                <span>{formatNumber(post.view_count)}</span>
              </div>
            )}
          </div>
          {post.upvote_count !== undefined && (
            <div className="flex items-center space-x-1">
              <ArrowUp className="h-3 w-3" />
              <span>{formatNumber(post.upvote_count)}</span>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
