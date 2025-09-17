"use client";

import { useState } from "react";
import Article from "@/components/Article";
import Comments from "@/components/Comments";
import LikeButton, { VoteButtons } from "@/components/LikeButton";
import RelatedPostsSidebar from "@/components/RelatedPostsSidebar";
import ShareButtons from "@/components/ShareButtons";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Separator } from "@/components/ui/separator";
import { mockPostDetailsData } from "@/lib/mock-data";
import type { PostDetailsData } from "@/types";

interface PostDetailsClientProps {
  slug: string;
  initialData?: PostDetailsData;
}

export default function PostDetailsClient({
  slug,
  initialData = mockPostDetailsData,
}: PostDetailsClientProps) {
  const [postData, setPostData] = useState(initialData);
  const [userVote, setUserVote] = useState<"up" | "down" | null>(null);

  const handleToggleLike = async (postId: string) => {
    // Simulate API call
    console.log("Toggle like for post:", postId);
    // In a real app, this would make an API call
  };

  const handleVote = async (postId: string, voteType: "up" | "down") => {
    // Simulate API call
    console.log("Vote for post:", postId, voteType);
    setUserVote(userVote === voteType ? null : voteType);
  };

  const handleAddComment = async (content: string, parentId?: string) => {
    // Simulate API call
    console.log(
      "Add comment:",
      content,
      parentId ? `reply to ${parentId}` : "new comment"
    );
    // In a real app, this would make an API call and update the comments
  };

  const currentUrl = typeof window !== "undefined" ? window.location.href : "";

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex flex-col lg:flex-row gap-8">
        {/* Main Content */}
        <main className="flex-1 max-w-4xl">
          <div className="space-y-8">
            {/* Article */}
            <Article post={postData.post} />

            <Separator />

            {/* Engagement Section */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 py-4">
              {/* Voting/Likes */}
              <div className="flex items-center space-x-4">
                <LikeButton
                  postId={postData.post.id}
                  isLiked={false} // In real app, get from user data
                  likeCount={postData.post.upvote_count || 0}
                  onToggleLike={handleToggleLike}
                />

                <VoteButtons
                  postId={postData.post.id}
                  upvotes={postData.post.upvote_count || 0}
                  downvotes={5} // Mock downvotes
                  userVote={userVote}
                  onVote={handleVote}
                />
              </div>

              {/* Share Buttons */}
              <ShareButtons
                url={currentUrl}
                title={postData.post.title}
                description={postData.post.snippet}
              />
            </div>

            <Separator />

            {/* Comments Section */}
            <Comments
              comments={postData.comments}
              onAddComment={handleAddComment}
            />
          </div>
        </main>

        {/* Sidebar */}
        <aside className="lg:w-80">
          <div className="space-y-6 mb-8">
            {/* Author Card */}
            <div className="p-6 bg-muted/50 rounded-lg">
              <h3 className="font-semibold mb-3">About the Author</h3>
              <div className="flex items-start space-x-3">
                <Avatar className="w-12 h-12">
                  <AvatarImage
                    src={postData.post.author.avatar_url}
                    alt={postData.post.author.display_name}
                  />
                  <AvatarFallback>
                    {postData.post.author.display_name.charAt(0)}
                  </AvatarFallback>
                </Avatar>
                <div>
                  <p className="font-medium">
                    {postData.post.author.display_name}
                  </p>
                  <p className="text-sm text-muted-foreground mt-1">
                    {postData.post.author.bio}
                  </p>
                </div>
              </div>
            </div>

            {/* Newsletter Signup */}
            <div className="p-6 bg-primary/5 border border-primary/20 rounded-lg">
              <h3 className="font-semibold mb-2">Stay Updated</h3>
              <p className="text-sm text-muted-foreground mb-4">
                Get the latest articles and tutorials delivered to your inbox.
              </p>
              <div className="space-y-2">
                <input
                  type="email"
                  placeholder="Enter your email"
                  className="w-full px-3 py-2 text-sm border border-border rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
                />
                <button className="w-full px-4 py-2 text-sm bg-primary text-primary-foreground rounded-md hover:bg-primary/90 transition-colors">
                  Subscribe
                </button>
              </div>
            </div>
          </div>

          <RelatedPostsSidebar posts={postData.relatedPosts} className="mb-8" />
        </aside>
      </div>
    </div>
  );
}
