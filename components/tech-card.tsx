import type React from "react"
import { cn } from "@/lib/utils"

interface TechCardProps {
  title: string
  subtitle?: string
  children: React.ReactNode
  className?: string
  accentColor?: "blue" | "purple" | "pink"
}

export function TechCard({ title, subtitle, children, className, accentColor = "blue" }: TechCardProps) {
  const colors = {
    blue: "border-neon-blue/30 text-neon-blue shadow-neon-blue/5",
    purple: "border-neon-purple/30 text-neon-purple shadow-neon-purple/5",
    pink: "border-neon-pink/30 text-neon-pink shadow-neon-pink/5",
  }

  const cornerColors = {
    blue: "bg-neon-blue",
    purple: "bg-neon-purple",
    pink: "bg-neon-pink",
  }

  return (
    <div
      className={cn(
        "relative bg-[#0f172a]/80 backdrop-blur-md border p-6 overflow-hidden group transition-all duration-500",
        colors[accentColor],
        "box-glow-blue", // Base glow
        className,
      )}
    >
      {/* Decorative Corners */}
      <div className={cn("absolute top-0 left-0 w-2 h-2", cornerColors[accentColor])} />
      <div className={cn("absolute top-0 right-0 w-2 h-2", cornerColors[accentColor])} />
      <div className={cn("absolute bottom-0 left-0 w-2 h-2", cornerColors[accentColor])} />
      <div className={cn("absolute bottom-0 right-0 w-2 h-2", cornerColors[accentColor])} />

      {/* Scanlines */}
      <div className="absolute inset-0 pointer-events-none opacity-5 bg-[linear-gradient(transparent_1px,_transparent_1px),_linear-gradient(90deg,_#ffffff_1px,_transparent_1px)] bg-[size:20px_20px]" />

      {/* Header */}
      <div className="relative z-10 mb-6 border-b border-white/5 pb-2 flex justify-between items-end">
        <div>
          <h3
            className={cn(
              "font-rajdhani font-bold text-xl tracking-wider uppercase",
              `text-${accentColor === "blue" ? "neon-blue" : accentColor === "purple" ? "neon-purple" : "neon-pink"}`,
            )}
          >
            {title}
          </h3>
          {subtitle && <p className="text-xs text-slate-500 font-mono uppercase tracking-widest">{subtitle}</p>}
        </div>
        <div className="flex gap-1">
          <div className={cn("w-1 h-1 rounded-full", cornerColors[accentColor])} />
          <div className={cn("w-1 h-1 rounded-full opacity-50", cornerColors[accentColor])} />
          <div className={cn("w-1 h-1 rounded-full opacity-25", cornerColors[accentColor])} />
        </div>
      </div>

      {/* Content */}
      <div className="relative z-10">{children}</div>
    </div>
  )
}
