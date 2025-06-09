"use client"

import { Play } from "lucide-react"
import { Button } from "@/components/ui/button"

interface WatchButtonProps {
  watchUrl: string
  title: string
  size?: "sm" | "lg" | "default"
  className?: string
}

export function WatchButton({ watchUrl, title, size = "default", className = "" }: WatchButtonProps) {
  const handleWatch = () => {
    // Abrir em nova aba
    window.open(watchUrl, "_blank", "noopener,noreferrer")
  }

  return (
    <Button size={size} className={`bg-red-600 hover:bg-red-700 ${className}`} onClick={handleWatch}>
      <Play className="w-4 h-4 mr-2" />
      Assistir {title}
    </Button>
  )
}
