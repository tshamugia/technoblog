"use client";

import { MessageCircle, Reply, Send } from "lucide-react";
import { useState } from "react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { cn } from "@/lib/utils";
import type { Comment } from "@/types";

interface CommentsProps {
  comments: Comment[];
  onAddComment: (content: string, parentId?: string) => void;
  className?: string;
}

interface CommentItemProps {
  comment: Comment;
  onReply: (content: string, parentId: string) => void;
  level?: number;
}

function formatTimeAgo(dateString: string): string {
  const date = new Date(dateString);
  const now = new Date();
  const diffInSeconds = Math.floor((now.getTime() - date.getTime()) / 1000);

  if (diffInSeconds < 60) return "just now";
  if (diffInSeconds < 3600) return `${Math.floor(diffInSeconds / 60)}m ago`;
  if (diffInSeconds < 86400) return `${Math.floor(diffInSeconds / 3600)}h ago`;
  if (diffInSeconds < 2592000)
    return `${Math.floor(diffInSeconds / 86400)}d ago`;

  return date.toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: date.getFullYear() !== now.getFullYear() ? "numeric" : undefined,
  });
}

function CommentItem({ comment, onReply, level = 0 }: CommentItemProps) {
  const [showReplyForm, setShowReplyForm] = useState(false);
  const [replyContent, setReplyContent] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleReply = async () => {
    if (!replyContent.trim()) return;

    setIsSubmitting(true);
    try {
      await onReply(replyContent, comment.id);
      setReplyContent("");
      setShowReplyForm(false);
    } finally {
      setIsSubmitting(false);
    }
  };

  const maxNestingLevel = 3; // Limit nesting depth
  const shouldNest = level < maxNestingLevel;

  return (
    <div
      className={cn(
        "space-y-4",
        level > 0 && "ml-6 border-l border-border pl-4"
      )}
    >
      {/* Comment */}
      <div className="space-y-3">
        {/* Header */}
        <div className="flex items-start space-x-3">
          <Avatar className="h-8 w-8 flex-shrink-0">
            <AvatarImage src={comment.author.avatar_url} />
            <AvatarFallback className="text-xs">
              {comment.author.display_name.charAt(0)}
            </AvatarFallback>
          </Avatar>

          <div className="flex-1 min-w-0 space-y-2">
            <div className="flex items-center space-x-2">
              <span className="font-medium text-sm">
                {comment.author.display_name}
              </span>
              <span className="text-xs text-muted-foreground">
                {formatTimeAgo(comment.created_at)}
              </span>
              {comment.author.role === "author" && (
                <span className="text-xs bg-primary/10 text-primary px-2 py-0.5 rounded-full">
                  Author
                </span>
              )}
            </div>

            {/* Content */}
            <div className="text-sm text-foreground whitespace-pre-wrap">
              {comment.body}
            </div>

            {/* Actions */}
            <div className="flex items-center space-x-2">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setShowReplyForm(!showReplyForm)}
                className="h-auto p-1 text-xs text-muted-foreground hover:text-foreground"
              >
                <Reply className="h-3 w-3 mr-1" />
                Reply
              </Button>
            </div>
          </div>
        </div>

        {/* Reply Form */}
        {showReplyForm && (
          <div className="ml-11 space-y-3">
            <Textarea
              placeholder="Write a reply..."
              value={replyContent}
              onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) =>
                setReplyContent(e.target.value)
              }
              className="min-h-[80px] text-sm"
            />
            <div className="flex items-center space-x-2">
              <Button
                size="sm"
                onClick={handleReply}
                disabled={!replyContent.trim() || isSubmitting}
              >
                <Send className="h-3 w-3 mr-1" />
                {isSubmitting ? "Posting..." : "Reply"}
              </Button>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => {
                  setShowReplyForm(false);
                  setReplyContent("");
                }}
              >
                Cancel
              </Button>
            </div>
          </div>
        )}
      </div>

      {/* Nested Replies */}
      {comment.replies && comment.replies.length > 0 && shouldNest && (
        <div className="space-y-4">
          {comment.replies.map((reply) => (
            <CommentItem
              key={reply.id}
              comment={reply}
              onReply={onReply}
              level={level + 1}
            />
          ))}
        </div>
      )}

      {/* Show replies link for deeply nested comments */}
      {comment.replies && comment.replies.length > 0 && !shouldNest && (
        <Button
          variant="ghost"
          size="sm"
          className="text-xs text-muted-foreground"
        >
          View {comment.replies.length} more{" "}
          {comment.replies.length === 1 ? "reply" : "replies"}
        </Button>
      )}
    </div>
  );
}

export default function Comments({
  comments,
  onAddComment,
  className,
}: CommentsProps) {
  const [newComment, setNewComment] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleAddComment = async () => {
    if (!newComment.trim()) return;

    setIsSubmitting(true);
    try {
      await onAddComment(newComment);
      setNewComment("");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleReply = async (content: string, parentId: string) => {
    await onAddComment(content, parentId);
  };

  return (
    <Card className={className}>
      <CardHeader>
        <CardTitle className="flex items-center space-x-2">
          <MessageCircle className="h-5 w-5" />
          <span>Comments ({comments.length})</span>
        </CardTitle>
      </CardHeader>

      <CardContent className="space-y-6">
        {/* New Comment Form */}
        <div className="space-y-3">
          <Textarea
            placeholder="Share your thoughts..."
            value={newComment}
            onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) =>
              setNewComment(e.target.value)
            }
            className="min-h-[100px]"
          />
          <div className="flex items-center justify-between">
            <p className="text-xs text-muted-foreground">
              Be respectful and constructive in your comments.
            </p>
            <Button
              onClick={handleAddComment}
              disabled={!newComment.trim() || isSubmitting}
            >
              <Send className="h-4 w-4 mr-2" />
              {isSubmitting ? "Posting..." : "Comment"}
            </Button>
          </div>
        </div>

        {/* Comments List */}
        {comments.length > 0 ? (
          <div className="space-y-6">
            {comments.map((comment) => (
              <CommentItem
                key={comment.id}
                comment={comment}
                onReply={handleReply}
              />
            ))}
          </div>
        ) : (
          <div className="text-center py-8 text-muted-foreground">
            <MessageCircle className="h-12 w-12 mx-auto mb-3 opacity-50" />
            <p>No comments yet. Be the first to share your thoughts!</p>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
