"use client";

import { Filter, Search, SlidersHorizontal } from "lucide-react";
import { useMemo, useState } from "react";
import CategorySidebar from "@/components/CategorySidebar";
import PostCardAdvanced from "@/components/PostCardAdvanced";
import TagFilters from "@/components/TagFilters";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import ViewToggle from "@/components/ViewToggle";
import { mockPostsPageData } from "@/lib/mock-data";
import { cn } from "@/lib/utils";
import type { Post, PostsFilter, ViewMode } from "@/types";

interface PostsPageClientProps {
  initialData?: typeof mockPostsPageData;
}

export default function PostsPageClient({
  initialData = mockPostsPageData,
}: PostsPageClientProps) {
  const [viewMode, setViewMode] = useState<ViewMode>("grid");
  const [searchQuery, setSearchQuery] = useState("");
  const [filters, setFilters] = useState<PostsFilter>({});
  const [selectedTags, setSelectedTags] = useState<string[]>([]);

  // Filter posts based on current filters
  const filteredPosts = useMemo(() => {
    let filtered = initialData.posts;

    // Filter by search query
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(
        (post) =>
          post.title.toLowerCase().includes(query) ||
          post.snippet?.toLowerCase().includes(query) ||
          post.author.display_name.toLowerCase().includes(query)
      );
    }

    // Filter by category
    if (filters.category) {
      // Note: In a real app, posts would have category_id field
      // For now, we'll filter by tags that match category names
      filtered = filtered.filter((post) =>
        post.tags.some(
          (tag) =>
            tag.slug.includes(filters.category!) ||
            tag.name.toLowerCase().includes(filters.category!.toLowerCase())
        )
      );
    }

    // Filter by selected tags
    if (selectedTags.length > 0) {
      filtered = filtered.filter((post) =>
        selectedTags.some((selectedTagId) =>
          post.tags.some((tag) => tag.id === selectedTagId)
        )
      );
    }

    // Sort posts
    switch (filters.sortBy) {
      case "popular":
        return filtered.sort(
          (a, b) => (b.upvote_count || 0) - (a.upvote_count || 0)
        );
      case "oldest":
        return filtered.sort(
          (a, b) =>
            new Date(a.published_at || a.updated_at).getTime() -
            new Date(b.published_at || b.updated_at).getTime()
        );
      case "latest":
      default:
        return filtered.sort(
          (a, b) =>
            new Date(b.published_at || b.updated_at).getTime() -
            new Date(a.published_at || a.updated_at).getTime()
        );
    }
  }, [initialData.posts, searchQuery, filters, selectedTags]);

  const handleCategorySelect = (categoryId: string | undefined) => {
    setFilters((prev) => ({ ...prev, category: categoryId }));
  };

  const handleTagToggle = (tagId: string) => {
    setSelectedTags((prev) =>
      prev.includes(tagId)
        ? prev.filter((id) => id !== tagId)
        : [...prev, tagId]
    );
  };

  const handleClearAllTags = () => {
    setSelectedTags([]);
  };

  const handleSortChange = (sortBy: PostsFilter["sortBy"]) => {
    setFilters((prev) => ({ ...prev, sortBy }));
  };

  // Grid classes based on view mode
  const getGridClasses = () => {
    switch (viewMode) {
      case "list":
        return "space-y-4";
      case "compact":
        return "grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4";
      case "grid":
      default:
        return "grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6";
    }
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex flex-col lg:flex-row gap-8">
        {/* Desktop Sidebar */}
        <aside className="hidden lg:block w-80 space-y-6">
          <CategorySidebar
            categories={initialData.categories}
            selectedCategory={filters.category}
            onCategorySelect={handleCategorySelect}
          />
          <Separator />
          <TagFilters
            tags={initialData.popularTags}
            selectedTags={selectedTags}
            onTagToggle={handleTagToggle}
            onClearAll={handleClearAllTags}
          />
        </aside>

        {/* Main Content */}
        <main className="flex-1 space-y-6">
          {/* Header */}
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-3xl font-bold tracking-tight">All Posts</h1>
                <p className="text-muted-foreground">
                  Discover the latest in technology and development
                </p>
              </div>

              {/* Mobile Filter Toggle */}
              <Sheet>
                <SheetTrigger asChild>
                  <Button variant="outline" size="sm" className="lg:hidden">
                    <Filter className="h-4 w-4 mr-2" />
                    Filters
                  </Button>
                </SheetTrigger>
                <SheetContent side="left" className="w-80 p-6 space-y-6">
                  <CategorySidebar
                    categories={initialData.categories}
                    selectedCategory={filters.category}
                    onCategorySelect={handleCategorySelect}
                  />
                  <Separator />
                  <TagFilters
                    tags={initialData.popularTags}
                    selectedTags={selectedTags}
                    onTagToggle={handleTagToggle}
                    onClearAll={handleClearAllTags}
                  />
                </SheetContent>
              </Sheet>
            </div>

            {/* Search and Controls */}
            <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
              {/* Search */}
              <div className="relative flex-1 max-w-md">
                <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                <Input
                  placeholder="Search posts..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-9"
                />
              </div>

              {/* Sort and View Controls */}
              <div className="flex items-center gap-4">
                {/* Sort Dropdown */}
                <div className="flex items-center space-x-2">
                  <SlidersHorizontal className="h-4 w-4 text-muted-foreground" />
                  <select
                    value={filters.sortBy || "latest"}
                    onChange={(e) =>
                      handleSortChange(e.target.value as PostsFilter["sortBy"])
                    }
                    className="text-sm border border-border rounded-md px-2 py-1 bg-background"
                  >
                    <option value="latest">Latest</option>
                    <option value="popular">Popular</option>
                    <option value="oldest">Oldest</option>
                  </select>
                </div>

                {/* View Toggle */}
                <ViewToggle currentView={viewMode} onViewChange={setViewMode} />
              </div>
            </div>

            {/* Active Filters Display */}
            {(filters.category || selectedTags.length > 0 || searchQuery) && (
              <div className="flex flex-wrap items-center gap-2 text-sm">
                <span className="text-muted-foreground">Active filters:</span>
                {filters.category && (
                  <span className="px-2 py-1 bg-primary/10 text-primary rounded-md">
                    Category:{" "}
                    {
                      initialData.categories.find(
                        (c) => c.id === filters.category
                      )?.name
                    }
                  </span>
                )}
                {selectedTags.length > 0 && (
                  <span className="px-2 py-1 bg-primary/10 text-primary rounded-md">
                    {selectedTags.length} tag
                    {selectedTags.length > 1 ? "s" : ""} selected
                  </span>
                )}
                {searchQuery && (
                  <span className="px-2 py-1 bg-primary/10 text-primary rounded-md">
                    Search: "{searchQuery}"
                  </span>
                )}
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => {
                    setSearchQuery("");
                    setFilters({});
                    setSelectedTags([]);
                  }}
                  className="h-auto p-1 text-xs"
                >
                  Clear all
                </Button>
              </div>
            )}
          </div>

          {/* Results Count */}
          <div className="flex items-center justify-between">
            <p className="text-sm text-muted-foreground">
              {filteredPosts.length} post{filteredPosts.length !== 1 ? "s" : ""}{" "}
              found
            </p>
          </div>

          {/* Posts Grid */}
          {filteredPosts.length > 0 ? (
            <div className={cn(getGridClasses())}>
              {filteredPosts.map((post: Post) => (
                <PostCardAdvanced
                  key={post.id}
                  post={post}
                  viewMode={viewMode}
                />
              ))}
            </div>
          ) : (
            <div className="text-center py-12">
              <div className="space-y-3">
                <h3 className="text-lg font-medium">No posts found</h3>
                <p className="text-muted-foreground">
                  Try adjusting your filters or search query to find what you're
                  looking for.
                </p>
                <Button
                  variant="outline"
                  onClick={() => {
                    setSearchQuery("");
                    setFilters({});
                    setSelectedTags([]);
                  }}
                >
                  Clear all filters
                </Button>
              </div>
            </div>
          )}
        </main>
      </div>
    </div>
  );
}
