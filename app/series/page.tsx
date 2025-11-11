"use client"

import { useState } from "react"
import { Sidebar } from "@/components/sidebar"
import { ContentGrid } from "@/components/content-grid"
import { FilterBar } from "@/components/filter-bar"
import { series, categories } from "@/lib/data"

export default function SeriesPage() {
  const [selectedCategory, setSelectedCategory] = useState("all")
  const [searchQuery, setSearchQuery] = useState("")

  const filteredSeries = series.filter((show) => {
    const matchesCategory = selectedCategory === "all" || show.category === selectedCategory
    const matchesSearch = show.title.toLowerCase().includes(searchQuery.toLowerCase())
    return matchesCategory && matchesSearch
  })

  return (
    <div className="flex min-h-screen">
      <Sidebar />

      <main className="flex-1 ml-20 p-8">
        {/* Header */}
        <div className="mb-6">
          <h1 className="text-3xl font-bold text-foreground">TV Series</h1>
          <p className="text-muted-foreground">Discover and watch your favorite TV series</p>
        </div>

        {/* Filter Bar */}
        <FilterBar
          categories={categories}
          selectedCategory={selectedCategory}
          onCategoryChange={setSelectedCategory}
          searchQuery={searchQuery}
          onSearchChange={setSearchQuery}
          placeholder="Search series..."
        />

        {/* Series Grid */}
        <div className="mt-6">
          {filteredSeries.length > 0 ? (
            <ContentGrid items={filteredSeries} />
          ) : (
            <div className="flex flex-col items-center justify-center py-20">
              <p className="text-2xl font-semibold text-muted-foreground">No series found</p>
              <p className="text-muted-foreground mt-2">Try adjusting your filters or search query</p>
            </div>
          )}
        </div>
      </main>
    </div>
  )
}
