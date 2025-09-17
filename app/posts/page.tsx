import type { Metadata } from "next";
import { mockPostsPageData } from "@/lib/mock-data";
import PostsPageClient from "./components/PostsPageClient";

export const metadata: Metadata = {
  title: "All Posts | TechnoBlog",
  description:
    "Browse all our technology and development articles. Filter by categories, tags, and search for specific topics.",
  keywords: [
    "technology",
    "development",
    "programming",
    "tutorials",
    "articles",
  ],
};

export default function PostsPage() {
  return <PostsPageClient initialData={mockPostsPageData} />;
}
