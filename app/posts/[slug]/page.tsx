import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { mockAllPosts } from "@/lib/mock-data";
import type { Post } from "@/types";
import PostDetailsClient from "./components/PostDetailsClient";

interface PostPageProps {
  params: {
    slug: string;
  };
}

// In a real app, this would fetch from your database
function getPostBySlug(slug: string) {
  return mockAllPosts.find((post: Post) => post.slug === slug);
}

export async function generateStaticParams() {
  // In a real app, this would fetch all post slugs from your database
  return mockAllPosts.map((post: Post) => ({
    slug: post.slug,
  }));
}

export async function generateMetadata({
  params,
}: PostPageProps): Promise<Metadata> {
  const post = getPostBySlug(params.slug);

  if (!post) {
    return {
      title: "Post Not Found",
    };
  }

  return {
    title: post.title,
    description: post.snippet,
    openGraph: {
      title: post.title,
      description: post.snippet,
      images: post.cover_image_url ? [post.cover_image_url] : [],
      type: "article",
      publishedTime: post.published_at,
      authors: [post.author.display_name],
      tags: post.tags.map((tag) => tag.name),
    },
    twitter: {
      card: "summary_large_image",
      title: post.title,
      description: post.snippet,
      images: post.cover_image_url ? [post.cover_image_url] : [],
    },
  };
}

export default function PostPage({ params }: PostPageProps) {
  const post = getPostBySlug(params.slug);

  if (!post) {
    notFound();
  }

  return <PostDetailsClient slug={params.slug} />;
}
