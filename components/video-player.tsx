"use client"

import { useState } from "react"
import { Play, Pause, Volume2, VolumeX, Maximize, Settings } from "lucide-react"
import type { Channel } from "@/lib/data"
import { Button } from "@/components/ui/button"
import { Slider } from "@/components/ui/slider"
import { cn } from "@/lib/utils"

interface VideoPlayerProps {
  channel: Channel
}

export function VideoPlayer({ channel }: VideoPlayerProps) {
  const [isPlaying, setIsPlaying] = useState(true)
  const [isMuted, setIsMuted] = useState(false)
  const [volume, setVolume] = useState([75])
  const [showControls, setShowControls] = useState(true)

  return (
    <div className="relative w-full">
      {/* Video Container */}
      <div
        className="relative w-full aspect-video bg-black rounded-lg overflow-hidden"
        onMouseEnter={() => setShowControls(true)}
        onMouseLeave={() => setShowControls(false)}
      >
        {/* Demo Video Placeholder */}
        <div className="absolute inset-0 flex items-center justify-center">
          <img
            src={channel.thumbnail || "/placeholder.svg"}
            alt={channel.title}
            className="w-full h-full object-cover"
          />
          {channel.isLive && (
            <div className="absolute top-4 left-4 bg-destructive text-destructive-foreground px-3 py-1 rounded-md font-semibold text-sm">
              LIVE
            </div>
          )}
        </div>

        {/* Controls Overlay */}
        <div
          className={cn(
            "absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 to-transparent p-4 transition-opacity duration-300",
            showControls ? "opacity-100" : "opacity-0",
          )}
        >
          {/* Progress Bar */}
          <div className="mb-4">
            <Slider value={[45]} max={100} step={1} className="w-full cursor-pointer" />
          </div>

          {/* Control Buttons */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              {/* Play/Pause */}
              <Button
                size="icon"
                variant="ghost"
                className="text-white hover:bg-white/20"
                onClick={() => setIsPlaying(!isPlaying)}
              >
                {isPlaying ? <Pause className="h-5 w-5" /> : <Play className="h-5 w-5" />}
              </Button>

              {/* Volume */}
              <div className="flex items-center gap-2">
                <Button
                  size="icon"
                  variant="ghost"
                  className="text-white hover:bg-white/20"
                  onClick={() => setIsMuted(!isMuted)}
                >
                  {isMuted ? <VolumeX className="h-5 w-5" /> : <Volume2 className="h-5 w-5" />}
                </Button>
                <Slider value={volume} onValueChange={setVolume} max={100} step={1} className="w-24 cursor-pointer" />
              </div>

              {/* Time */}
              <div className="text-white text-sm font-mono">01:23:45 / 02:00:00</div>
            </div>

            <div className="flex items-center gap-2">
              {/* Settings */}
              <Button size="icon" variant="ghost" className="text-white hover:bg-white/20">
                <Settings className="h-5 w-5" />
              </Button>

              {/* Fullscreen */}
              <Button size="icon" variant="ghost" className="text-white hover:bg-white/20">
                <Maximize className="h-5 w-5" />
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Channel Info */}
      <div className="mt-4">
        <h2 className="text-2xl font-bold text-foreground">{channel.title}</h2>
        <p className="text-muted-foreground capitalize">{channel.category}</p>
      </div>
    </div>
  )
}
