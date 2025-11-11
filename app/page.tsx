"use client"

import { useState } from "react"
import { Search } from "lucide-react"
import { Sidebar } from "@/components/sidebar"
import { ContentGridHorizontal } from "@/components/content-grid-horizontal"
import { ContentGrid } from "@/components/content-grid"
import { liveChannels, movies, series } from "@/lib/data"
import { Input } from "@/components/ui/input"

export default function HomePage() {
  const [searchQuery, setSearchQuery] = useState("")

  const filteredLiveChannels = liveChannels.filter((channel) =>
    channel.title.toLowerCase().includes(searchQuery.toLowerCase()),
  )

  const filteredMovies = movies.filter((movie) => movie.title.toLowerCase().includes(searchQuery.toLowerCase()))

  const filteredSeries = series.filter((show) => show.title.toLowerCase().includes(searchQuery.toLowerCase()))

  const hasResults = filteredLiveChannels.length > 0 || filteredMovies.length > 0 || filteredSeries.length > 0

  return (
    <div className="flex min-h-screen">
      <Sidebar />

      <main className="flex-1 ml-20 p-8">
        {/* Header */}
        <div className="mb-8 flex items-center gap-4">
          <div className="text-3xl font-bold text-primary">IPTV</div>
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
            <Input
              type="text"
              placeholder="Search By Title"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10 bg-secondary border-border"
            />
          </div>
        </div>

        {searchQuery && !hasResults && (
          <div className="flex flex-col items-center justify-center py-20">
            <p className="text-2xl font-semibold text-muted-foreground">No results found</p>
            <p className="text-muted-foreground mt-2">Try searching for something else</p>
          </div>
        )}

        {/* Live Channels */}
        {filteredLiveChannels.length > 0 && (
          <section className="mb-12">
            <h2 className="text-2xl font-semibold mb-4 text-foreground">
              Live {searchQuery && `(${filteredLiveChannels.length})`}
            </h2>
            <ContentGridHorizontal items={filteredLiveChannels} />
          </section>
        )}

        {/* Movies */}
        {filteredMovies.length > 0 && (
          <section className="mb-12">
            <h2 className="text-2xl font-semibold mb-4 text-foreground">
              Movies {searchQuery && `(${filteredMovies.length})`}
            </h2>
            <ContentGrid items={filteredMovies} />
          </section>
        )}

        {/* Series */}
        {filteredSeries.length > 0 && (
          <section>
            <h2 className="text-2xl font-semibold mb-4 text-foreground">
              Series {searchQuery && `(${filteredSeries.length})`}
            </h2>
            <ContentGrid items={filteredSeries.slice(0, 2)} />
          </section>
        )}
      </main>
    </div>
  )
}
