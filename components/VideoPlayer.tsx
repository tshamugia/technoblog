"use client";

import { Play } from "lucide-react";
import Image from "next/image";
import { useState } from "react";
import { cn } from "@/lib/utils";
import type { VideoPlayerProps } from "@/types";

export default function VideoPlayer({
  url,
  title,
  thumbnail,
  autoplay = false,
}: VideoPlayerProps) {
  const [isPlaying, setIsPlaying] = useState(autoplay);
  const [isLoading, setIsLoading] = useState(false);

  const handlePlay = () => {
    setIsLoading(true);
    setIsPlaying(true);
  };

  const handleVideoLoad = () => {
    setIsLoading(false);
  };

  // Detect video type and format
  const isYouTube = url.includes("youtube.com") || url.includes("youtu.be");
  const isVimeo = url.includes("vimeo.com");

  const getEmbedUrl = () => {
    if (isYouTube) {
      const videoId = extractYouTubeId(url);
      return `https://www.youtube.com/embed/${videoId}?autoplay=${
        autoplay ? 1 : 0
      }&rel=0`;
    }

    if (isVimeo) {
      const videoId = extractVimeoId(url);
      return `https://player.vimeo.com/video/${videoId}?autoplay=${
        autoplay ? 1 : 0
      }`;
    }

    return url; // Direct video URL
  };

  if (isYouTube || isVimeo) {
    return (
      <div className="my-6">
        <div className="relative aspect-video w-full overflow-hidden rounded-lg border border-border bg-muted">
          {!isPlaying ? (
            // Thumbnail with play button
            <div
              className="group relative flex h-full w-full cursor-pointer items-center justify-center"
              onClick={handlePlay}
            >
              {thumbnail && (
                <Image
                  src={thumbnail}
                  alt={title || "Video thumbnail"}
                  fill
                  className="object-cover"
                />
              )}
              <div className="absolute inset-0 bg-black/30 transition-opacity group-hover:bg-black/40" />
              <div className="relative flex h-16 w-16 items-center justify-center rounded-full bg-primary/90 transition-transform group-hover:scale-110">
                <Play
                  className="ml-1 h-6 w-6 text-primary-foreground"
                  fill="currentColor"
                />
              </div>
            </div>
          ) : (
            // Embedded video
            <iframe
              src={getEmbedUrl()}
              title={title || "Video player"}
              className="h-full w-full"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
              onLoad={handleVideoLoad}
            />
          )}

          {isLoading && (
            <div className="absolute inset-0 flex items-center justify-center bg-muted">
              <div className="h-8 w-8 animate-spin rounded-full border-2 border-primary border-t-transparent" />
            </div>
          )}
        </div>

        {title && (
          <p className="mt-2 text-sm text-muted-foreground text-center">
            {title}
          </p>
        )}
      </div>
    );
  }

  // Direct video file
  return (
    <div className="my-6">
      <div className="relative aspect-video w-full overflow-hidden rounded-lg border border-border">
        <video
          src={url}
          controls
          autoPlay={autoplay}
          className="h-full w-full object-cover"
          onLoadStart={handleVideoLoad}
        >
          Your browser does not support the video tag.
        </video>
      </div>

      {title && (
        <p className="mt-2 text-sm text-muted-foreground text-center">
          {title}
        </p>
      )}
    </div>
  );
}

// Helper functions to extract video IDs
function extractYouTubeId(url: string): string {
  const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|&v=)([^#&?]*).*/;
  const match = url.match(regExp);
  return match && match[2].length === 11 ? match[2] : "";
}

function extractVimeoId(url: string): string {
  const regExp =
    /vimeo\.com\/(?:channels\/(?:\w+\/)?|groups\/([^\/]*)\/videos\/|album\/(\d+)\/video\/|)(\d+)(?:$|\/|\?)/;
  const match = url.match(regExp);
  return match ? match[3] : "";
}
