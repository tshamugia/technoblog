"use client";

import { Heart, ThumbsUp } from "lucide-react";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import type { LikeButtonProps } from "@/types";

export default function LikeButton({
  postId,
  isLiked: initialIsLiked,
  likeCount: initialLikeCount,
  onToggleLike,
}: LikeButtonProps) {
  const [isLiked, setIsLiked] = useState(initialIsLiked);
  const [likeCount, setLikeCount] = useState(initialLikeCount);
  const [isAnimating, setIsAnimating] = useState(false);

  const handleToggleLike = async () => {
    // Optimistic update
    const newIsLiked = !isLiked;
    const newLikeCount = newIsLiked ? likeCount + 1 : likeCount - 1;

    setIsLiked(newIsLiked);
    setLikeCount(newLikeCount);
    setIsAnimating(true);

    // Reset animation
    setTimeout(() => setIsAnimating(false), 300);

    // Call the parent handler
    onToggleLike(postId);
  };

  return (
    <div className="flex items-center space-x-2">
      <Button
        variant={isLiked ? "default" : "outline"}
        size="sm"
        onClick={handleToggleLike}
        className={cn(
          "h-9 px-3 transition-all duration-200",
          isLiked && "bg-red-500 hover:bg-red-600 text-white",
          isAnimating && "scale-110",
        )}
      >
        <Heart
          className={cn(
            "h-4 w-4 mr-2 transition-all duration-200",
            isLiked && "fill-current",
            isAnimating && "animate-pulse",
          )}
        />
        <span className="font-medium">{likeCount}</span>
      </Button>
    </div>
  );
}

// Alternative upvote/downvote component
interface VoteButtonsProps {
  postId: string;
  upvotes: number;
  downvotes?: number;
  userVote?: "up" | "down" | null;
  onVote: (postId: string, voteType: "up" | "down") => void;
}

export function VoteButtons({
  postId,
  upvotes: initialUpvotes,
  downvotes: initialDownvotes = 0,
  userVote: initialUserVote = null,
  onVote,
}: VoteButtonsProps) {
  const [upvotes, setUpvotes] = useState(initialUpvotes);
  const [downvotes, setDownvotes] = useState(initialDownvotes);
  const [userVote, setUserVote] = useState(initialUserVote);

  const handleVote = (voteType: "up" | "down") => {
    let newUpvotes = upvotes;
    let newDownvotes = downvotes;
    let newUserVote = userVote;

    // Handle vote logic
    if (userVote === voteType) {
      // Remove vote
      if (voteType === "up") {
        newUpvotes--;
      } else {
        newDownvotes--;
      }
      newUserVote = null;
    } else {
      // Change or add vote
      if (userVote === "up" && voteType === "down") {
        newUpvotes--;
        newDownvotes++;
      } else if (userVote === "down" && voteType === "up") {
        newDownvotes--;
        newUpvotes++;
      } else if (voteType === "up") {
        newUpvotes++;
      } else {
        newDownvotes++;
      }
      newUserVote = voteType;
    }

    setUpvotes(newUpvotes);
    setDownvotes(newDownvotes);
    setUserVote(newUserVote);
    onVote(postId, voteType);
  };

  const score = upvotes - downvotes;

  return (
    <div className="flex flex-col items-center space-y-1 bg-muted/50 rounded-lg p-2">
      <Button
        variant="ghost"
        size="sm"
        onClick={() => handleVote("up")}
        className={cn(
          "h-8 w-8 p-0 hover:bg-green-100 dark:hover:bg-green-900/20",
          userVote === "up" && "bg-green-500 text-white hover:bg-green-600",
        )}
      >
        <ThumbsUp className="h-4 w-4" />
      </Button>

      <span
        className={cn(
          "text-sm font-semibold tabular-nums",
          score > 0 && "text-green-600 dark:text-green-400",
          score < 0 && "text-red-600 dark:text-red-400",
        )}
      >
        {score > 0 ? `+${score}` : score}
      </span>

      <Button
        variant="ghost"
        size="sm"
        onClick={() => handleVote("down")}
        className={cn(
          "h-8 w-8 p-0 hover:bg-red-100 dark:hover:bg-red-900/20 rotate-180",
          userVote === "down" && "bg-red-500 text-white hover:bg-red-600",
        )}
      >
        <ThumbsUp className="h-4 w-4" />
      </Button>
    </div>
  );
}
