"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { Home, Tv, Film, MonitorPlay, Settings, LogOut } from "lucide-react"
import { cn } from "@/lib/utils"

const navItems = [
  { icon: Home, href: "/", label: "Ana Sayfa" },
  { icon: Tv, href: "/live", label: "Canlı TV" },
  { icon: Film, href: "/movies", label: "Filmler" },
  { icon: MonitorPlay, href: "/series", label: "Diziler" },
  { icon: Settings, href: "/settings", label: "Ayarlar" },
  { icon: LogOut, href: "/logout", label: "Çıkış" },
]

export function Sidebar() {
  const pathname = usePathname()

  return (
    <aside className="fixed left-0 top-0 z-40 h-screen w-20 bg-card border-r border-border">
      {/* Logo */}
      <div className="flex h-20 items-center justify-center border-b border-border">
        <div className="flex flex-col items-center">
          <div className="text-primary font-bold text-xl">IPTV</div>
          <div className="text-primary text-[10px]">PLAYER</div>
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex flex-col items-center gap-2 p-3">
        {navItems.map((item) => {
          const Icon = item.icon
          const isActive = pathname === item.href

          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "flex h-12 w-12 items-center justify-center rounded-lg transition-colors",
                isActive
                  ? "bg-primary text-primary-foreground"
                  : "text-muted-foreground hover:bg-secondary hover:text-foreground",
              )}
              aria-label={item.label}
            >
              <Icon className="h-5 w-5" />
            </Link>
          )
        })}
      </nav>
    </aside>
  )
}
