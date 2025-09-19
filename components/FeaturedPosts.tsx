"use client";

import useEmblaCarousel from "embla-carousel-react";
import { ChevronLeft, ChevronRight, Pause, Play } from "lucide-react";
import { useCallback, useEffect, useState } from "react";
import { Button } from "@/components/ui";
import type { FeaturedPost } from "@/types";
import { NewsCard } from "./NewsCard";

interface FeaturedNewsProps {
  posts: FeaturedPost[];
  className?: string;
}

export function FeaturedPosts({ posts, className }: FeaturedNewsProps) {
  const [emblaRef, emblaApi] = useEmblaCarousel({
    loop: true,
    align: "center",
    slidesToScroll: 1,
    // Always show one slide fullscreen
  });

  const [selectedIndex, setSelectedIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(true);

  const scrollPrev = useCallback(() => {
    if (emblaApi) emblaApi.scrollPrev();
  }, [emblaApi]);

  const scrollNext = useCallback(() => {
    if (emblaApi) emblaApi.scrollNext();
  }, [emblaApi]);

  const onSelect = useCallback((emblaApi: any) => {
    setSelectedIndex(emblaApi.selectedScrollSnap());
  }, []);

  const toggleAutoplay = useCallback(() => {
    setIsPlaying((prev) => !prev);
  }, []);

  // Auto-play functionality
  useEffect(() => {
    if (!emblaApi || !isPlaying) return;

    const autoplayInterval = setInterval(() => {
      if (emblaApi.canScrollNext()) {
        emblaApi.scrollNext();
      } else {
        emblaApi.scrollTo(0);
      }
    }, 7000); // Change slide every 7 seconds for news

    return () => clearInterval(autoplayInterval);
  }, [emblaApi, isPlaying]);

  useEffect(() => {
    if (!emblaApi) return;

    onSelect(emblaApi);
    emblaApi.on("reInit", onSelect);
    emblaApi.on("select", onSelect);
  }, [emblaApi, onSelect]);

  if (!posts.length) return null;

  return (
    <section className={className}>
      {/* Fullscreen Carousel Container */}
      <div
        className="relative h-screen w-full overflow-hidden embla"
        ref={emblaRef}
        onMouseEnter={() => setIsPlaying(false)}
        onMouseLeave={() => setIsPlaying(true)}
      >
        <div className="flex h-full embla__container">
          {posts.map((post) => (
            <div key={post.id} className="flex-none w-full h-full embla__slide">
              <NewsCard post={post} />
            </div>
          ))}
        </div>

        {/* Navigation Overlay */}
        <div className="absolute top-6 right-6 z-20 flex items-center space-x-2">
          {/* Auto-play Toggle */}
          <Button
            variant="secondary"
            size="icon"
            onClick={toggleAutoplay}
            className="bg-black/50 hover:bg-black/70 text-white border-white/20 dark:bg-black/50 dark:hover:bg-black/70 dark:text-white dark:border-white/20"
            aria-label={isPlaying ? "Pause carousel" : "Play carousel"}
          >
            {isPlaying ? (
              <Pause className="h-4 w-4" />
            ) : (
              <Play className="h-4 w-4" />
            )}
          </Button>

          {/* Navigation Buttons */}
          <Button
            variant="secondary"
            size="icon"
            onClick={scrollPrev}
            className="bg-black/50 hover:bg-black/70 text-white border-white/20 dark:bg-black/50 dark:hover:bg-black/70 dark:text-white dark:border-white/20"
            aria-label="Previous news"
          >
            <ChevronLeft className="h-4 w-4" />
          </Button>
          <Button
            variant="secondary"
            size="icon"
            onClick={scrollNext}
            className="bg-black/50 hover:bg-black/70 text-white border-white/20 dark:bg-black/50 dark:hover:bg-black/70 dark:text-white dark:border-white/20"
            aria-label="Next news"
          >
            <ChevronRight className="h-4 w-4" />
          </Button>
        </div>

        {/* Progress Indicators */}
        <div className="absolute bottom-6 left-1/2 transform -translate-x-1/2 z-20">
          <div className="flex items-center space-x-3">
            {posts.map((_, index) => (
              <Button
                type="button"
                key={index}
                className={`relative w-12 h-1 rounded-full transition-all duration-300 ${
                  index === selectedIndex
                    ? "bg-white dark:bg-white"
                    : "bg-white/30 dark:bg-white/30"
                }`}
                onClick={() => emblaApi?.scrollTo(index)}
                aria-label={`Go to news ${index + 1}`}
              >
                {index === selectedIndex && isPlaying && (
                  <div className="absolute inset-0 bg-primary dark:bg-primary rounded-full animate-pulse" />
                )}
              </Button>
            ))}
          </div>
        </div>

        {/* News Count */}
        <div className="absolute top-6 left-6 z-20 text-white/80 dark:text-white/80 text-sm font-medium">
          {selectedIndex + 1} / {posts.length}
        </div>
      </div>
    </section>
  );
}
