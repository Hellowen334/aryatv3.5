"use client"

import { useState } from "react"
import { Sidebar } from "@/components/sidebar"
import { VideoPlayer } from "@/components/video-player"
import { ChannelList } from "@/components/channel-list"
import { liveChannels, categories } from "@/lib/data"

export default function LivePage() {
  const [selectedChannel, setSelectedChannel] = useState(liveChannels[0])
  const [selectedCategory, setSelectedCategory] = useState("all")

  const filteredChannels =
    selectedCategory === "all" ? liveChannels : liveChannels.filter((channel) => channel.category === selectedCategory)

  return (
    <div className="flex min-h-screen">
      <Sidebar />

      <main className="flex-1 ml-20 p-8">
        {/* Header */}
        <div className="mb-6">
          <h1 className="text-3xl font-bold text-foreground">Live TV</h1>
          <p className="text-muted-foreground">Watch live channels</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Video Player */}
          <div className="lg:col-span-2">
            <VideoPlayer channel={selectedChannel} />
          </div>

          {/* Channel List */}
          <div>
            <ChannelList
              channels={filteredChannels}
              categories={categories}
              selectedChannel={selectedChannel}
              selectedCategory={selectedCategory}
              onChannelSelect={setSelectedChannel}
              onCategorySelect={setSelectedCategory}
            />
          </div>
        </div>
      </main>
    </div>
  )
}
