import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { use } from "react";
import {
  getPostBySlug,
  getRelatedPosts,
  incrementPostViews,
} from "@/services/posts";
import type { PostDetailsData } from "@/types";
import PostDetailsClient from "./components/PostDetailsClient";

interface PostPageProps {
  slug: string;
}

export async function generateStaticParams() {
  // In production, you might want to generate static params for SEO
  // For now, we'll use dynamic rendering
  return [];
}

export async function generateMetadata({
  params,
}: {
  params: Promise<PostPageProps>;
}): Promise<Metadata> {
  const { slug } = await params;
  const result = await getPostBySlug(slug);

  if (!result.ok || !result.data) {
    return {
      title: "Post Not Found",
      description: "The requested post could not be found.",
    };
  }

  const post = result.data;

  return {
    title: post.title,
    description: post.snippet || post.title,
    openGraph: {
      title: post.title,
      description: post.snippet || post.title,
      images: post.cover_image_url ? [post.cover_image_url] : [],
      type: "article",
      publishedTime: post.published_at || undefined,
      authors: [post.author.display_name],
      tags: post.tags.map((tag) => tag.name),
    },
    twitter: {
      card: "summary_large_image",
      title: post.title,
      description: post.snippet || post.title,
      images: post.cover_image_url ? [post.cover_image_url] : [],
    },
  };
}

export default async function PostPage({
  params,
}: {
  params: Promise<PostPageProps>;
}) {
  const { slug } = await params;

  // Fetch post data
  const postResult = await getPostBySlug(slug);

  if (!postResult.ok || !postResult.data) {
    notFound();
  }

  const post = postResult.data;

  // Fetch related posts
  const relatedResult = await getRelatedPosts(post.id, 4);
  const relatedPosts = relatedResult.ok ? relatedResult.data : [];

  // Increment post views (fire and forget)
  incrementPostViews(post.id).catch(console.error);

  // Prepare data for client component
  const initialData: PostDetailsData = {
    post,
    relatedPosts,
    comments: [], // TODO: Fetch comments when comment service is ready
    userVote: undefined, // TODO: Fetch user vote when auth is ready
  };

  return <PostDetailsClient initialData={initialData} />;
}
