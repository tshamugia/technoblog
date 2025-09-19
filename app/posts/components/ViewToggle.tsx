"use client";

import { Grid3x3, LayoutGrid, List } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import type { ViewMode } from "@/types";

interface ViewToggleProps {
  currentView: ViewMode;
  onViewChange: (view: ViewMode) => void;
  className?: string;
}

const viewOptions = [
  {
    value: "grid" as ViewMode,
    label: "Grid",
    icon: Grid3x3,
    description: "Standard grid layout",
  },
  {
    value: "list" as ViewMode,
    label: "List",
    icon: List,
    description: "Detailed list view",
  },
  {
    value: "compact" as ViewMode,
    label: "Compact",
    icon: LayoutGrid,
    description: "Compact grid layout",
  },
];

export default function ViewToggle({
  currentView,
  onViewChange,
  className,
}: ViewToggleProps) {
  return (
    <div className={cn("flex items-center space-x-1", className)}>
      <span className="text-sm font-medium text-muted-foreground mr-2">
        View:
      </span>
      <div className="flex rounded-md border border-border bg-background p-1">
        {viewOptions.map((option) => {
          const Icon = option.icon;
          const isActive = currentView === option.value;

          return (
            <Button
              key={option.value}
              variant={isActive ? "default" : "ghost"}
              size="sm"
              onClick={() => onViewChange(option.value)}
              className={cn(
                "h-8 px-3 text-xs font-medium transition-all",
                isActive
                  ? "bg-primary text-primary-foreground shadow-sm"
                  : "hover:bg-muted/50 text-muted-foreground hover:text-foreground",
              )}
              title={option.description}
            >
              <Icon className="h-4 w-4 mr-1.5" />
              <span className="hidden sm:inline">{option.label}</span>
            </Button>
          );
        })}
      </div>
    </div>
  );
}
