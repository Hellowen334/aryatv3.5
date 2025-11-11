"use client"

import Image from "next/image"
import type { Channel } from "@/lib/data"

interface ContentGridProps {
  items: Channel[]
  onItemClick?: (item: Channel) => void
}

export function ContentGrid({ items, onItemClick }: ContentGridProps) {
  return (
    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6 gap-4">
      {items.map((item) => (
        <button
          key={item.id}
          onClick={() => onItemClick?.(item)}
          className="group relative aspect-[3/4] overflow-hidden rounded-lg bg-secondary transition-transform hover:scale-105 focus:outline-none focus:ring-2 focus:ring-ring"
        >
          <Image src={item.thumbnail || "/placeholder.svg"} alt={item.title} fill className="object-cover" />
          {item.isLive && (
            <div className="absolute top-2 right-2 bg-red-600 text-white text-xs px-2 py-1 rounded">LIVE</div>
          )}
          <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 to-transparent p-3">
            <p className="text-sm font-medium text-white truncate">{item.title}</p>
          </div>
        </button>
      ))}
    </div>
  )
}
