import { Heart, PenTool } from "lucide-react"

interface LogoProps {
  className?: string
  showText?: boolean
}

export function Logo({ className = "", showText = true }: LogoProps) {
  return (
    <div className={`flex items-center gap-2 ${className}`}>
      <div className="relative">
        <Heart className="w-8 h-8 text-primary fill-current" />
        <PenTool className="w-4 h-4 text-secondary absolute -bottom-1 -right-1" />
      </div>
      {showText && (
        <span className="font-playfair font-bold text-2xl bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
          Dil Se Likho
        </span>
      )}
    </div>
  )
}
