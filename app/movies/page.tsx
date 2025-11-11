"use client"

import { useState } from "react"
import { Sidebar } from "@/components/sidebar"
import { ContentGrid } from "@/components/content-grid"
import { FilterBar } from "@/components/filter-bar"
import { movies, categories } from "@/lib/data"

export default function MoviesPage() {
  const [selectedCategory, setSelectedCategory] = useState("all")
  const [searchQuery, setSearchQuery] = useState("")

  const filteredMovies = movies.filter((movie) => {
    const matchesCategory = selectedCategory === "all" || movie.category === selectedCategory
    const matchesSearch = movie.title.toLowerCase().includes(searchQuery.toLowerCase())
    return matchesCategory && matchesSearch
  })

  return (
    <div className="flex min-h-screen">
      <Sidebar />

      <main className="flex-1 ml-20 p-8">
        {/* Header */}
        <div className="mb-6">
          <h1 className="text-3xl font-bold text-foreground">Movies</h1>
          <p className="text-muted-foreground">Browse and watch your favorite movies</p>
        </div>

        {/* Filter Bar */}
        <FilterBar
          categories={categories}
          selectedCategory={selectedCategory}
          onCategoryChange={setSelectedCategory}
          searchQuery={searchQuery}
          onSearchChange={setSearchQuery}
          placeholder="Search movies..."
        />

        {/* Movies Grid */}
        <div className="mt-6">
          {filteredMovies.length > 0 ? (
            <ContentGrid items={filteredMovies} />
          ) : (
            <div className="flex flex-col items-center justify-center py-20">
              <p className="text-2xl font-semibold text-muted-foreground">No movies found</p>
              <p className="text-muted-foreground mt-2">Try adjusting your filters or search query</p>
            </div>
          )}
        </div>
      </main>
    </div>
  )
}
