"use client";

import { Check, Copy, Share2 } from "lucide-react";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import type { ShareButtonsProps } from "@/types";

export default function ShareButtons({
  url,
  title,
  description,
}: ShareButtonsProps) {
  const [copied, setCopied] = useState(false);
  const encodedUrl = encodeURIComponent(url);
  const encodedTitle = encodeURIComponent(title);
  const encodedDescription = encodeURIComponent(description || "");

  const shareLinks = {
    twitter: `https://twitter.com/intent/tweet?url=${encodedUrl}&text=${encodedTitle}`,
    linkedin: `https://www.linkedin.com/sharing/share-offsite/?url=${encodedUrl}`,
    facebook: `https://www.facebook.com/sharer/sharer.php?u=${encodedUrl}`,
    reddit: `https://www.reddit.com/submit?url=${encodedUrl}&title=${encodedTitle}`,
    whatsapp: `https://wa.me/?text=${encodedTitle}%20${encodedUrl}`,
  };

  const copyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(url);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error("Failed to copy URL: ", err);
    }
  };

  const handleShare = (platform: keyof typeof shareLinks) => {
    window.open(shareLinks[platform], "_blank", "noopener,noreferrer");
  };

  return (
    <div className="flex items-center space-x-2">
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="outline" size="sm">
            <Share2 className="h-4 w-4 mr-2" />
            Share
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" className="w-48">
          <DropdownMenuItem onClick={() => handleShare("twitter")}>
            <div className="flex items-center space-x-2">
              <div className="h-4 w-4 rounded bg-blue-400" />
              <span>Twitter</span>
            </div>
          </DropdownMenuItem>

          <DropdownMenuItem onClick={() => handleShare("linkedin")}>
            <div className="flex items-center space-x-2">
              <div className="h-4 w-4 rounded bg-blue-600" />
              <span>LinkedIn</span>
            </div>
          </DropdownMenuItem>

          <DropdownMenuItem onClick={() => handleShare("facebook")}>
            <div className="flex items-center space-x-2">
              <div className="h-4 w-4 rounded bg-blue-500" />
              <span>Facebook</span>
            </div>
          </DropdownMenuItem>

          <DropdownMenuItem onClick={() => handleShare("reddit")}>
            <div className="flex items-center space-x-2">
              <div className="h-4 w-4 rounded bg-orange-500" />
              <span>Reddit</span>
            </div>
          </DropdownMenuItem>

          <DropdownMenuItem onClick={() => handleShare("whatsapp")}>
            <div className="flex items-center space-x-2">
              <div className="h-4 w-4 rounded bg-green-500" />
              <span>WhatsApp</span>
            </div>
          </DropdownMenuItem>

          <DropdownMenuItem onClick={copyToClipboard}>
            <div className="flex items-center space-x-2">
              {copied ? (
                <Check className="h-4 w-4 text-green-500" />
              ) : (
                <Copy className="h-4 w-4" />
              )}
              <span>{copied ? "Copied!" : "Copy Link"}</span>
            </div>
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
}
