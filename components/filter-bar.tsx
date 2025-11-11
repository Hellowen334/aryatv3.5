"use client"

import { Search } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import type { Category } from "@/lib/data"
import { cn } from "@/lib/utils"

interface FilterBarProps {
  categories: Category[]
  selectedCategory: string
  onCategoryChange: (category: string) => void
  searchQuery: string
  onSearchChange: (query: string) => void
  placeholder?: string
}

export function FilterBar({
  categories,
  selectedCategory,
  onCategoryChange,
  searchQuery,
  onSearchChange,
  placeholder = "Search...",
}: FilterBarProps) {
  return (
    <div className="space-y-4">
      {/* Search Bar */}
      <div className="relative max-w-md">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
        <Input
          type="text"
          placeholder={placeholder}
          value={searchQuery}
          onChange={(e) => onSearchChange(e.target.value)}
          className="pl-10 bg-secondary border-border"
        />
      </div>

      {/* Category Filters */}
      <div className="flex flex-wrap gap-2">
        {categories.map((category) => (
          <Button
            key={category.id}
            variant={selectedCategory === category.id ? "default" : "outline"}
            size="sm"
            onClick={() => onCategoryChange(category.id)}
            className={cn("capitalize", selectedCategory === category.id && "bg-primary text-primary-foreground")}
          >
            {category.name} ({category.count})
          </Button>
        ))}
      </div>
    </div>
  )
}
