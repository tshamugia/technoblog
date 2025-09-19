"use client";

import { Calendar, Clock, Eye, Heart, MessageCircle } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import type { Post, ViewMode } from "@/types";

interface PostCardProps {
  post: Post;
  viewMode?: ViewMode;
  className?: string;
}

function formatDate(dateString: string) {
  return new Date(dateString).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
}

function formatReadingTime(ms?: number) {
  if (!ms) return "5 min read";
  const minutes = Math.ceil(ms / 60000);
  return `${minutes} min read`;
}

export default function PostCard({
  post,
  viewMode = "grid",
  className,
}: PostCardProps) {
  const isListView = viewMode === "list";
  const isCompactView = viewMode === "compact";

  if (isListView) {
    return (
      <Card
        className={cn(
          "group cursor-pointer transition-all duration-200 hover:shadow-md border-l-4 border-l-primary/20 hover:border-l-primary",
          className,
        )}
      >
        <Link href={`/posts/${post.slug}`} className="block">
          <CardContent className="p-6">
            <div className="flex gap-6">
              {/* Thumbnail */}
              {post.cover_image_url && (
                <div className="relative h-24 w-40 flex-shrink-0 overflow-hidden rounded-lg">
                  <Image
                    src={post.cover_image_url}
                    alt={post.title}
                    fill
                    className="object-cover transition-transform duration-200 group-hover:scale-105"
                  />
                </div>
              )}

              {/* Content */}
              <div className="flex-1 space-y-3">
                <div className="space-y-2">
                  {/* Title with Avatar */}
                  <div className="flex items-start space-x-3 group/title">
                    <Avatar className="h-8 w-8 flex-shrink-0 transition-transform group-hover/title:scale-105">
                      <AvatarImage
                        src={post.author.avatar_url}
                        alt={post.author.display_name}
                      />
                      <AvatarFallback className="text-xs text-primary-foreground bg-primary font-medium">
                        {post.author.display_name.charAt(0).toUpperCase()}
                      </AvatarFallback>
                    </Avatar>
                    <div className="flex-1 min-w-0">
                      <h3 className="text-xl font-semibold leading-tight text-foreground group-hover:text-primary transition-colors">
                        {post.title}
                      </h3>
                      <p className="text-sm text-muted-foreground mt-1">
                        by {post.author.display_name}
                      </p>
                    </div>
                  </div>
                  {post.snippet && (
                    <p className="text-muted-foreground line-clamp-2 ml-11">
                      {post.snippet}
                    </p>
                  )}
                </div>

                {/* Tags */}
                {post.tags.length > 0 && (
                  <div className="flex flex-wrap gap-1">
                    {post.tags.slice(0, 3).map((tag) => (
                      <Badge
                        key={tag.id}
                        variant="secondary"
                        className="text-xs"
                      >
                        {tag.name}
                      </Badge>
                    ))}
                    {post.tags.length > 3 && (
                      <Badge variant="outline" className="text-xs">
                        +{post.tags.length - 3}
                      </Badge>
                    )}
                  </div>
                )}

                {/* Meta */}
                <div className="flex items-center justify-between ml-11">
                  <div className="flex items-center space-x-4 text-sm text-muted-foreground">
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

                  {/* Stats */}
                  <div className="flex items-center space-x-4 text-sm text-muted-foreground">
                    {post.view_count && (
                      <div className="flex items-center space-x-1">
                        <Eye className="h-3 w-3" />
                        <span>{post.view_count.toLocaleString()}</span>
                      </div>
                    )}
                    {post.upvote_count && (
                      <div className="flex items-center space-x-1">
                        <Heart className="h-3 w-3" />
                        <span>{post.upvote_count}</span>
                      </div>
                    )}
                    {post.comment_count && (
                      <div className="flex items-center space-x-1">
                        <MessageCircle className="h-3 w-3" />
                        <span>{post.comment_count}</span>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Link>
      </Card>
    );
  }

  // Grid and Compact views
  return (
    <Card
      className={cn(
        "group cursor-pointer transition-all duration-200 hover:shadow-lg hover:-translate-y-1",
        isCompactView ? "h-fit" : "h-full",
        className,
      )}
    >
      <Link href={`/posts/${post.slug}`} className="block h-full">
        {/* Cover Image */}
        {post.cover_image_url && (
          <div
            className={cn(
              "relative overflow-hidden rounded-t-lg",
              isCompactView ? "h-32" : "h-48",
            )}
          >
            <Image
              src={post.cover_image_url}
              alt={post.title}
              fill
              className="object-cover transition-transform duration-200 group-hover:scale-105"
            />
          </div>
        )}

        <CardHeader className={cn(isCompactView ? "p-4 pb-2" : "p-6 pb-3")}>
          <div className="space-y-2">
            {/* Title with Avatar */}
            <div className="flex items-start space-x-3 group/title">
              <Avatar
                className={cn(
                  "flex-shrink-0 transition-transform group-hover/title:scale-105",
                  isCompactView ? "h-6 w-6" : "h-8 w-8",
                )}
              >
                <AvatarImage
                  src={post.author.avatar_url}
                  alt={post.author.display_name}
                />
                <AvatarFallback
                  className={cn(
                    "text-primary-foreground bg-primary font-medium",
                    isCompactView ? "text-xs" : "text-sm",
                  )}
                >
                  {post.author.display_name.charAt(0).toUpperCase()}
                </AvatarFallback>
              </Avatar>
              <div className="flex-1 min-w-0">
                <h3
                  className={cn(
                    "font-semibold leading-tight text-foreground group-hover:text-primary transition-colors line-clamp-2",
                    isCompactView ? "text-base" : "text-lg",
                  )}
                >
                  {post.title}
                </h3>
                {!isCompactView && (
                  <p className="text-sm text-muted-foreground mt-1">
                    by {post.author.display_name}
                  </p>
                )}
              </div>
            </div>
            {!isCompactView && post.snippet && (
              <p className="text-sm text-muted-foreground line-clamp-3 ml-11">
                {post.snippet}
              </p>
            )}
          </div>
        </CardHeader>

        <CardContent className={cn(isCompactView ? "p-4 pt-0" : "p-6 pt-0")}>
          <div className="space-y-3">
            {/* Tags */}
            {post.tags.length > 0 && (
              <div className="flex flex-wrap gap-1">
                {post.tags.slice(0, isCompactView ? 2 : 3).map((tag) => (
                  <Badge key={tag.id} variant="secondary" className="text-xs">
                    {tag.name}
                  </Badge>
                ))}
                {post.tags.length > (isCompactView ? 2 : 3) && (
                  <Badge variant="outline" className="text-xs">
                    +{post.tags.length - (isCompactView ? 2 : 3)}
                  </Badge>
                )}
              </div>
            )}

            {/* Date and Stats */}
            <div className="flex items-center justify-between ml-11">
              <div
                className={cn(
                  "flex items-center space-x-1 text-muted-foreground",
                  isCompactView ? "text-xs" : "text-sm",
                )}
              >
                <Calendar className="h-3 w-3" />
                <span>{formatDate(post.published_at || post.updated_at)}</span>
              </div>
              {!isCompactView && (
                <div className="flex items-center space-x-1 text-muted-foreground text-sm">
                  <Clock className="h-3 w-3" />
                  <span>{formatReadingTime(post.reading_time_ms)}</span>
                </div>
              )}
            </div>

            {/* Additional Stats */}
            {!isCompactView && (
              <div className="flex items-center justify-between text-sm text-muted-foreground ml-11">
                <div className="flex items-center space-x-3">
                  {post.view_count && (
                    <div className="flex items-center space-x-1">
                      <Eye className="h-3 w-3" />
                      <span>{post.view_count.toLocaleString()}</span>
                    </div>
                  )}
                  {post.upvote_count && (
                    <div className="flex items-center space-x-1">
                      <Heart className="h-3 w-3" />
                      <span>{post.upvote_count}</span>
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>
        </CardContent>
      </Link>
    </Card>
  );
}
