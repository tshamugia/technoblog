"use client";

import {
  Brain,
  Cloud,
  Code,
  Cpu,
  Database,
  Globe,
  Layout,
  Monitor,
  Server,
  Smartphone,
  Tag,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import { cn } from "@/lib/utils";
import type { Category } from "@/types";

interface CategorySidebarProps {
  categories: Category[];
  selectedCategory?: string;
  onCategorySelect: (categoryId: string | undefined) => void;
  className?: string;
}

const categoryIcons = {
  Layout,
  Server,
  Cloud,
  Smartphone,
  Brain,
  Code,
  Database,
  Globe,
  Cpu,
  Monitor,
} as const;

export default function CategorySidebar({
  categories,
  selectedCategory,
  onCategorySelect,
  className,
}: CategorySidebarProps) {
  const handleCategoryClick = (categoryId: string) => {
    if (selectedCategory === categoryId) {
      onCategorySelect(undefined);
    } else {
      onCategorySelect(categoryId);
    }
  };

  return (
    <div className={cn("w-full", className)}>
      <div className="space-y-4">
        {/* Header */}
        <div className="flex items-center space-x-2">
          <Tag className="h-5 w-5 text-primary" />
          <h2 className="text-lg font-semibold">Categories</h2>
        </div>

        {/* All Posts Option */}
        <Button
          variant={!selectedCategory ? "default" : "ghost"}
          onClick={() => onCategorySelect(undefined)}
          className={cn(
            "w-full justify-start text-left h-auto p-3",
            !selectedCategory && "bg-primary text-primary-foreground",
          )}
        >
          <div className="flex items-start space-x-3 w-full">
            <Layout className="h-4 w-4 mt-0.5 flex-shrink-0" />
            <div className="flex-1 min-w-0">
              <div className="flex items-center justify-between">
                <span className="font-medium text-sm">All Posts</span>
                <Badge
                  variant={!selectedCategory ? "outline" : "secondary"}
                  className={cn(
                    "text-xs ml-2 flex-shrink-0",
                    !selectedCategory &&
                      "border-primary-foreground/20 text-primary-foreground",
                  )}
                >
                  {categories.reduce((total, cat) => total + cat.post_count, 0)}
                </Badge>
              </div>
              <p className="text-xs mt-1 leading-relaxed opacity-80">
                <span className="text-muted-foreground">
                  Browse all our articles across every topic
                </span>
              </p>
            </div>
          </div>
        </Button>

        <Separator />

        {/* Categories List */}
        <ScrollArea className="h-[450px]">
          <div className="space-y-2">
            {categories.map((category) => {
              const IconComponent =
                categoryIcons[category.icon as keyof typeof categoryIcons] ||
                Tag;
              const isSelected = selectedCategory === category.id;

              return (
                <Button
                  key={category.id}
                  variant={isSelected ? "default" : "ghost"}
                  onClick={() => handleCategoryClick(category.id)}
                  className={cn(
                    "w-full justify-start text-left h-auto p-3",
                    isSelected && "bg-primary text-primary-foreground",
                  )}
                >
                  <div className="flex items-start space-x-3 w-full">
                    <IconComponent
                      className="h-4 w-4 mt-0.5 flex-shrink-0"
                      style={{
                        color: isSelected ? "currentColor" : category.color,
                      }}
                    />
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between">
                        <span className="font-medium text-sm">
                          {category.name}
                        </span>
                        <Badge
                          variant={isSelected ? "outline" : "secondary"}
                          className={cn(
                            "text-xs ml-2 flex-shrink-0",
                            isSelected &&
                              "border-primary-foreground/20 text-primary-foreground",
                          )}
                        >
                          {category.post_count}
                        </Badge>
                      </div>
                      {category.description && (
                        <p className="text-xs mt-1 leading-relaxed opacity-80">
                          <span className="text-muted-foreground">
                            {category.description}
                          </span>
                        </p>
                      )}
                    </div>
                  </div>
                </Button>
              );
            })}
          </div>
        </ScrollArea>
      </div>
    </div>
  );
}
