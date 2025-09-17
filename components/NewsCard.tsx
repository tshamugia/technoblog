import { ArrowRight, Calendar, Clock } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import type { Post } from "@/types";

function formatReadingTime(timeMs?: number): string {
  if (!timeMs) return "";
  const minutes = Math.ceil(timeMs / (1000 * 60));
  return `${minutes} min read`;
}

function formatDate(dateString: string): string {
  const date = new Date(dateString);
  return date.toLocaleDateString("en-US", {
    month: "long",
    day: "numeric",
    year: "numeric",
  });
}

interface NewsCardProps {
  post: Post;
  className?: string;
}

export function NewsCard({ post, className }: NewsCardProps) {
  return (
    <div
      className={cn(
        "relative h-screen w-full overflow-hidden bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 dark:from-slate-900 dark:via-slate-800 dark:to-slate-900",
        className
      )}
    >
      {/* Background Image */}
      {post.cover_image_url && (
        <div className="absolute inset-0">
          <Image
            src={post.cover_image_url}
            alt={post.title}
            fill
            className="object-cover opacity-40"
            priority
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
        </div>
      )}

      {/* Content Container */}
      <div className="relative z-10 h-full flex items-center">
        <div className="container mx-auto px-4 py-20">
          <div className="max-w-4xl mx-auto text-center text-white">
            {/* Category Badge */}
            {post.tags.length > 0 && (
              <div className="mb-6">
                <Badge
                  variant="secondary"
                  className="bg-primary/20 text-primary-foreground border-primary/30 text-sm px-4 py-2"
                >
                  {post.tags[0].name}
                </Badge>
              </div>
            )}

            {/* Title */}
            <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold leading-tight mb-6 tracking-tight">
              {post.title}
            </h1>

            {/* Snippet */}
            {post.snippet && (
              <p className="text-xl md:text-2xl text-gray-200 mb-8 max-w-3xl mx-auto leading-relaxed">
                {post.snippet}
              </p>
            )}

            {/* Meta Information */}
            <div className="flex flex-wrap items-center justify-center gap-6 mb-8 text-gray-300 dark:text-gray-300">
              {/* Author */}
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 rounded-full overflow-hidden">
                  {post.author.avatar_url ? (
                    <Image
                      src={post.author.avatar_url}
                      alt={post.author.display_name}
                      width={40}
                      height={40}
                      className="object-cover"
                    />
                  ) : (
                    <div className="w-full h-full bg-primary flex items-center justify-center text-primary-foreground font-semibold">
                      {post.author.display_name.charAt(0).toUpperCase()}
                    </div>
                  )}
                </div>
                <span className="font-medium">{post.author.display_name}</span>
              </div>

              {/* Date */}
              <div className="flex items-center space-x-2">
                <Calendar className="h-4 w-4" />
                <time dateTime={post.published_at || post.updated_at}>
                  {formatDate(post.published_at || post.updated_at)}
                </time>
              </div>

              {/* Reading Time */}
              {post.reading_time_ms && (
                <div className="flex items-center space-x-2">
                  <Clock className="h-4 w-4" />
                  <span>{formatReadingTime(post.reading_time_ms)}</span>
                </div>
              )}
            </div>

            {/* Call to Action */}
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <Link href={`/posts/${post.slug}`}>
                <Button
                  size="lg"
                  className="bg-primary hover:bg-primary/90 text-primary-foreground px-8 py-4 text-lg font-semibold"
                >
                  Read Full Article
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Button>
              </Link>

              <Link href={`/authors/${post.author.id}`}>
                <Button
                  variant="outline"
                  size="lg"
                  className="border-white/30 text-white hover:bg-white/10 dark:border-white/30 dark:text-white dark:hover:bg-white/10 px-8 py-4 text-lg"
                >
                  View Author
                </Button>
              </Link>
            </div>

            {/* Additional Tags */}
            {post.tags.length > 1 && (
              <div className="flex flex-wrap justify-center gap-2 mt-8">
                {post.tags.slice(1, 4).map((tag) => (
                  <Link key={tag.id} href={`/tags/${tag.slug}`}>
                    <Badge
                      variant="outline"
                      className="border-white/30 text-white hover:bg-white/10 dark:border-white/30 dark:text-white dark:hover:bg-white/10 transition-colors"
                    >
                      #{tag.name}
                    </Badge>
                  </Link>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Scroll Indicator */}
      <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 text-white/60 dark:text-white/60">
        <div className="flex flex-col items-center space-y-2">
          <div className="w-0.5 h-16 bg-white/30 dark:bg-white/30 rounded-full">
            <div className="w-full h-4 bg-white/60 dark:bg-white/60 rounded-full animate-pulse" />
          </div>
          <span className="text-xs uppercase tracking-wider">Scroll</span>
        </div>
      </div>
    </div>
  );
}
