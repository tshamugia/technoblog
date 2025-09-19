import { ArrowLeft, Calendar, Clock, Eye, User } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import CodeBlock from "@/app/posts/[slug]/components/CodeBlock";
import VideoPlayer from "@/app/posts/[slug]/components/VideoPlayer";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import type { Post } from "@/types";

interface ArticleProps {
  post: Post;
  className?: string;
}

function formatDate(dateString: string) {
  return new Date(dateString).toLocaleDateString("en-US", {
    month: "long",
    day: "numeric",
    year: "numeric",
  });
}

function formatReadingTime(ms?: number) {
  if (!ms) return "5 min read";
  const minutes = Math.ceil(ms / 60000);
  return `${minutes} min read`;
}

// Function to parse and render content with code blocks and videos
function renderContent(content: string) {
  // Split content by code blocks
  const parts = content.split(/(```[\s\S]*?```)/);

  return parts.map((part, index) => {
    // Check if it's a code block
    if (part.startsWith("```") && part.endsWith("```")) {
      const lines = part.slice(3, -3).split("\n");
      const language = lines[0] || "text";
      const code = lines.slice(1).join("\n");

      return (
        <CodeBlock
          key={index}
          code={code}
          language={language}
          showLineNumbers={language !== "bash" && language !== "shell"}
        />
      );
    }

    // Check for video tags
    if (part.includes("<video")) {
      const videoMatch = part.match(/<video[^>]*src="([^"]*)"[^>]*>/);
      if (videoMatch) {
        const videoUrl = videoMatch[1];
        return (
          <div key={index}>
            {part.split(/<video[^>]*>[\s\S]*?<\/video>/)[0] && (
              <div
                className="prose prose-gray dark:prose-invert max-w-none"
                dangerouslySetInnerHTML={{
                  __html: part.split(/<video[^>]*>[\s\S]*?<\/video>/)[0],
                }}
              />
            )}
            <VideoPlayer url={videoUrl} />
            {part.split(/<video[^>]*>[\s\S]*?<\/video>/)[1] && (
              <div
                className="prose prose-gray dark:prose-invert max-w-none"
                dangerouslySetInnerHTML={{
                  __html: part.split(/<video[^>]*>[\s\S]*?<\/video>/)[1],
                }}
              />
            )}
          </div>
        );
      }
    }

    // Regular content - convert markdown to basic HTML
    const htmlContent = part
      .replace(/^# (.*$)/gm, "<h1>$1</h1>")
      .replace(/^## (.*$)/gm, "<h2>$1</h2>")
      .replace(/^### (.*$)/gm, "<h3>$1</h3>")
      .replace(/\*\*(.*?)\*\*/g, "<strong>$1</strong>")
      .replace(/\*(.*?)\*/g, "<em>$1</em>")
      .replace(/`(.*?)`/g, "<code>$1</code>")
      .replace(
        /\[(.*?)\]\((.*?)\)/g,
        '<a href="$2" target="_blank" rel="noopener noreferrer">$1</a>',
      )
      .replace(/\n\n/g, "</p><p>")
      .replace(/^\s*[-\*\+] (.*)$/gm, "<li>$1</li>")
      .replace(/(<li>.*<\/li>)/g, "<ul>$1</ul>")
      .replace(/\n/g, "<br>");

    return (
      <div
        key={index}
        className="prose prose-gray dark:prose-invert max-w-none"
        dangerouslySetInnerHTML={{ __html: `<p>${htmlContent}</p>` }}
      />
    );
  });
}

export default function Article({ post, className }: ArticleProps) {
  return (
    <article className={className}>
      {/* Back to Blog Button */}
      <div className="mb-6">
        <Link href="/posts">
          <Button variant="ghost" className="pl-0">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Blog
          </Button>
        </Link>
      </div>

      {/* Cover Image */}
      {post.cover_image_url && (
        <div className="relative aspect-video w-full overflow-hidden rounded-lg mb-8">
          <Image
            src={post.cover_image_url}
            alt={post.title}
            fill
            className="object-cover"
            priority
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 80vw, 70vw"
          />
        </div>
      )}

      {/* Article Header */}
      <header className="mb-8 space-y-6">
        {/* Title */}
        <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold tracking-tight leading-tight">
          {post.title}
        </h1>

        {/* Snippet/Excerpt */}
        {post.snippet && (
          <p className="text-lg text-muted-foreground leading-relaxed">
            {post.snippet}
          </p>
        )}

        {/* Meta Information */}
        <div className="flex flex-col sm:flex-row sm:items-center gap-4">
          {/* Author */}
          <div className="flex items-center space-x-3">
            <Avatar className="h-10 w-10">
              <AvatarImage src={post.author.avatar_url} />
              <AvatarFallback>
                {post.author.display_name.charAt(0)}
              </AvatarFallback>
            </Avatar>
            <div>
              <p className="font-medium text-sm">{post.author.display_name}</p>
              <p className="text-xs text-muted-foreground">{post.author.bio}</p>
            </div>
          </div>

          <Separator orientation="vertical" className="hidden sm:block h-6" />

          {/* Meta Stats */}
          <div className="flex items-center space-x-4 text-sm text-muted-foreground">
            <div className="flex items-center space-x-1">
              <Calendar className="h-4 w-4" />
              <span>{formatDate(post.published_at || post.updated_at)}</span>
            </div>
            <div className="flex items-center space-x-1">
              <Clock className="h-4 w-4" />
              <span>{formatReadingTime(post.reading_time_ms)}</span>
            </div>
            {post.view_count && (
              <div className="flex items-center space-x-1">
                <Eye className="h-4 w-4" />
                <span>{post.view_count.toLocaleString()} views</span>
              </div>
            )}
          </div>
        </div>

        {/* Tags */}
        {post.tags.length > 0 && (
          <div className="flex flex-wrap gap-2">
            {post.tags.map((tag) => (
              <Badge key={tag.id} variant="secondary" className="text-xs">
                #{tag.name}
              </Badge>
            ))}
          </div>
        )}

        <Separator />
      </header>

      {/* Article Content */}
      <div className="space-y-6">
        {post.content_md ? (
          renderContent(post.content_md)
        ) : (
          <div className="prose prose-gray dark:prose-invert max-w-none">
            <p>Content not available.</p>
          </div>
        )}
      </div>
    </article>
  );
}
