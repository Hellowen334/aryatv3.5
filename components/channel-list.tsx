"use client"

import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import type { Channel, Category } from "@/lib/data"
import { cn } from "@/lib/utils"

interface ChannelListProps {
  channels: Channel[]
  categories: Category[]
  selectedChannel: Channel
  selectedCategory: string
  onChannelSelect: (channel: Channel) => void
  onCategorySelect: (category: string) => void
}

export function ChannelList({
  channels,
  categories,
  selectedChannel,
  selectedCategory,
  onChannelSelect,
  onCategorySelect,
}: ChannelListProps) {
  return (
    <div className="space-y-4">
      {/* Category Filter */}
      <div>
        <h3 className="text-lg font-semibold mb-3 text-foreground">Categories</h3>
        <div className="flex flex-wrap gap-2">
          {categories.map((category) => (
            <Button
              key={category.id}
              variant={selectedCategory === category.id ? "default" : "outline"}
              size="sm"
              onClick={() => onCategorySelect(category.id)}
              className={cn("capitalize", selectedCategory === category.id && "bg-primary text-primary-foreground")}
            >
              {category.name} ({category.count})
            </Button>
          ))}
        </div>
      </div>

      {/* Channel List */}
      <div>
        <h3 className="text-lg font-semibold mb-3 text-foreground">Channels ({channels.length})</h3>
        <div className="space-y-2 max-h-[600px] overflow-y-auto pr-2">
          {channels.map((channel) => (
            <Card
              key={channel.id}
              className={cn(
                "p-0 overflow-hidden cursor-pointer transition-all hover:ring-2 hover:ring-primary",
                selectedChannel.id === channel.id && "ring-2 ring-primary bg-secondary",
              )}
              onClick={() => onChannelSelect(channel)}
            >
              <div className="flex gap-3 p-3">
                {/* Thumbnail */}
                <div className="relative w-24 h-16 flex-shrink-0 rounded-md overflow-hidden bg-muted">
                  <img
                    src={channel.thumbnail || "/placeholder.svg"}
                    alt={channel.title}
                    className="w-full h-full object-cover"
                  />
                  {channel.isLive && (
                    <div className="absolute top-1 right-1 bg-destructive text-destructive-foreground px-1.5 py-0.5 rounded text-xs font-semibold">
                      LIVE
                    </div>
                  )}
                </div>

                {/* Info */}
                <div className="flex-1 min-w-0">
                  <h4 className="font-semibold text-foreground truncate">{channel.title}</h4>
                  <p className="text-sm text-muted-foreground capitalize">{channel.category}</p>
                </div>
              </div>
            </Card>
          ))}
        </div>
      </div>
    </div>
  )
}
