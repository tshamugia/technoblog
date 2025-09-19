"use client";

import { Search, X } from "lucide-react";
import { useState } from "react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";
import type { Tag } from "@/types";

interface TagFiltersProps {
  tags: Tag[];
  selectedTags: string[];
  onTagToggle: (tagId: string) => void;
  onClearAll: () => void;
  className?: string;
}

export default function TagFilters({
  tags,
  selectedTags,
  onTagToggle,
  onClearAll,
  className,
}: TagFiltersProps) {
  const [searchQuery, setSearchQuery] = useState("");

  const filteredTags = tags.filter((tag) =>
    tag.name.toLowerCase().includes(searchQuery.toLowerCase()),
  );

  const handleTagClick = (tagId: string) => {
    onTagToggle(tagId);
  };

  const handleClearSearch = () => {
    setSearchQuery("");
  };

  return (
    <div className={cn("space-y-4", className)}>
      {/* Header with Clear All */}
      <div className="flex items-center justify-between">
        <h3 className="text-sm font-medium text-foreground">Filter by Tags</h3>
        {selectedTags.length > 0 && (
          <Button
            variant="ghost"
            size="sm"
            onClick={onClearAll}
            className="h-auto p-1 text-xs text-muted-foreground hover:text-foreground"
          >
            Clear all ({selectedTags.length})
          </Button>
        )}
      </div>

      {/* Search Tags */}
      <div className="relative">
        <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
        <Input
          placeholder="Search tags..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="pl-9 pr-9 h-9"
        />
        {searchQuery && (
          <Button
            variant="ghost"
            size="sm"
            onClick={handleClearSearch}
            className="absolute right-1 top-1/2 h-7 w-7 -translate-y-1/2 p-0"
          >
            <X className="h-3 w-3" />
          </Button>
        )}
      </div>

      {/* Selected Tags Display */}
      {selectedTags.length > 0 && (
        <div className="space-y-2">
          <p className="text-xs text-muted-foreground">Selected:</p>
          <div className="flex flex-wrap gap-1">
            {selectedTags.map((tagId) => {
              const tag = tags.find((t) => t.id === tagId);
              if (!tag) return null;

              return (
                <Badge
                  key={tagId}
                  variant="default"
                  className="cursor-pointer text-xs px-2 py-1 hover:bg-primary/80"
                  onClick={() => handleTagClick(tagId)}
                >
                  {tag.name}
                  <X className="ml-1 h-3 w-3" />
                </Badge>
              );
            })}
          </div>
        </div>
      )}

      {/* Available Tags */}
      <div className="space-y-2">
        <p className="text-xs text-muted-foreground">
          Available Tags {searchQuery && `(${filteredTags.length})`}
        </p>
        <div className="flex flex-wrap gap-1 max-h-40 overflow-y-auto">
          {filteredTags.map((tag) => {
            const isSelected = selectedTags.includes(tag.id);

            return (
              <Badge
                key={tag.id}
                variant={isSelected ? "default" : "secondary"}
                className={cn(
                  "cursor-pointer text-xs px-2 py-1 transition-colors",
                  isSelected
                    ? "bg-primary text-primary-foreground hover:bg-primary/80"
                    : "hover:bg-secondary/80",
                )}
                onClick={() => handleTagClick(tag.id)}
              >
                {tag.name}
                {tag.post_count && (
                  <span className="ml-1 text-xs opacity-70">
                    {tag.post_count}
                  </span>
                )}
              </Badge>
            );
          })}
        </div>

        {filteredTags.length === 0 && searchQuery && (
          <p className="text-xs text-muted-foreground py-4 text-center">
            No tags found matching "{searchQuery}"
          </p>
        )}
      </div>
    </div>
  );
}
